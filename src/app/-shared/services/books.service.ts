import { Injectable } from '@angular/core';
import {BooksModel} from '../models/books.model';
import {HttpClient} from '@angular/common/http';
import {Http} from '@angular/http';

@Injectable()
export class BooksService {

  constructor(private http: Http) { }

  public list(): Promise<BooksModel[]> {
    return this.http.get('/assets/books.json')
      .toPromise()
      .then((res: Response) => res.json())
      .then((res: any[]) => res.map((obj) => new BooksModel(obj)));
  }
}
