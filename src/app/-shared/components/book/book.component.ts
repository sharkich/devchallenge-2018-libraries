import {Component, Input, OnInit} from '@angular/core';
import {BooksModel} from '../../models/books.model';
import {GeolocationService} from '../../services/geolocation.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input() book: BooksModel;

  constructor(
    private geolocationService: GeolocationService,
    public authService: AuthService) { }

  ngOnInit() {
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  get isGeoSupported(): boolean {
    return this.geolocationService.isSupported();
  }

}
