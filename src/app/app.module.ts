import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {LibrariesService} from './-shared/services/libraries.service';
import {BooksService} from './-shared/services/books.service';
import {SearchBooksComponent} from './search-books/search-books.component';
import {PopularBooksComponent} from './popular-books/popular-books.component';
import {PopularLibrariesComponent} from './popular-libraries/popular-libraries.component';
import {BookComponent} from './-shared/components/book/book.component';
import {GeolocationService} from './-shared/services/geolocation.service';
import {DialogLoginComponent} from './-shared/components/dialog-login/dialog-login.component';
import {AuthService} from './-shared/services/auth.service';
import {DialogEditLibraryComponent} from './-shared/components/dialog-library/dialog-edit-library.component';
import {DialogEditBookComponent} from './-shared/components/dialog-edit-book/dialog-edit-book.component';
import {DialogBookingComponent} from './-shared/components/dialog-booking/dialog-booking.component';
import {DbService} from './-shared/services/db.service';
import {DialogAddBooksComponent} from './-shared/components/dialog-add-book/dialog-add-books.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBooksComponent,
    PopularBooksComponent,
    PopularLibrariesComponent,
    BookComponent,
    DialogLoginComponent,
    DialogEditLibraryComponent,
    DialogEditBookComponent,
    DialogBookingComponent,
    DialogAddBooksComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,

    MatCardModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule
  ],
  providers: [
    LibrariesService,
    BooksService,
    GeolocationService,
    AuthService,
    DbService
  ],
  entryComponents: [
    DialogLoginComponent,
    DialogEditLibraryComponent,
    DialogEditBookComponent,
    DialogBookingComponent,
    DialogAddBooksComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
