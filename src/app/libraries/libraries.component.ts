import {MatDialog} from '@angular/material';
import {Component, OnInit, ViewChild} from '@angular/core';

import {BooksModel} from '../-shared/models/books.model';
import {AuthService} from '../-shared/services/auth.service';
import {LibrariesModel} from '../-shared/models/libraries.model';
import {ChangesService} from '../-shared/services/changes.service';
import {LibrariesService} from '../-shared/services/libraries.service';
import {Books2librariesModel} from '../-shared/models/books2libraries.model';
import {GeolocationService, IPoint} from '../-shared/services/geolocation.service';
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

  /**
   * Switcher between bam and list
   * @type {boolean}
   */
  public isShowMap = true;

  /**
   * Current user position
   */
  public currentPosition: IPoint;

  /**
   * Toggle buttons element
   */
  @ViewChild('view') view;

  /**
   * Titles for labels on map
   * @type {any}
   */
  public librariesTitle: any = {}

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
    this.currentPosition = this.geolocationService.getCurrentPosition();

    // Geo
    this.changesService.geo.subscribe(() => {
      this.currentPosition = this.geolocationService.getCurrentPosition();
    });

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
   * Validation to GEO support
   * @return {boolean}
   */
  public get geoError() {
    return this.geolocationService.error;
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
    if (this.isShowMap) {
      this.onChangeView();
    }
    this.selectedLibrary = library;
  }

  /**
   * Handle for changing view
   */
  public onChangeView() {
    this.isShowMap = !this.isShowMap;
    this.view.value = this.isShowMap ? 'map' : 'list';
  }

  public onMarkerOver(library: LibrariesModel) {
    this.librariesTitle[library.id] = library.name;
  }

  public onMarkerOut(library: LibrariesModel) {
    this.librariesTitle[library.id] = '';
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
