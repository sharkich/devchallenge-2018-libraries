import {Component, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DialogLoginComponent} from './-shared/components/dialog-login/dialog-login.component';
import {AuthService} from './-shared/services/auth.service';
import {BackupService} from './-shared/services/backup.service';
import {ChangesService} from './-shared/services/changes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('uploadFile') uploadFile; // hidden. for upload

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private backupService: BackupService,
    private changesService: ChangesService
  ) {
  }

  /**
   * Check auth user
   * @return {boolean}
   */
  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  /**
   * Handle click event on "Sign in" button
   */
  public onSignIn() {
    this.dialog.open(DialogLoginComponent, {width: '450px'});
  }

  /**
   * Handle click event on "Sign out" button
   */
  public onSignOut() {
    this.authService.signout();
  }

  /**
   * Handle click on backup button
   */
  public onCreateBackup() {
    this.backupService.create();
  }

  /**
   * Handle click on restore button
   */
  public onRestoreBackup() {
    this.uploadFile.nativeElement.click();
    // this.backupService.restore();
  }

  /**
   * Handle event on file uploaded (#uploadFile input element)
   * @param event
   * @return {boolean}
   */
  public onUploadFile(event) {
    const files = event.srcElement.files;
    if (files.length <= 0) {
      return false;
    }

    this.backupService.restore(files.item(0))
      .then(() => {
        this.changesService.libraries.emit();
        this.changesService.books.emit();
        this.changesService.books2libraries.emit();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

}
