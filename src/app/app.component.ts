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

  public isLogin(): boolean {
    return this.authService.isLogin();
  }

  public onSignIn() {
    this.dialog.open(DialogLoginComponent, {width: '450px'});
  }

  public onSignOut() {
    this.authService.signout();
  }

  public onCreateBackup() {
    this.backupService.create();
  }

  public onRestoreBackup() {
    this.uploadFile.nativeElement.click();
    // this.backupService.restore();
  }

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
      });
  }

}
