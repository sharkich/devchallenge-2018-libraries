import {Injectable} from '@angular/core';
import {BooksModel} from '../models/books.model';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel} from '../models/books2libraries.model';
import {LibrariesService} from './libraries.service';
import {BooksService} from './books.service';

@Injectable()
export class BackupService {

  constructor(
    private librariesService: LibrariesService,
    private booksService: BooksService
  ) {
  }

  public create() {
    console.log('create');

    Promise.all([
      this.getLibraries(),
      this.getBooks(),
      this.getBooks2libraries()
    ])
      .then(([libraries, books, books2libraries]) => {
        const data = {
          libraries,
          books,
          books2libraries
        };

        const link = document.createElement('a');
        link.download = `devchallenge-2018-libraries.backup.json`;
        link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  public restore() {
    console.log('restore');
  }

  private getLibraries(): Promise<LibrariesModel[]> {
    return this.librariesService.list();
  }

  private getBooks(): Promise<BooksModel[]> {
    return this.booksService.list();
  }

  private getBooks2libraries(): Promise<Books2librariesModel[]> {
    return this.librariesService.books2libraries();
  }

}
