import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

function validateAdmin(formControl: FormControl) {
  return formControl.value === 'admin' ? null : {
    validateAdmin: {
      valid: false
    }
  };
}

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent implements OnInit {

  public loginForm = new FormGroup({
    loginFormControl: new FormControl('', [
      Validators.required,
      validateAdmin
    ]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      validateAdmin
    ])
  });

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<DialogLoginComponent>
  ) {
  }

  public ngOnInit() {
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onSignIn() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.signin()
      .then(() => this.dialogRef.close());
  }

}
