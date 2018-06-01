import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable()
export class ChangesService {

  constructor() {
  }

  @Output() public libraries: EventEmitter<boolean> = new EventEmitter();
  @Output() public books: EventEmitter<boolean> = new EventEmitter();
  @Output() public books2libraries: EventEmitter<boolean> = new EventEmitter();

}
