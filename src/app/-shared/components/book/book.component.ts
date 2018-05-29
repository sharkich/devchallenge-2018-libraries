import {Component, Input, OnInit} from '@angular/core';
import {BooksModel} from '../../models/books.model';
import {GeolocationService} from '../../services/geolocation.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogBookComponent} from '../dialog-book/dialog-book.component';
import {DialogBookingComponent} from '../dialog-booking/dialog-booking.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input() public book: BooksModel;

  constructor(
    private geolocationService: GeolocationService,
    private authService: AuthService,
    public dialog: MatDialog) { }

  public ngOnInit() {
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  public onEditBook(book: BooksModel) {
    this.dialog.open(DialogBookComponent, {
      width: '650px',
      data: {
        book
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
