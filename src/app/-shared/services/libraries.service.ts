import {Injectable} from '@angular/core';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel, BOOKS_BOOKING_STATUS} from '../models/books2libraries.model';
import {APP_CONFIG} from '../../app.config';
import {DbService} from './db.service';
import {BooksService} from './books.service';
import {BooksModel} from '../models/books.model';

@Injectable()
export class LibrariesService {

  constructor(
    private db: DbService,
    private booksService: BooksService) {
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
    delete books2libraries.id;
    return this.db.add(APP_CONFIG.db.tables.books2libraries, books2libraries)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public saveBook2Library(book2library: Books2librariesModel): Promise<Books2librariesModel> {
    delete book2library.id;
    return this.db.add(APP_CONFIG.db.tables.books2libraries, book2library)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  private updateLibraries(libraries: LibrariesModel[], books2libraries: Books2librariesModel[]): Promise<any> {
    const librariesObj = libraries.reduce((obj, library) => {
      obj[library.id] = library;
      return obj;
    }, {});

    const promises = [];

    books2libraries.forEach((book2library: Books2librariesModel) => {
      const library: LibrariesModel = librariesObj[book2library.libraryId];
      const promise = this.booksService.getById(book2library.bookId)
        .then((book: BooksModel) => {
          book2library.book = book;
          library.book2library.push(book2library);
        });
      promises.push(promise);
    });

    return Promise.all(promises);
  }

}
