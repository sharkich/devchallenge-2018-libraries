import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BooksModel} from '../../models/books.model';
import {Books2librariesModel} from '../../models/books2libraries.model';
import {LibrariesService} from '../../services/libraries.service';
import {ChangesService} from '../../services/changes.service';
import {LibrariesModel} from '../../models/libraries.model';
import {GeolocationService} from '../../services/geolocation.service';

@Component({
  selector: 'app-dialog-booking',
  templateUrl: './dialog-booking.component.html',
  styleUrls: ['./dialog-booking.component.scss']
})
export class DialogBookingComponent implements OnInit {

  public book: BooksModel;
  public book2library?: Books2librariesModel;
  public qrCodeData: string;

  public libraries = {
    free: [],
    rented: []
  };

  constructor(
    private librariesService: LibrariesService,
    private changesService: ChangesService,
    private geolocationService: GeolocationService,
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    private elementRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  public ngOnInit() {
    this.book = this.data.book;
    this.book2library = this.data.book2library;

    if (this.book2library) {
      return this.librariesService.bookBook(this.book2library)
        .then((book2library: Books2librariesModel) => {
          this.changesService.book.emit(book2library.book);
          this.setBooking(book2library);
        });
    }

    return this.librariesService.getLibrariesForBook(this.book)
      .then(({free, rented}) => {
        this.libraries.free = free;
        this.libraries.rented = rented;
        if (this.libraries.free.length === 1) {
          this.librariesService.bookBookInLibrary(this.book, this.libraries.free[0])
            .then((book2library: Books2librariesModel) => {
              this.setBooking(book2library);
            });
        }
      });
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public distance(library: LibrariesModel): number {
    return this.geolocationService.distanceTo(library.geo);
  }

  public get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  public onDownload() {
    const canvasElement = this.elementRef.nativeElement.querySelector('canvas');
    // download
    const link = document.createElement('a');
    link.download = `booking.png`;
    link.href = canvasElement.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public onBookingInLibrary(library: LibrariesModel) {
    this.librariesService.bookBookInLibrary(this.book, library)
      .then((book2library) => {
        this.setBooking(book2library);
      });
  }

  private setBooking(book2library: Books2librariesModel) {
    this.book2library = book2library;
    this.qrCodeData = JSON.stringify({
      LIBRARY_ID: this.book2library.libraryId,
      BOOK_ID: this.book2library.bookId,
      END_TIME: this.book2library.rentTime
    });
  }
}
