import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLibraryComponent } from './dialog-library.component';

describe('DialogLibraryComponent', () => {
  let component: DialogLibraryComponent;
  let fixture: ComponentFixture<DialogLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
