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
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getList();
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

    dialogRef.afterClosed().subscribe((isReload) => {
      if (isReload) {
        this.getList();
      }
    });
  }

  public onDeleteBook() {
    this.getList();
  }

  private getList() {
    this.booksService.list()
      .then((books: BooksModel[]) => {
        this.books = books;
      });
  }

}
