import { Component, OnInit } from '@angular/core';
import {BooksService} from '../-shared/services/books.service';
import {BooksModel} from '../-shared/models/books.model';
import {AuthService} from '../-shared/services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogEditBookComponent} from '../-shared/components/dialog-edit-book/dialog-edit-book.component';
import {APP_CONFIG} from '../app.config';

const COMPONENT_KEY = APP_CONFIG.localStorage['app-popular-books'];

@Component({
  selector: 'app-popular-books',
  templateUrl: './popular-books.component.html',
  styleUrls: ['./popular-books.component.scss']
})
export class PopularBooksComponent implements OnInit {

  public books: BooksModel[] = [];

  public view: string = APP_CONFIG.view.grid;

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getList();
    this.view = window.localStorage.getItem(COMPONENT_KEY.isListView);
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public onAddNewBook() {
    const dialogRef = this.dialog.open(DialogEditBookComponent, {
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

  public onToggleView() {
    this.view = this.view === APP_CONFIG.view.grid ? APP_CONFIG.view.list : APP_CONFIG.view.grid;
    window.localStorage.setItem(COMPONENT_KEY.isListView, this.view);
  }

  public get isListView(): boolean {
    return this.view === APP_CONFIG.view.list;
  }

  private getList() {
    this.booksService.list()
      .then((books: BooksModel[]) => {
        this.books = books;
      });
  }

}
