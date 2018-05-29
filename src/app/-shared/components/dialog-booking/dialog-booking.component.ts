import {Component, Inject, OnInit} from '@angular/core';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-booking',
  templateUrl: './dialog-booking.component.html',
  styleUrls: ['./dialog-booking.component.scss']
})
export class DialogBookingComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
  }

  public ngOnInit() {
    console.log('data', this.data);
  }

  public onCancel() {
    this.dialogRef.close();
  }

}
