import {BooksModel} from './books.model';
import {GeneralModel} from './general.model';

export const BOOKS_BOOKING_STATUS = {
  FREE: 'FREE',
  RENTED: 'RENTED'
};

export class Books2librariesModel extends GeneralModel {
  public id: number;
  public bookId: string;
  public libraryId: string;
  public status: string;
  public rentTime: string;

  public book?: BooksModel;

  constructor(data: any = {}) {
    super(data);
    this.id = data['id'] ? data['id'] : null;
    this.bookId = data['bookId'] ? data['bookId'] : undefined;
    this.libraryId = data['libraryId'] ? data['libraryId'] : undefined;
    this.status = data['status'] ? data['status'] : BOOKS_BOOKING_STATUS.FREE;
    this.rentTime = data['rentTime'] ? data['rentTime'] : '';
  }

}
