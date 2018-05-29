import {Component, OnInit} from '@angular/core';
import {LibrariesModel} from '../-shared/models/libraries.model';
import {LibrariesService} from '../-shared/services/libraries.service';
import {GeolocationService} from '../-shared/services/geolocation.service';
import {AuthService} from '../-shared/services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogLibraryComponent} from '../-shared/components/dialog-library/dialog-library.component';
import {Books2librariesModel} from '../-shared/models/books2libraries.model';

@Component({
  selector: 'app-popular-libraries',
  templateUrl: './popular-libraries.component.html',
  styleUrls: ['./popular-libraries.component.scss']
})
export class PopularLibrariesComponent implements OnInit {

  public libraries: LibrariesModel[] = [];

  constructor(
    private librariesService: LibrariesService,
    private geolocationService: GeolocationService,
    public authService: AuthService,
    public dialog: MatDialog) {
  }

  public ngOnInit() {
    this.getList();
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
    const dialogRef = this.dialog.open(DialogLibraryComponent, {
      width: '650px',
      data: {
        library
      }
    });

    dialogRef.afterClosed().subscribe((changing) => {
      if (changing) {
        this.getList();
      }
    });
  }

  public onAddNewLibrary() {
    const dialogRef = this.dialog.open(DialogLibraryComponent, {
      width: '650px',
      data: {
        library: new LibrariesModel()
      }
    });

    dialogRef.afterClosed().subscribe((isReload) => {
      if (isReload) {
        this.getList();
      }
    });
  }

  public onDeleteBook(book2library: Books2librariesModel) {
    this.getList(); // todo: optimize for blinking
  }

  private getList() {
    this.librariesService.list()
      .then((libraries: LibrariesModel[]) => {
        this.libraries = libraries;
        this.librariesService.books2libraries(this.libraries)
          .then(() => {
            // todo loading = false
          });
      });
  }

}
