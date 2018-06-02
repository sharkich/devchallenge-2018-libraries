import {EventEmitter, Injectable, Output} from '@angular/core';

import {BooksModel} from '../models/books.model';
import {Books2librariesModel} from '../models/books2libraries.model';
import {LibrariesModel} from '../models/libraries.model';

/**
 * Service for events cross the components and services
 */
@Injectable()
export class ChangesService {

  constructor() {
  }

  /**
   * Update libraries lists
   * @type {EventEmitter<LibrariesModel[]>}
   */
  @Output() public libraries: EventEmitter<LibrariesModel[]> = new EventEmitter();

  /**
   * Update books lists
   * @type {EventEmitter<BooksModel[]>}
   */
  @Output() public books: EventEmitter<BooksModel[]> = new EventEmitter();

  /**
   * Update books statuses in lists
   * @type {EventEmitter<Books2librariesModel[]>}
   */
  @Output() public books2libraries: EventEmitter<Books2librariesModel[]> = new EventEmitter();

  /**
   * Update book
   * @type {EventEmitter<BooksModel>}
   */
  @Output() public book: EventEmitter<BooksModel> = new EventEmitter();

  /**
   * Update book status
   * @type {EventEmitter<Books2librariesModel>}
   */
  @Output() public book2Library: EventEmitter<Books2librariesModel> = new EventEmitter();

  /**
   * Delete book from lists
   * @type {EventEmitter<any>}
   */
  @Output() public bookDelete: EventEmitter<BooksModel> = new EventEmitter();

}
