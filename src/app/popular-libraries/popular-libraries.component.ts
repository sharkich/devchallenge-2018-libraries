import {Component, OnInit} from '@angular/core';
import {LibrariesModel} from '../-shared/models/libraries.model';
import {LibrariesService} from '../-shared/services/libraries.service';
import {GeolocationService} from '../-shared/services/geolocation.service';

@Component({
  selector: 'app-popular-libraries',
  templateUrl: './popular-libraries.component.html',
  styleUrls: ['./popular-libraries.component.scss']
})
export class PopularLibrariesComponent implements OnInit {

  public libraries: LibrariesModel[] = [];

  constructor(
    private librariesService: LibrariesService,
    private geolocationService: GeolocationService) {
  }

  ngOnInit() {
    this.librariesService.list()
      .then((libraries: LibrariesModel[]) => {
        this.libraries = libraries;
        console.log('this.libraries', this.libraries);
      });
  }

  get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

  public distance(library: LibrariesModel): number {
    return this.geolocationService.distanceTo(library.geo);
  }

}
