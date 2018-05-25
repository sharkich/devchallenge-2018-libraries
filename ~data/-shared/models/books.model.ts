const uuid = require('uuid/v1');

/**
 * Model for Books
 */
export class BooksModel {

  public id: string;
  public name: string;
  public author: string;
  public year: number;
  public ISBN: string;
  public thumbnail: string;

  constructor(data: any = {}) {
    this.id = data['id'] ? '' + data['id'] : uuid();
    this.name = data['name'] ? '' + data['name'] : '';
    this.author = data['author'] ? '' + data['author'] : '';
    this.year = data['year'] ? +data['year'] : 0;
    this.ISBN = data['ISBN'] ? '' + data['ISBN'] : '';
    this.thumbnail = data['thumbnail'] ? '' + data['thumbnail'] : '';
  }

}
