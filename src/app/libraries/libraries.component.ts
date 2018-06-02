import {Component, OnInit} from '@angular/core';
import {LibrariesModel} from '../-shared/models/libraries.model';
import {LibrariesService} from '../-shared/services/libraries.service';
import {GeolocationService} from '../-shared/services/geolocation.service';
import {AuthService} from '../-shared/services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogEditLibraryComponent} from '../-shared/components/dialog-library/dialog-edit-library.component';
import {Books2librariesModel} from '../-shared/models/books2libraries.model';
import {DialogAddBooksComponent} from '../-shared/components/dialog-add-books/dialog-add-books.component';
import {ChangesService} from '../-shared/services/changes.service';
import {BooksModel} from '../-shared/models/books.model';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent implements OnInit {

  public libraries: LibrariesModel[] = [];
  public selectedLibrary: LibrariesModel;

  constructor(
    private librariesService: LibrariesService,
    private geolocationService: GeolocationService,
    private changesService: ChangesService,
    public authService: AuthService,
    public dialog: MatDialog) {
  }

  public ngOnInit() {
    this.getList();
    this.changesService.libraries.subscribe(this.getList.bind(this));
    this.changesService.bookDelete.subscribe(this.onDeleteAllBooks.bind(this));
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  public distance(library: LibrariesModel): number {
    return this.geolocationService.distanceTo(library.geo);
  }

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

  public onDeleteBook(book2library: Books2librariesModel) {
    this.getList(); // todo: optimize for blinking
  }

  private onDeleteAllBooks(book: BooksModel) {
    this.librariesService.removeAllBookFromLibraries(this.libraries, book);
  }

  public onSelectLibrary(library: LibrariesModel) {
    this.selectedLibrary = library;
  }

  private getList() {
    return this.librariesService.getFullLibraries()
      .then((libraries: LibrariesModel[]) => {
        this.libraries = libraries;
      });
  }

}
