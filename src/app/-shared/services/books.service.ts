import { Injectable } from '@angular/core';

import {DbService} from './db.service';
import {APP_CONFIG} from '../../app.config';
import {BooksModel} from '../models/books.model';

/**
 * Service for Books
 */
@Injectable()
export class BooksService {

  constructor(private db: DbService) {
  }

  /**
   * Get all books models from DB
   * @return {Promise<BooksModel[]>}
   */
  public list(): Promise<BooksModel[]> {
    return this.db.list(APP_CONFIG.db.tables.books)
      .then((objs: BooksModel[]) => objs.map((obj) => new BooksModel(obj)))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Get book model by ID from DB
   * @param {string} id
   * @return {Promise<BooksModel>}
   */
  public getById(id: string): Promise<BooksModel> {
    return this.db.getById(APP_CONFIG.db.tables.books, id)
      .then((obj) => obj && new BooksModel(obj))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Update/Add book to DB
   * @param {BooksModel} book
   * @return {Promise<BooksModel>}
   */
  public save(book: BooksModel): Promise<BooksModel> {
    return this.db.update(APP_CONFIG.db.tables.books, book)
      .then((obj) => new BooksModel(obj))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  /**
   * Delete book from DB
   * @param {BooksModel} book
   * @return {Promise<any>}
   */
  public delete(book: BooksModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.books, book.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

}
