import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {BooksModel} from '../../models/books.model';
import {BooksService} from '../../services/books.service';
import {LibrariesModel} from '../../models/libraries.model';
import {LibrariesService} from '../../services/libraries.service';
import {Books2librariesModel} from '../../models/books2libraries.model';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';

@Component({
  selector: 'app-dialog-add-books',
  templateUrl: './dialog-add-books.component.html',
  styleUrls: ['./dialog-add-books.component.scss']
})
export class DialogAddBooksComponent implements OnInit {

  public library: LibrariesModel;
  public books: BooksModel[] = [];
  public booksInLibrary: any = {};

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private booksService: BooksService,
    private librariesService: LibrariesService
  ) { }

  public ngOnInit() {
    this.library = this.data['library'];
    this.getList();
  }

  public onCancel() {
    this.dialogRef.close(true);
  }

  public onClick(book: BooksModel) {
    this.librariesService.addBook(book, this.library)
      .then(() => {
        this.booksInLibrary[book.id]++;
      });
  }

  private getList() {
    this.booksService.list()
      .then((books: BooksModel[]) => {
        this.books = books;
        this.books.forEach((book: BooksModel) => {
          this.booksInLibrary[book.id] = 0;
        });
        this.library.book2library.forEach((book2library: Books2librariesModel) => {
          this.booksInLibrary[book2library.book.id]++;
        });
      });
  }

}
