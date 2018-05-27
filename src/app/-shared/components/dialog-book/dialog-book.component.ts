import {Component, Inject, OnInit} from '@angular/core';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BooksModel} from '../../models/books.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dialog-book',
  templateUrl: './dialog-book.component.html',
  styleUrls: ['./dialog-book.component.scss']
})
export class DialogBookComponent implements OnInit {

  private book: BooksModel;
  public bookForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit() {
    this.book = this.data['book'];
    this.bookForm = this.formBuilder.group({
      nameFormControl: [this.book.name, [Validators.required]],
      authorFormControl: [this.book.author, [Validators.required]],
      yearFormControl: [this.book.year, [Validators.required]],
      isbnFormControl: [this.book.ISBN, [Validators.required]],
      thumbnailFormControl: [this.book.thumbnail, [Validators.required]]
    });
  }

  public onSaveBook() {
    if (this.bookForm.invalid) {
      return;
    }
    this.book.name = this.bookForm.controls.nameFormControl.value;
    this.book.author = this.bookForm.controls.authorFormControl.value;
    this.book.year = this.bookForm.controls.yearFormControl.value;
    this.book.ISBN = this.bookForm.controls.isbnFormControl.value;
    this.book.thumbnail = this.bookForm.controls.thumbnailFormControl.value;
    console.log('save', this.book);
  }

  public onNoClick() {
    this.dialogRef.close();
  }

}
