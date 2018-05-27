import {IPoint} from '../services/geolocation.service';

const uuid = require('uuid/v1');

/**
 * Model For Libraries
 */
export class LibrariesModel {

  public id: string;
  public name: string;
  public address: string;
  public geo: IPoint = {
    latitude: null,
    longitude: null
  };

  constructor(data: any = {}) {
    this.id = data['id'] ? '' + data['id'] : uuid();
    this.name = data['name'] ? '' + data['name'] : '';
    this.address = data['address'] ? '' + data['address'] : '';
    this.geo.latitude = data['latitude'] ? +data['latitude'] : 0;
    this.geo.longitude = data['longitude'] ? +data['longitude'] : 0;
  }

}
