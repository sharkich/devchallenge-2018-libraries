import {Injectable} from '@angular/core';
import {APP_CONFIG} from '../../app.config';
const uuid = require('uuid/v1');

const TOKEN = APP_CONFIG.localStorage.token;

@Injectable()
export class AuthService {

  private _token: string;

  constructor() {
    this._token = window.localStorage.getItem(TOKEN) || null;
  }

  public isLogin(): boolean {
    return !!this._token;
  }

  public signin(): Promise<any> {
    this._token = uuid();
    window.localStorage.setItem(TOKEN, this._token);
    return Promise.resolve();
  }

  public signout(): Promise<any> {
    this._token = null;
    window.localStorage.removeItem(TOKEN);
    return Promise.resolve();
  }
}
