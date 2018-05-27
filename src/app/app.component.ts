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
    const dialogRef = this.dialog.open(DialogLoginComponent, {width: '450px'});

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  public onSignOut() {
    this.authService.signout();
  }

}
