import {Injectable} from '@angular/core';

const uuid = require('uuid/v1');
import {APP_CONFIG} from '../../app.config';

const TOKEN = APP_CONFIG.localStorage.token;

/**
 * Service for Authenticate
 */
@Injectable()
export class AuthService {

  private _token: string;

  constructor() {
    this._token = window.localStorage.getItem(TOKEN) || null;
  }

  /**
   * Check is user sign in
   * @return {boolean}
   */
  public isLogin(): boolean {
    return !!this._token;
  }

  /**
   * Login user
   * @return {Promise<any>}
   */
  public signin(): Promise<any> {
    this._token = uuid();
    window.localStorage.setItem(TOKEN, this._token);
    return Promise.resolve();
  }

  /**
   * Logoff user
   * @return {Promise<any>}
   */
  public signout(): Promise<any> {
    this._token = null;
    window.localStorage.removeItem(TOKEN);
    return Promise.resolve();
  }
}
