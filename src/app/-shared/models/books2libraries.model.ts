import {BooksModel} from './books.model';
import {GeneralModel} from './general.model';
import {LibrariesModel} from './libraries.model';

/**
 * Book statuses inside library
 */
export const BOOKS_BOOKING_STATUS = {
  FREE: 'FREE',
  RENTED: 'RENTED'
};

/**
 * Model for book inside library
 */
export class Books2librariesModel extends GeneralModel {
  public id: number;
  public bookId: string;
  public libraryId: string;
  public status: string;
  public rentTime: string;

  public book?: BooksModel;
  public library?: LibrariesModel;

  constructor(data: any = {}) {
    super(data);
    this.id = data['id'] ? data['id'] : null;
    this.bookId = data['bookId'] ? data['bookId'] : undefined;
    this.libraryId = data['libraryId'] ? data['libraryId'] : undefined;
    this.status = data['status'] ? data['status'] : BOOKS_BOOKING_STATUS.FREE;
    this.rentTime = data['rentTime'] ? data['rentTime'] : '';
  }

}
