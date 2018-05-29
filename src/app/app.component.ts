import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DialogLoginComponent} from './-shared/components/dialog-login/dialog-login.component';
import {AuthService} from './-shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {
  }

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public onSignIn() {
    this.dialog.open(DialogLoginComponent, {width: '450px'});
  }

  public onSignOut() {
    this.authService.signout();
  }

}
