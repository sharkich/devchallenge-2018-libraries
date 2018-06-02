import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';

import {BooksModel} from '../-shared/models/books.model';
import {BooksService} from '../-shared/services/books.service';
import {LibrariesService} from '../-shared/services/libraries.service';
import {DialogBookingComponent} from '../-shared/components/dialog-booking/dialog-booking.component';

@Component({
  selector: 'app-search-books',
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.scss']
})
export class SearchBooksComponent implements OnInit {

  /**
   * Control for input search
   * @type {FormControl}
   */
  public myControl: FormControl = new FormControl();
  /**
   * Options variants for select
   */
  public filteredOptions: Observable<BooksModel[]>;

  /**
   * All books in DB
   * @type {BooksModel[]}
   */
  private books: BooksModel[] = [];

  constructor(
    private librariesService: LibrariesService,
    private booksService: BooksService,
    private dialog: MatDialog) {
  }

  public ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((val) => this.filter(val))
    );
    this.booksService.list()
      .then((books: BooksModel[]) => {
        this.books = books;
      });
  }

  /**
   * Search books by input string
   * @param {string} val
   * @return {BooksModel[]}
   */
  public filter(val: string): BooksModel[] {
    return this.books
      .filter((book: BooksModel) => {
        if (book.name.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
          return true;
        }
        if (book.author.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
          return true;
        }
        if (book.ISBN.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
  }

  /**
   * Handle select book and show booking popup
   * @param {boolean} isSelected
   * @param {BooksModel} book
   */
  public onSelectBook(isSelected: boolean, book: BooksModel) {
    if (!isSelected) {
      return;
    }
    const dialogRef = this.dialog.open(DialogBookingComponent, {
      width: '650px',
      data: {
        book
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed', result);
    });
  }

}
