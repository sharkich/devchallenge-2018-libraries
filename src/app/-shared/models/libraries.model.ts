import {IPoint} from '../services/geolocation.service';
import {BooksModel} from './books.model';
import {Books2librariesModel} from './books2libraries.model';
import {GeneralModel} from './general.model';

const uuid = require('uuid/v1');

/**
 * Model For Libraries
 */
export class LibrariesModel extends GeneralModel {

  public id: string;
  public name: string;

  public address: string;
  public geo: IPoint = {
    latitude: null,
    longitude: null
  };

  public book2library: Books2librariesModel[] = [];

  constructor(data: any = {}) {
    super(data);
    this.id = data['id'] ? '' + data['id'] : uuid();
    this.name = data['name'] ? '' + data['name'] : '';
    this.address = data['address'] ? '' + data['address'] : '';
    this.geo.latitude = data['geo'] && data['geo']['latitude'] ? +data['geo']['latitude'] : 0;
    this.geo.longitude = data['geo'] && data['geo']['longitude'] ? +data['geo']['longitude'] : 0;
  }

}
