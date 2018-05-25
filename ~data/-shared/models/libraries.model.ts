const uuid = require('uuid/v1');

/**
 * Model For Libraries
 */
export class LibrariesModel {

  public id: string;
  public name: string;
  public address: string;
  public N: number;
  public E: number;

  constructor(data: any = {}) {
    this.id = data['id'] ? '' + data['id'] : uuid();
    this.name = data['name'] ? '' + data['name'] : '';
    this.address = data['address'] ? '' + data['address'] : '';
    this.N = data['N'] ? +data['N'] : 0;
    this.E = data['E'] ? +data['E'] : 0;
  }

}
