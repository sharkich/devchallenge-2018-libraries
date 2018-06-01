import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BooksModel} from '../../models/books.model';
import {GeolocationService} from '../../services/geolocation.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogEditBookComponent} from '../dialog-edit-book/dialog-edit-book.component';
import {DialogBookingComponent} from '../dialog-booking/dialog-booking.component';
import {Books2librariesModel} from '../../models/books2libraries.model';
import {APP_CONFIG} from '../../../app.config';
import {ChangesService} from '../../services/changes.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input() public book: BooksModel;
  @Input() public book2library?: Books2librariesModel;

  @Input() public view?: string = APP_CONFIG.view.grid;

  @Output() private onDelete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private geolocationService: GeolocationService,
    private authService: AuthService,
    private changesService: ChangesService,
    public dialog: MatDialog) { }

  public ngOnInit() {
    if (!this.view) {
      this.view = APP_CONFIG.view.grid;
    }
    this.changesService.book.subscribe((changedBook: BooksModel) => {
      if (changedBook.id === this.book.id) {
        this.book = changedBook;
      }
    });
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  public onEditBook(book: BooksModel) {
    const dialogRef = this.dialog.open(DialogEditBookComponent, {
      width: '650px',
      data: {
        book,
        book2library: this.book2library
      }
    });

    dialogRef.afterClosed().subscribe((isReload) => {
      if (isReload) {
        this.onDelete.emit();
      }
    });
  }

  public onBookBook(book: BooksModel) {
    const dialogRef = this.dialog.open(DialogBookingComponent, {
      width: '650px',
      data: {
        book
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

}
