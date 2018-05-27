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

@NgModule({
  declarations: [
    AppComponent,
    SearchBooksComponent,
    PopularBooksComponent,
    PopularLibrariesComponent,
    BookComponent,
    DialogLoginComponent
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
    AuthService
  ],
  entryComponents: [
    DialogLoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
