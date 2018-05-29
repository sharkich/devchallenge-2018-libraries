export class GeneralModel {

  private _isNew = true;

  constructor(data?: any) {
    if (data && data['id']) {
      this._isNew = false;
    }
  }

  get isNew(): boolean {
    return this._isNew;
  }

}
