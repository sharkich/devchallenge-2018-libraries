import { Injectable } from '@angular/core';
import {BooksModel} from '../models/books.model';
import {DbService} from './db.service';
import {APP_CONFIG} from '../../app.config';

@Injectable()
export class BooksService {

  constructor(private db: DbService) {
  }

  public list(limit: number = 10): Promise<BooksModel[]> {
    return this.db.list(APP_CONFIG.db.tables.books)
      .then((objs: BooksModel[]) => objs.map((obj) => new BooksModel(obj)))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public save(book: BooksModel): Promise<BooksModel> {
    return this.db.update(APP_CONFIG.db.tables.books, book)
      .then((obj) => new BooksModel(obj))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public delete(book: BooksModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.books, book.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

}
