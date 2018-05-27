import {BooksModel} from './books.model';

export const BOOKS_BOOKING_STATUS = {
  FREE: 'FREE',
  RENTED: 'RENTED'
};

export class Books2librariesModel {
  public book: BooksModel;
  public status: string;
  public rentDTime: string;

  constructor(data: any = {}) {
    this.book = data['book'] ? data['book'] : new BooksModel();
    this.status = data['status'] ? data['status'] : BOOKS_BOOKING_STATUS.FREE;
    this.rentDTime = data['rentDTime'] ? data['rentDTime'] : new Date();
  }
}
