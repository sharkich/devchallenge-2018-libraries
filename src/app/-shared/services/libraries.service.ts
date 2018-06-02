import {Injectable} from '@angular/core';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel, BOOKS_BOOKING_STATUS} from '../models/books2libraries.model';
import {APP_CONFIG} from '../../app.config';
import {DbService} from './db.service';
import {BooksService} from './books.service';
import {BooksModel} from '../models/books.model';
import {ChangesService} from './changes.service';
import * as moment from 'moment';

@Injectable()
export class LibrariesService {

  constructor(
    private db: DbService,
    private booksService: BooksService,
    private changesService: ChangesService) {
  }

  public getFullLibraries(): Promise<LibrariesModel[]> {
    let libraries;
    return this.list()
      .then((libs: LibrariesModel[]) => {
        libraries = libs;
        return this.books2libraries(libraries);
      })
      .then(() => libraries);
  }

  public list(): Promise<LibrariesModel[]> {
    return this.db.list(APP_CONFIG.db.tables.libraries)
      .then((objs: any[]) => objs.map((obj) => new LibrariesModel(obj)))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public save(library: LibrariesModel): Promise<LibrariesModel> {
    return this.db.update(APP_CONFIG.db.tables.libraries, library)
      .then((obj) => new LibrariesModel(obj))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public delete(library: LibrariesModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.libraries, library.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public books2libraries(libraries?: LibrariesModel[]): Promise<any> {
    return this.db.list(APP_CONFIG.db.tables.books2libraries)
      .then((objs: any) => {
        const books2libraries = objs.map((obj) => new Books2librariesModel(obj));
        if (!libraries) {
          return books2libraries;
        }

        return this.updateLibraries(libraries, books2libraries);

      })
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public removeAllBookFromLibraries(libraries: LibrariesModel[], bookDeleted: BooksModel) {
    libraries.forEach((library: LibrariesModel) => {
      const book2library = library.book2library
        .filter((b2l: Books2librariesModel) => b2l.book.id !== bookDeleted.id);
      if (book2library.length !== library.book2library.length) {
        library.book2library = book2library;
      }
    });
  }

  public removeBook(book2library: Books2librariesModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.books2libraries, book2library.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public addBook(book: BooksModel, library: LibrariesModel): Promise<Books2librariesModel> {
    const books2libraries = new Books2librariesModel({
      bookId: book.id,
      libraryId: library.id,
      status: BOOKS_BOOKING_STATUS.FREE,
      rentTime: ''
    });
    return this.addBook2Library(books2libraries);
  }

  public addBook2Library(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    delete book2library.id;
    return this.saveBook2Library(book2library);
  }

  public saveBook2Library(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    return this.db.update(APP_CONFIG.db.tables.books2libraries, book2library)
      .then((res) => {
        this.changesService.book.emit(book2library.book);
        this.changesService.book2Library.emit(book2library);
        return res;
      })
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public bookBookInLibrary(book: BooksModel, library: LibrariesModel): Promise<Books2librariesModel> {
    const book2library = library.book2library
      .find((b2l) => b2l.bookId === book.id && !this.isBookRented(b2l));
    return this.bookBook(book2library);
  }

  public bookBook(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    book2library.status = BOOKS_BOOKING_STATUS.RENTED;
    book2library.rentTime = moment().add(APP_CONFIG.bookingMinutes, 'm').toISOString(true);
    return this.saveBook2Library(book2library);
  }

  public returnBook(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    book2library.status = BOOKS_BOOKING_STATUS.FREE;
    book2library.rentTime = moment().toISOString(true);
    return this.saveBook2Library(book2library);
  }

  public bookRentedTimeDiff(book2library: Books2librariesModel): number {
    return moment(book2library.rentTime).diff(moment(), 'seconds');
  }

  public bookRentedTimeDiffString(book2library: Books2librariesModel): string {
    return moment.duration(this.bookRentedTimeDiff(book2library), 'seconds').humanize();
  }

  public isBookRented(book2library: Books2librariesModel): boolean {
    if (!book2library) {
      return;
    }
    if (!book2library.rentTime) {
      return false;
    }
    if (book2library.status !== BOOKS_BOOKING_STATUS.RENTED) {
      return false;
    }
    if (this.bookRentedTimeDiff(book2library) <= 0) {
      book2library.status = BOOKS_BOOKING_STATUS.FREE;
      this.returnBook(book2library);
      return false;
    }
    return true;
  }

  private updateLibraries(libraries: LibrariesModel[], books2libraries: Books2librariesModel[]): Promise<any> {
    if (!libraries || !libraries.length || !books2libraries || !books2libraries.length) {
      return;
    }
    const librariesObj = libraries.reduce((obj, library) => {
      obj[library.id] = library;
      return obj;
    }, {});

    const promises = [];

    books2libraries.forEach((book2library: Books2librariesModel) => {
      if (!book2library) {
        return;
      }
      const library: LibrariesModel = librariesObj[book2library.libraryId];
      if (!library) {
        return;
      }
      const promise = this.booksService.getById(book2library.bookId)
        .then((book: BooksModel) => {
          if (!book) {
            return;
          }
          book2library.book = book;
          book2library.library = library;
          library.book2library.push(book2library);
        });
      promises.push(promise);
    });

    return Promise.all(promises);
  }

  public getLibrariesForBook(book: BooksModel): Promise<any> {
    return this.getFullLibraries()
      .then((libraries: LibrariesModel[]) => {
        const rented = this.getLibrariesWithBookAndStatus(book, libraries, BOOKS_BOOKING_STATUS.RENTED);
        const free = this.getLibrariesWithBookAndStatus(book, libraries, BOOKS_BOOKING_STATUS.FREE);
        return {free, rented};
      });
  }

  private getLibrariesWithBookAndStatus(book: BooksModel, libraries: LibrariesModel[], status: string): LibrariesModel[] {
    return this.getLibrariesWithBook(book, libraries)
      .filter((library: LibrariesModel) => this.isBookInLibraryWithStatus(book, library, status));
  }

  private getLibrariesWithBook(book: BooksModel, libraries: LibrariesModel[]): LibrariesModel[] {
    return libraries
      .filter((library: LibrariesModel) => this.isBookInLibrary(book, library));
  }

  private isBookInLibrary(book: BooksModel, library: LibrariesModel): boolean {
    return library.book2library.some((book2library) => book2library.bookId === book.id);
  }

  private isBookInLibraryWithStatus(book: BooksModel, library: LibrariesModel, status: string): boolean {
    return library.book2library.some((book2library) => {
      if (status === BOOKS_BOOKING_STATUS.RENTED) {
        return this.isBookRented(book2library);
      }
      return book2library.bookId === book.id && book2library.status === status;
    });
  }

}
