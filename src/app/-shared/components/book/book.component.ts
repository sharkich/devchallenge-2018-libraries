import {Component, Input, OnInit} from '@angular/core';
import {BooksModel} from '../../models/books.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input() book: BooksModel;

  constructor() { }

  ngOnInit() {
  }

}
