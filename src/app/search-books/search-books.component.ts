import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {LibrariesService} from '../-shared/services/libraries.service';
import {BooksModel} from '../-shared/models/books.model';
import {BooksService} from '../-shared/services/books.service';

@Component({
  selector: 'app-search-books',
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.scss']
})
export class SearchBooksComponent implements OnInit {

  public myControl: FormControl = new FormControl();
  public filteredOptions: Observable<BooksModel[]>;

  private books: BooksModel[] = [];

  constructor(
    private librariesService: LibrariesService,
    private booksService: BooksService) {
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

  public onSelectBook(isSelected, book: BooksModel) {
    if (!isSelected) {
      return;
    }
    console.log('select', isSelected, book.name);
  }

}
