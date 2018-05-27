import {Component, OnInit} from '@angular/core';
import {LibrariesModel} from '../-shared/models/libraries.model';
import {LibrariesService} from '../-shared/services/libraries.service';
import {GeolocationService} from '../-shared/services/geolocation.service';
import {AuthService} from '../-shared/services/auth.service';
import {MatDialog} from '@angular/material';
import {DialogLibraryComponent} from '../-shared/components/dialog-library/dialog-library.component';

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

  ngOnInit() {
    this.librariesService.list()
      .then((libraries: LibrariesModel[]) => {
        this.libraries = libraries;
        return this.librariesService.books2libraries(this.libraries);
      });
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  get isGeoSupported(): boolean {
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

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  public onAddNewLibrary() {
    const dialogRef = this.dialog.open(DialogLibraryComponent, {
      width: '650px',
      data: {
        library: new LibrariesModel()
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

}
