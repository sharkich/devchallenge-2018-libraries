import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BooksModel} from '../../models/books.model';
import {BooksService} from '../../services/books.service';
import {ChangesService} from '../../services/changes.service';
import {LibrariesService} from '../../services/libraries.service';
import {Books2librariesModel} from '../../models/books2libraries.model';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';

/**
 * Dialog for edit book
 */
@Component({
  selector: 'app-edit-dialog-book',
  templateUrl: './dialog-edit-book.component.html',
  styleUrls: ['./dialog-edit-book.component.scss']
})
export class DialogEditBookComponent implements OnInit {

  /**
   * Book
   */
  public book: BooksModel;

  /**
   * Book in library (if present)
   */
  public book2library: Books2librariesModel;

  /**
   * Form with book data
   */
  public bookForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private booksService: BooksService,
    private librariesService: LibrariesService,
    private changesService: ChangesService
  ) {
  }

  public ngOnInit() {
    this.book2library = this.data['book2library'];
    this.book = this.data['book'];
    this.bookForm = this.formBuilder.group({
      nameFormControl: [this.book.name, [Validators.required]],
      authorFormControl: [this.book.author, [Validators.required]],
      yearFormControl: [this.book.year, [Validators.required]],
      isbnFormControl: [this.book.ISBN, [Validators.required]],
      thumbnailFormControl: [this.book.thumbnail, [Validators.required]]
    });
  }

  /**
   * Handle submit event
   */
  public onSaveBook() {
    if (this.bookForm.invalid) {
      return;
    }
    this.book.name = this.bookForm.controls.nameFormControl.value;
    this.book.author = this.bookForm.controls.authorFormControl.value;
    this.book.year = this.bookForm.controls.yearFormControl.value;
    this.book.ISBN = this.bookForm.controls.isbnFormControl.value;
    this.book.thumbnail = this.bookForm.controls.thumbnailFormControl.value;

    this.booksService.save(this.book)
      .then((savedBook: BooksModel) => {
        const isNew = this.book.isNew;
        this.book = savedBook;

        this.changesService.book.emit(savedBook);

        this.dialogRef.close(isNew); // Refresh list or don't
      });
  }

  /**
   * Close dialog
   */
  public onCancel() {
    this.dialogRef.close();
  }

  /**
   * Delete book from DB
   */
  public onDelete() {
    this.booksService.delete(this.book)
      .then(() => {
        this.changesService.bookDelete.emit(this.book);
        this.dialogRef.close(true); // Refresh list
      });
  }

  /**
   * Remove book from current library
   */
  public onRemoveFromLibrary() {
    this.librariesService.removeBook(this.book2library)
      .then(() => {
        this.dialogRef.close(true); // Refresh list
      });
  }

}
