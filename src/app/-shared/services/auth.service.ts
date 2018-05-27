import {Injectable} from '@angular/core';
const uuid = require('uuid/v1');

@Injectable()
export class AuthService {

  private _token: string;

  constructor() {
  }

  public isLogin(): boolean {
    return !!this._token;
  }

  public signin(): Promise<any> {
    this._token = uuid();
    return Promise.resolve();
  }

  public signout(): Promise<any> {
    this._token = null;
    return Promise.resolve();
  }
}
