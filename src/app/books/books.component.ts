import {MatDialog} from '@angular/material';
import {Component, OnInit} from '@angular/core';

import {APP_CONFIG} from '../app.config';
import {BooksModel} from '../-shared/models/books.model';
import {AuthService} from '../-shared/services/auth.service';
import {BooksService} from '../-shared/services/books.service';
import {ChangesService} from '../-shared/services/changes.service';
import {DialogEditBookComponent} from '../-shared/components/dialog-edit-book/dialog-edit-book.component';

const COMPONENT_KEY = APP_CONFIG.localStorage['app-popular-books'];

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  /**
   * All book in DB
   * @type {any[]}
   */
  public books: BooksModel[] = [];

  /**
   * Toggle list/tile view
   * @type {string}
   */
  public view: string = APP_CONFIG.view.grid;

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private dialog: MatDialog,
    private changesService: ChangesService) {
  }

  ngOnInit() {
    this.getList();
    this.changesService.books.subscribe(this.getList.bind(this));
    this.changesService.bookDelete.subscribe(this.onDeleteBook.bind(this));
    this.onToggleView();
  }

  /**
   * Check auth user
   * @return {boolean}
   */
  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  /**
   * Handle click on create book button
   */
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

  /**
   * Handle event delete book and update list
   */
  public onDeleteBook() {
    this.getList();
  }

  /**
   * Toggle tile/list view and save to localStorage
   */
  public onToggleView() {
    this.view = (this.view === APP_CONFIG.view.grid) ? APP_CONFIG.view.list : APP_CONFIG.view.grid;
    window.localStorage.setItem(COMPONENT_KEY.isListView, this.view);
  }

  /**
   * View type checker
   * @return {boolean}
   */
  public get isListView(): boolean {
    return this.view === APP_CONFIG.view.list;
  }

  /**
   * Update list
   */
  private getList() {
    this.booksService.list()
      .then((books: BooksModel[]) => {
        this.books = books;
      });
  }

}
