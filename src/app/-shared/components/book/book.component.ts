import {Component, Input, OnInit} from '@angular/core';
import {BooksModel} from '../../models/books.model';
import {GeolocationService} from '../../services/geolocation.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input() book: BooksModel;

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {
  }

  get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

}
