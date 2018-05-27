import {Component, Inject, OnInit} from '@angular/core';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-book',
  templateUrl: './dialog-book.component.html',
  styleUrls: ['./dialog-book.component.scss']
})
export class DialogBookComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    console.log('data', this.data);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
