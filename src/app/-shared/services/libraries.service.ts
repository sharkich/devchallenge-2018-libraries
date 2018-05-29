import {Injectable} from '@angular/core';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel} from '../models/books2libraries.model';
import {APP_CONFIG} from '../../app.config';
import {DbService} from './db.service';

@Injectable()
export class LibrariesService {

  constructor(private db: DbService) {
  }

  public list(limit: number = 10): Promise<LibrariesModel[]> {
    return this.db.list(APP_CONFIG.db.tables.libraries)
      .then((objs: any[]) => objs.map((obj) => new LibrariesModel(obj)))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public books2libraries(library?: LibrariesModel): Promise<Books2librariesModel[]> {
    return this.db.list(APP_CONFIG.db.tables.books2libraries)
      .then((objs: any) => objs.map((obj) => new Books2librariesModel(obj)))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public save(library: LibrariesModel): Promise<LibrariesModel> {
    return this.db.update(APP_CONFIG.db.tables.libraries, library)
      .then((obj) => new LibrariesModel(obj))
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

  public delete(library: LibrariesModel): Promise<any> {
    return this.db.delete(APP_CONFIG.db.tables.libraries, library.id)
      .catch((error) => {
        console.error('error', error);
        return Promise.reject(error);
      });
  }

}
