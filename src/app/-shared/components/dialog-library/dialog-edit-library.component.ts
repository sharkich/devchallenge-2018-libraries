import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {LibrariesModel} from '../../models/libraries.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LibrariesService} from '../../services/libraries.service';
import {DialogLoginComponent} from '../dialog-login/dialog-login.component';

@Component({
  selector: 'app-dialog-edit-library',
  templateUrl: './dialog-edit-library.component.html',
  styleUrls: ['./dialog-edit-library.component.scss']
})
export class DialogEditLibraryComponent implements OnInit {

  private library: LibrariesModel;
  public libraryForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private librariesService: LibrariesService
  ) {
  }

  public ngOnInit() {
    this.library = this.data['library'];
    this.libraryForm = this.formBuilder.group({
      nameFormControl: [this.library.name, [Validators.required]],
      addressFormControl: [this.library.address, [Validators.required]],
      latitudeFormControl: [this.library.geo.latitude, [Validators.required]],
      longitudeFormControl: [this.library.geo.longitude, [Validators.required]]
    });
  }

  public onSaveLibrary() {
    if (this.libraryForm.invalid) {
      return;
    }
    this.library.name = this.libraryForm.controls.nameFormControl.value;
    this.library.address = this.libraryForm.controls.addressFormControl.value;
    this.library.geo.latitude = this.libraryForm.controls.latitudeFormControl.value;
    this.library.geo.longitude = this.libraryForm.controls.longitudeFormControl.value;

    this.librariesService.save(this.library)
      .then((savedLibrary: LibrariesModel) => {
        const isNew = this.library.isNew;
        this.library = savedLibrary;
        this.dialogRef.close(isNew); // Refresh list or don't
      });

  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onDelete() {
    this.librariesService.delete(this.library)
      .then(() => {
        this.dialogRef.close(true); // Refresh list
      });
  }

}
