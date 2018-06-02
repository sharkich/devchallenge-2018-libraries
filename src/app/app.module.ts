import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatExpansionModule,
  MatInputModule, MatListModule, MatMenuModule,
  MatToolbarModule
} from '@angular/material';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {QRCodeModule} from 'angularx-qrcode';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DbService} from './-shared/services/db.service';
import {AuthService} from './-shared/services/auth.service';
import {BooksService} from './-shared/services/books.service';
import {BackupService} from './-shared/services/backup.service';
import {ChangesService} from './-shared/services/changes.service';
import {LibrariesService} from './-shared/services/libraries.service';
import {GeolocationService} from './-shared/services/geolocation.service';

import {AppComponent} from './app.component';
import {BooksComponent} from './books/books.component';
import {LibrariesComponent} from './libraries/libraries.component';
import {BookComponent} from './-shared/components/book/book.component';
import {SearchBooksComponent} from './search-books/search-books.component';
import {DialogLoginComponent} from './-shared/components/dialog-login/dialog-login.component';
import {DialogBookingComponent} from './-shared/components/dialog-booking/dialog-booking.component';
import {DialogEditBookComponent} from './-shared/components/dialog-edit-book/dialog-edit-book.component';
import {DialogAddBooksComponent} from './-shared/components/dialog-add-books/dialog-add-books.component';
import {DialogEditLibraryComponent} from './-shared/components/dialog-library/dialog-edit-library.component';

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    BooksComponent,
    LibrariesComponent,
    DialogLoginComponent,
    SearchBooksComponent,
    DialogBookingComponent,
    DialogAddBooksComponent,
    DialogEditBookComponent,
    DialogEditLibraryComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    MatCardModule,
    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatExpansionModule,
    MatAutocompleteModule,

    QRCodeModule
  ],
  providers: [
    DbService,
    AuthService,
    BooksService,
    BackupService,
    ChangesService,
    LibrariesService,
    GeolocationService
  ],
  entryComponents: [
    DialogLoginComponent,
    DialogBookingComponent,
    DialogEditBookComponent,
    DialogAddBooksComponent,
    DialogEditLibraryComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
