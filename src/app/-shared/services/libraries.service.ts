import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {LibrariesModel} from '../models/libraries.model';

@Injectable()
export class LibrariesService {

  constructor(private http: Http) {
  }

  public list(): Promise<LibrariesModel[]> {
    return this.http.get('/assets/libraries.json')
      .toPromise()
      .then((res: Response) => res.json())
      .then((res: any[]) => res.map((obj) => new LibrariesModel(obj)));
  }

}
