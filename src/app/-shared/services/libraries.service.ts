import * as moment from 'moment';
import {Injectable} from '@angular/core';

import {DbService} from './db.service';
import {APP_CONFIG} from '../../app.config';
import {BooksService} from './books.service';
import {BooksModel} from '../models/books.model';
import {ChangesService} from './changes.service';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel, BOOKS_BOOKING_STATUS} from '../models/books2libraries.model';

/**
 * Service for Libraries and Books inside Libraries
 */
@Injectable()
export class LibrariesService {

  constructor(
    private db: DbService,
    private booksService: BooksService,
    private changesService: ChangesService) {
  }

  /**
   * Get all libraries with books inside it
   * @return {Promise<LibrariesModel[]>}
   */
  public getFullLibraries(): Promise<LibrariesModel[]> {
    let libraries;
    return this.list()
      .then((libs: LibrariesModel[]) => {
        libraries = libs;
        return this.books2libraries(libraries);
      })
      .then(() => libraries);
  }

  /**
   * Get all libraries
   * @return {Promise<LibrariesModel[]>}
   */
  public list(): Promise<LibrariesModel[]> {
    return this.db.list(APP_CONFIG.db.tables.libraries)
      .then((objs: any[]) => objs.map((obj) => new LibrariesModel(obj)))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Update/Add library
   * @param {LibrariesModel} library
   * @return {Promise<LibrariesModel>}
   */
  public save(library: LibrariesModel): Promise<LibrariesModel> {
    return this.db.update(APP_CONFIG.db.tables.libraries, library)
      .then((obj) => new LibrariesModel(obj))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Delete library from DB
   * @param {LibrariesModel} library
   * @return {Promise<any>}
   */
  public delete(library: LibrariesModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.libraries, library.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Get books inside libraries and update libraries list
   * @param {LibrariesModel[]} libraries
   * @return {Promise<any>}
   */
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

  /**
   * Delete book from all librariws
   * @param {LibrariesModel[]} libraries
   * @param {BooksModel} bookDeleted
   */
  public removeAllBookFromLibraries(libraries: LibrariesModel[], bookDeleted: BooksModel) {
    libraries.forEach((library: LibrariesModel) => {
      const book2library = library.book2library
        .filter((b2l: Books2librariesModel) => b2l.book.id !== bookDeleted.id);
      if (book2library.length !== library.book2library.length) {
        library.book2library = book2library;
      }
    });
  }

  /**
   * Remove book from library
   * @param {Books2librariesModel} book2library
   * @return {Promise<any>}
   */
  public removeBook(book2library: Books2librariesModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.books2libraries, book2library.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Add book to the library by book
   * @param {BooksModel} book
   * @param {LibrariesModel} library
   * @return {Promise<Books2librariesModel>}
   */
  public addBook(book: BooksModel, library: LibrariesModel): Promise<Books2librariesModel> {
    const books2libraries = new Books2librariesModel({
      bookId: book.id,
      libraryId: library.id,
      status: BOOKS_BOOKING_STATUS.FREE,
      rentTime: ''
    });
    return this.addBook2Library(books2libraries);
  }

  /**
   * Add book to library by link
   * @param {Books2librariesModel} book2library
   * @return {Promise<Books2librariesModel>}
   */
  public addBook2Library(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    delete book2library.id;
    return this.saveBook2Library(book2library);
  }

  /**
   * Update book status inside library by link
   * @param {Books2librariesModel} book2library
   * @return {Promise<Books2librariesModel>}
   */
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

  /**
   * Booking book in library by book
   * @param {BooksModel} book
   * @param {LibrariesModel} library
   * @return {Promise<Books2librariesModel>}
   */
  public bookBookInLibrary(book: BooksModel, library: LibrariesModel): Promise<Books2librariesModel> {
    const book2library = library.book2library
      .find((b2l) => b2l.bookId === book.id && !this.isBookRented(b2l));
    return this.bookBook(book2library);
  }

  /**
   * Booking book in library by link
   * @param {Books2librariesModel} book2library
   * @return {Promise<Books2librariesModel>}
   */
  public bookBook(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    book2library.status = BOOKS_BOOKING_STATUS.RENTED;
    book2library.rentTime = moment().add(APP_CONFIG.bookingMinutes, 'm').toISOString(true);
    return this.saveBook2Library(book2library);
  }

  /**
   * Change booking status to FREE
   * @param {Books2librariesModel} book2library
   * @return {Promise<Books2librariesModel>}
   */
  public returnBook(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    book2library.status = BOOKS_BOOKING_STATUS.FREE;
    book2library.rentTime = moment().toISOString(true);
    return this.saveBook2Library(book2library);
  }

  /**
   * Get second to end of the booking in seconds
   * @param {Books2librariesModel} book2library
   * @return {number}
   */
  public bookRentedTimeDiff(book2library: Books2librariesModel): number {
    return moment(book2library.rentTime).diff(moment(), 'seconds');
  }

  /**
   * Get second to end of the booking in humans string
   * @param {Books2librariesModel} book2library
   * @return {string}
   */
  public bookRentedTimeDiffString(book2library: Books2librariesModel): string {
    return moment.duration(this.bookRentedTimeDiff(book2library), 'seconds').humanize();
  }

  /**
   * Check is book rented of free
   * @param {Books2librariesModel} book2library
   * @return {boolean}
   */
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

  /**
   * Update library list with books inside it
   * @param {LibrariesModel[]} libraries
   * @param {Books2librariesModel[]} books2libraries
   * @return {Promise<any>}
   */
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

  /**
   * Get all libraries and filter them where book present
   * @param {BooksModel} book
   * @return {Promise<any>}
   */
  public getLibrariesForBook(book: BooksModel): Promise<any> {
    return this.getFullLibraries()
      .then((libraries: LibrariesModel[]) => {
        const rented = this.getLibrariesWithBookAndStatus(book, libraries, BOOKS_BOOKING_STATUS.RENTED);
        const free = this.getLibrariesWithBookAndStatus(book, libraries, BOOKS_BOOKING_STATUS.FREE);
        return {free, rented};
      });
  }

  /**
   * Get min diff time of book in library
   * @param {BooksModel} book
   * @param {LibrariesModel} library
   * @return {string}
   */
  public getMinDiffTime(book: BooksModel, library: LibrariesModel): string {

    const book2libraries: Books2librariesModel[] = library.book2library
      .filter((book2library) => book2library.bookId === book.id && this.isBookRented(book2library));

    let minBooks2librariesModel: Books2librariesModel = book2libraries[0];

    book2libraries.reduce((min, book2library) => {
      const current = this.bookRentedTimeDiff(book2library);
      if (current < min) {
        minBooks2librariesModel = book2library;
        return current;
      }
      return min;
    }, 0);

    return minBooks2librariesModel ? this.bookRentedTimeDiffString(minBooks2librariesModel) : '';
  }

  /**
   * Get libraries where book present with some status
   * @param {BooksModel} book
   * @param {LibrariesModel[]} libraries
   * @param {string} status
   * @return {LibrariesModel[]}
   */
  private getLibrariesWithBookAndStatus(book: BooksModel, libraries: LibrariesModel[], status: string): LibrariesModel[] {
    return this.getLibrariesWithBook(book, libraries)
      .filter((library: LibrariesModel) => this.isBookInLibraryWithStatus(book, library, status));
  }

  /**
   * Filter libraries by book present it
   * @param {BooksModel} book
   * @param {LibrariesModel[]} libraries
   * @return {LibrariesModel[]}
   */
  private getLibrariesWithBook(book: BooksModel, libraries: LibrariesModel[]): LibrariesModel[] {
    return libraries
      .filter((library: LibrariesModel) => this.isBookInLibrary(book, library));
  }

  /**
   * Check is book present in the library
   * @param {BooksModel} book
   * @param {LibrariesModel} library
   * @return {boolean}
   */
  private isBookInLibrary(book: BooksModel, library: LibrariesModel): boolean {
    return library.book2library.some((book2library) => book2library.bookId === book.id);
  }

  /**
   * Check is book present it library with some status
   * @param {BooksModel} book
   * @param {LibrariesModel} library
   * @param {string} status
   * @return {boolean}
   */
  private isBookInLibraryWithStatus(book: BooksModel, library: LibrariesModel, status: string): boolean {
    return library.book2library.some((book2library) => {
      if (status === BOOKS_BOOKING_STATUS.RENTED) {
        return this.isBookRented(book2library);
      }
      return book2library.bookId === book.id && book2library.status === status;
    });
  }

}
