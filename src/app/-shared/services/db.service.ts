import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {AngularIndexedDB} from 'angular2-indexeddb';

import {APP_CONFIG} from '../../app.config';
import {BooksModel} from '../models/books.model';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel} from '../models/books2libraries.model';

/**
 * Service for IndexedDB
 */
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

  /**
   * Get list of assets
   * @param {string} table
   * @return {Promise<any[]>}
   */
  public list(table: string): Promise<any[]> {
    return this.dbReadyPromise
      .then(() => this.db.getAll(table))
      .then((objs: any[]) => {
        return objs;
      }, (error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Get asset by ID
   * @param {string} table
   * @param {string} id
   * @return {Promise<any[]>}
   */
  public getById(table: string, id: string): Promise<any[]> {
    return this.dbReadyPromise
      .then(() => this.db.getByKey(table, id))
      .then((obj: any) => obj, (error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Update/add asset to table
   * @param {string} table
   * @param model
   * @return {Promise<any>}
   */
  public update(table: string, model: any): Promise<any> {
    return this.db.update(table, model)
      .then((data) => {
        return Promise.resolve(data);
      }, (error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * Add asset to table
   * @param {string} table
   * @param data
   * @return {Promise<any>}
   */
  public add(table: string, data: any): Promise<any> {
    return this.db.add(table, data)
      .then((res) => {
        return Promise.resolve(res);
      }, (error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * Delete asset from table
   * @param {string} table
   * @param {string | number} id
   * @return {Promise<any>}
   */
  public delete(table: string, id: string|number): Promise<any> {
    return this.db.delete(table, id)
      .then((data) => {
        return Promise.resolve(data);
      }, (error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * Clear table
   * @param {string} table
   * @return {Promise<any>}
   */
  public clear(table: string): Promise<any> {
    return this.db.clear(table);
  }

  /**
   * Init tables
   * @param evt
   */
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

  /**
   * Initial fill books
   * @return {Promise<any[]>}
   */
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

  /**
   * Initial fill libraries
   * @return {Promise<any[]>}
   */
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

  /**
   * Initial fill books to libraries
   * @return {Promise<any[]>}
   */
  private fillBooks2Libraries() {
    return this.http.get(APP_CONFIG.url.books2libraries)
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        const books2libraries: Books2librariesModel[] = arr.map((obj) => {
          const b2l = new Books2librariesModel(obj);
          delete b2l.id;
          return b2l;
        });
        const promises = [];
        books2libraries.forEach((book2library) => {
          promises.push(this.db.add(APP_CONFIG.db.tables.books2libraries, book2library));
        });
        return promises;
      });
  }

}
