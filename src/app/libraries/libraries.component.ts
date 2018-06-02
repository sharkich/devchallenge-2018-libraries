import {MatDialog} from '@angular/material';
import {Component, OnInit} from '@angular/core';

import {BooksModel} from '../-shared/models/books.model';
import {AuthService} from '../-shared/services/auth.service';
import {LibrariesModel} from '../-shared/models/libraries.model';
import {ChangesService} from '../-shared/services/changes.service';
import {LibrariesService} from '../-shared/services/libraries.service';
import {GeolocationService} from '../-shared/services/geolocation.service';
import {Books2librariesModel} from '../-shared/models/books2libraries.model';
import {DialogAddBooksComponent} from '../-shared/components/dialog-add-books/dialog-add-books.component';
import {DialogEditLibraryComponent} from '../-shared/components/dialog-library/dialog-edit-library.component';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent implements OnInit {

  /**
   * All linraries in DB
   * @type {LibrariesModel[]}
   */
  public libraries: LibrariesModel[] = [];

  /**
   * Opened library
   */
  public selectedLibrary: LibrariesModel;

  constructor(
    private librariesService: LibrariesService,
    private geolocationService: GeolocationService,
    private changesService: ChangesService,
    private authService: AuthService,
    private dialog: MatDialog) {
  }

  public ngOnInit() {
    this.getList();
    this.changesService.libraries.subscribe(this.getList.bind(this));
    this.changesService.bookDelete.subscribe(this.onDeleteAllBooks.bind(this));
  }

  /**
   * Tumbler admin view
   * @return {boolean}
   */
  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  /**
   * Validation to GEO support
   * @return {boolean}
   */
  public get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  /**
   * Get distance to library
   * @param {LibrariesModel} library
   * @return {number}
   */
  public distance(library: LibrariesModel): number {
    return this.geolocationService.distanceTo(library.geo);
  }

  /**
   * Handle click on edit library button
   * @param {LibrariesModel} library
   */
  public onEditLibrary(library: LibrariesModel) {
    const dialogRef = this.dialog.open(DialogEditLibraryComponent, {
      width: '650px',
      data: {
        library
      }
    });

    dialogRef.afterClosed().subscribe((changing) => {
      if (changing) {
        this.getList()
          .then(() => {
            this.selectedLibrary = library;
          });
      }
    });
  }

  /**
   * Handle click on create new library button and show popup
   */
  public onAddNewLibrary() {
    const library = new LibrariesModel();
    const dialogRef = this.dialog.open(DialogEditLibraryComponent, {
      width: '650px',
      data: {
        library
      }
    });

    dialogRef.afterClosed().subscribe((isReload) => {
      if (isReload) {
        this.getList()
          .then(() => {
            this.selectedLibrary = library;
          });
      }
    });
  }

  /**
   * Handle click on add book to library button
   * @param {LibrariesModel} library
   */
  public onAddBooks2Library(library: LibrariesModel) {
    const dialogRef = this.dialog.open(DialogAddBooksComponent, {
      width: '650px',
      data: {
        library
      }
    });

    dialogRef.afterClosed().subscribe((isReload) => {
      if (isReload) {
        this.getList()
          .then(() => {
            this.selectedLibrary = library;
          });
      }
    });
  }

  /**
   * Handle delete button event and update list
   * @param {Books2librariesModel} book2library
   */
  public onDeleteBook(book2library: Books2librariesModel) {
    this.getList(); // todo: optimize for blinking
  }

  /**
   * Handle delete book from all libraries and DB
   * @param {BooksModel} book
   */
  private onDeleteAllBooks(book: BooksModel) {
    this.librariesService.removeAllBookFromLibraries(this.libraries, book);
  }

  /**
   * Oped library section
   * @param {LibrariesModel} library
   */
  public onSelectLibrary(library: LibrariesModel) {
    this.selectedLibrary = library;
  }

  /**
   * Update libraries
   * @return {Promise<void>}
   */
  private getList() {
    return this.librariesService.getFullLibraries()
      .then((libraries: LibrariesModel[]) => {
        this.libraries = libraries;
      });
  }

}
