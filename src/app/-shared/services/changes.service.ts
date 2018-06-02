import {EventEmitter, Injectable, Output} from '@angular/core';

import {BooksModel} from '../models/books.model';
import {Books2librariesModel} from '../models/books2libraries.model';

@Injectable()
export class ChangesService {

  constructor() {
  }

  @Output() public libraries: EventEmitter<any> = new EventEmitter();
  @Output() public books: EventEmitter<any> = new EventEmitter();
  @Output() public books2libraries: EventEmitter<any> = new EventEmitter();

  @Output() public book: EventEmitter<BooksModel> = new EventEmitter();
  @Output() public book2Library: EventEmitter<Books2librariesModel> = new EventEmitter();
  @Output() public bookDelete: EventEmitter<BooksModel> = new EventEmitter();

}
