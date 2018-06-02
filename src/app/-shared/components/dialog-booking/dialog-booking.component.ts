import {Component, Inject, OnInit} from '@angular/core';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BooksModel} from '../../models/books.model';
import {Books2librariesModel} from '../../models/books2libraries.model';
import {LibrariesService} from '../../services/libraries.service';

@Component({
  selector: 'app-dialog-booking',
  templateUrl: './dialog-booking.component.html',
  styleUrls: ['./dialog-booking.component.scss']
})
export class DialogBookingComponent implements OnInit {

  public book: BooksModel;
  public book2library?: Books2librariesModel;
  public qrCodeData: string;

  constructor(
    private librariesService: LibrariesService,
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  public ngOnInit() {
    this.book = this.data.book;
    this.book2library = this.data.book2library;

    if (this.book2library) {

      this.librariesService.bookBook(this.book2library)
        .then((book2library: Books2librariesModel) => {
          this.book2library = book2library;
          this.qrCodeData = JSON.stringify({
            LIBRARY_ID: this.book2library.libraryId,
            BOOK_ID: this.book2library.bookId,
            END_TIME: this.book2library.rentTime
          });
        });
    }
  }

  public onCancel() {
    this.dialogRef.close();
  }

}
