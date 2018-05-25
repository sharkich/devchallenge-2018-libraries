import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatCardModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {LibrariesService} from './-shared/services/libraries.service';
import {BooksService} from './-shared/services/books.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatCardModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  providers: [
    LibrariesService,
    BooksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
