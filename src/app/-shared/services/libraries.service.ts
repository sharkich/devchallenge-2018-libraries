import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {LibrariesModel} from '../models/libraries.model';
import {Books2librariesModel} from '../models/books2libraries.model';

@Injectable()
export class LibrariesService {

  constructor(private http: Http) {
  }

  public list(limit: number = 10): Promise<LibrariesModel[]> {
    return this.http.get('/assets/libraries.json')
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        let libraries: LibrariesModel[] = arr.map((obj) => new LibrariesModel(obj));
        libraries = libraries.splice(0, limit);
        return libraries;
      });
  }

  public books2libraries(libraries: LibrariesModel[] = []): Promise<LibrariesModel[]> {
    return this.http.get('/assets/books2libraries.json')
      .toPromise()
      .then((res: any) => {
        const arr: any[] = res.json();
        console.log('arr', arr);
        return libraries;
      });
  }

}
