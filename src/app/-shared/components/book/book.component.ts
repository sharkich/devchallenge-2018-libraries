import {MatDialog} from '@angular/material';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {APP_CONFIG} from '../../../app.config';
import {BooksModel} from '../../models/books.model';
import {AuthService} from '../../services/auth.service';
import {ChangesService} from '../../services/changes.service';
import {LibrariesService} from '../../services/libraries.service';
import {GeolocationService} from '../../services/geolocation.service';
import {Books2librariesModel} from '../../models/books2libraries.model';
import {DialogEditBookComponent} from '../dialog-edit-book/dialog-edit-book.component';
import {DialogBookingComponent} from '../dialog-booking/dialog-booking.component';

/**
 * Book component (tile of list view)
 */
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {

  /**
   * Edited book
   */
  @Input() public book: BooksModel;

  /**
   * Book in library (if present)
   */
  @Input() public book2library?: Books2librariesModel;

  /**
   * Kind of view (pipe/list)
   * @type {string}
   */
  @Input() public view?: string = APP_CONFIG.view.grid;

  @Output() public onDelete: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Status rented book or free
   */
  public isBookRented: boolean;
  /**
   * Time when rent if over
   */
  public rentDiffTime: string;

  /**
   * Inner timer for check book status
   */
  private _setInterval;

  constructor(
    private librariesService: LibrariesService,
    private geolocationService: GeolocationService,
    private authService: AuthService,
    private changesService: ChangesService,
    private dialog: MatDialog) { }

  public ngOnInit() {
    if (!this.view) {
      this.view = APP_CONFIG.view.grid;
    }

    this.changesService.book.subscribe((changedBook: BooksModel) => {
      if (changedBook.id === this.book.id) {
        this.book = changedBook;
        this.isBookRented = this.librariesService.isBookRented(this.book2library);
        this.startCheckingRent();
      }
    });

    this.changesService.book2Library.subscribe((book2library: Books2librariesModel) => {
      if (this.book2library && book2library.id === this.book2library.id) {
        this.book2library = book2library;
        this.isBookRented = this.librariesService.isBookRented(this.book2library);
        this.startCheckingRent();
      }
    });

    this.startCheckingRent();
  }

  public ngOnDestroy() {
    this.stopCheckingRent();
  }

  /**
   * Check view from admin
   * @return {boolean}
   */
  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  /**
   * Check geo support
   * @return {boolean}
   */
  public get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  /**
   * Handle click event on edit button
   */
  public onEditBook() {
    const dialogRef = this.dialog.open(DialogEditBookComponent, {
      width: '650px',
      data: {
        book: this.book,
        book2library: this.book2library
      }
    });

    dialogRef.afterClosed().subscribe((isReload) => {
      if (isReload) {
        this.onDelete.emit();
      }
    });
  }

  /**
   * Handle click on booking button
   */
  public onBookBook() {
    const dialogRef = this.dialog.open(DialogBookingComponent, {
      width: '650px',
      data: {
        book: this.book,
        book2library: this.book2library
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed', result);
    });
  }

  /**
   * Handle click on return book to library (change status to free)
   */
  public onReturnBook() {
    this.librariesService.returnBook(this.book2library)
      .then((book2library) => {
        this.book2library = book2library;
        this.startCheckingRent();
      });
  }

  /**
   * Start process for checking book status
   */
  private startCheckingRent() {
    if (this.book2library) {
      this._setInterval = setInterval(() => {
        this.isBookRented = this.librariesService.isBookRented(this.book2library);
        if (!this.isBookRented) {
          this.stopCheckingRent();
          return;
        }
        this.rentDiffTime = this.librariesService.bookRentedTimeDiffString(this.book2library);
      }, 100);
    }
  }

  /**
   * Stop process for checking book status
   */
  private stopCheckingRent() {
    clearInterval(this._setInterval);
  }

}
