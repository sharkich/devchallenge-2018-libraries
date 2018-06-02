import {Injectable} from '@angular/core';

import {DbService} from './db.service';
import {APP_CONFIG} from '../../app.config';
import {BooksService} from './books.service';
import {BooksModel} from '../models/books.model';
import {LibrariesService} from './libraries.service';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel} from '../models/books2libraries.model';

@Injectable()
export class BackupService {

  constructor(
    private db: DbService,
    private librariesService: LibrariesService,
    private booksService: BooksService
  ) {
  }

  public create() {
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

  public restore(file: File): Promise<any> {
    let libraries: LibrariesModel[];
    let books: BooksModel[];
    let books2libraries: Books2librariesModel[];

    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        try {
          const result = JSON.parse(e.target.result);
          if (!result || !result.libraries || !result.books || !result.books2libraries) {
            reject(new Error('Invalid JSON'));
          }
          resolve(result);

        } catch (e) {
          console.log('Error: Parsing JSON');
          reject(e);
        }

      };
      fr.readAsText(file);
    })
      .then((res: any) => {
        libraries = res.libraries.map((obj) => new LibrariesModel(obj));
        books = res.books.map((obj) => new BooksModel(obj));
        books2libraries = res.books2libraries.map((obj) => new Books2librariesModel(obj));

        return Promise.all([
          this.db.clear(APP_CONFIG.db.tables.libraries),
          this.db.clear(APP_CONFIG.db.tables.books),
          this.db.clear(APP_CONFIG.db.tables.books2libraries)
        ]);
      })
      .then(() => {
        const promises: Promise<any>[] = [];
        libraries.forEach((library) => {
          promises.push(this.librariesService.save(library));
        });
        books.forEach((book) => {
          promises.push(this.booksService.save(book));
        });
        books2libraries.forEach((book2library) => {
          promises.push(this.librariesService.addBook2Library(book2library));
        });
        return promises;
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
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
