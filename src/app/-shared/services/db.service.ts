import {Injectable} from '@angular/core';
import {APP_CONFIG} from '../../app.config';
import {AngularIndexedDB} from '../TODO/angular-indexed-db';
import {BooksModel} from '../models/books.model';
import {Http} from '@angular/http';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel} from '../models/books2libraries.model';

@Injectable()
export class DbService {

  private db = new AngularIndexedDB(APP_CONFIG.db.name, APP_CONFIG.db.version);
  private dbReadyPromise: Promise<any>;
  private isTablesJustCreated = false;

  constructor(private http: Http) {
    this.dbReadyPromise = this.db.openDatabase(APP_CONFIG.db.version, this.createTables.bind(this))
      .then(() => {
        if (!this.isTablesJustCreated) {
          return;
        }
        this.isTablesJustCreated = false;
        return Promise.all([
          this.fillBooks(),
          this.fillLibraries(),
          this.fillBooks2Libraries()
        ]);
      })
      .catch((error) => {
        console.error('db.error', error);
        return Promise.reject(error);
      });
  }

  public list(table): Promise<any[]> {
    return this.dbReadyPromise
      .then(() => this.db.getAll(table))
      .then((objs: any[]) => {
        return objs;
      }, (error) => {
        return Promise.reject(error);
      });
  }

  public update(table, model): Promise<any> {
    return this.db.update(table, model)
      .then((data) => {
        return Promise.resolve(data);
      }, (error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  private createTables(evt: any) {
    const booksStore: IDBObjectStore = evt.currentTarget.result
      .createObjectStore(APP_CONFIG.db.tables.books, {keyPath: 'id'});
    booksStore.createIndex('name', 'name', {unique: false});
    booksStore.createIndex('author', 'author', {unique: false});
    booksStore.createIndex('ISBN', 'ISBN', {unique: true});
    booksStore.createIndex('year', 'year', {unique: false});

    const librariesStore: IDBObjectStore = evt.currentTarget.result
      .createObjectStore(APP_CONFIG.db.tables.libraries, {keyPath: 'id'});
    librariesStore.createIndex('name', 'name', {unique: false});
    librariesStore.createIndex('address', 'address', {unique: false});

    const books2librariesStore: IDBObjectStore = evt.currentTarget.result
      .createObjectStore(APP_CONFIG.db.tables.books2libraries, {keyPath: 'id', autoIncrement: true});
    books2librariesStore.createIndex('bookId', 'bookId', {unique: false});
    books2librariesStore.createIndex('libraryId', 'libraryId', {unique: false});

    this.isTablesJustCreated = true;
  }

  private fillBooks() {
    return this.http.get(APP_CONFIG.url.books)
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        const books: BooksModel[] = arr.map((obj) => new BooksModel(obj));
        const promises = [];
        books.forEach((book) => {
          promises.push(this.db.add(APP_CONFIG.db.tables.books, book));
        });
        return promises;
      });
  }

  private fillLibraries() {
    return this.http.get(APP_CONFIG.url.libraries)
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        const libraries: LibrariesModel[] = arr.map((obj) => new LibrariesModel(obj));
        const promises = [];
        libraries.forEach((library) => {
          promises.push(this.db.add(APP_CONFIG.db.tables.libraries, library));
        });
        return promises;
      });
  }

  private fillBooks2Libraries() {
    return this.http.get(APP_CONFIG.url.books2libraries)
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        console.log('arr', arr);
        const books2libraries: Books2librariesModel[] = arr.map((obj) => new Books2librariesModel(obj));
        console.log('books2libraries', books2libraries);
        const promises = [];
        books2libraries.forEach((book2library) => {
          promises.push(this.db.add(APP_CONFIG.db.tables.books2libraries, book2library));
        });
        return promises;
      });
  }

}
