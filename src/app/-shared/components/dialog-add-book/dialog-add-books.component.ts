import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';

@Component({
  selector: 'app-dialog-add-books',
  templateUrl: './dialog-add-books.component.html',
  styleUrls: ['./dialog-add-books.component.scss']
})
export class DialogAddBooksComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  public ngOnInit() {
    console.log('data', this.data);
  }

  public onCancel() {
    this.dialogRef.close();
  }

}
