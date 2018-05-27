import { Component, OnInit } from '@angular/core';
import {BooksService} from '../-shared/services/books.service';
import {BooksModel} from '../-shared/models/books.model';
import {AuthService} from '../-shared/services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogBookComponent} from '../-shared/components/dialog-book/dialog-book.component';

@Component({
  selector: 'app-popular-books',
  templateUrl: './popular-books.component.html',
  styleUrls: ['./popular-books.component.scss']
})
export class PopularBooksComponent implements OnInit {

  public books: BooksModel[] = [];

  constructor(
    private booksService: BooksService,
    public authService: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.booksService.list()
      .then((books: BooksModel[]) => {
        this.books = books;
      });
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public onAddNewBook() {
    const dialogRef = this.dialog.open(DialogBookComponent, {
      width: '650px',
      data: {
        book: new BooksModel()
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

}
