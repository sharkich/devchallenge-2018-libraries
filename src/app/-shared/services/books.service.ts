import { Injectable } from '@angular/core';
import {BooksModel} from '../models/books.model';
import {HttpClient} from '@angular/common/http';
import {Http} from '@angular/http';

@Injectable()
export class BooksService {

  constructor(private http: Http) { }

  public list(limit: number = 10): Promise<BooksModel[]> {
    return this.http.get('/assets/books.json')
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        let books: BooksModel[] = arr.map((obj) => new BooksModel(obj));
        books = books.splice(0, limit);
        return books;
      });
  }
}
