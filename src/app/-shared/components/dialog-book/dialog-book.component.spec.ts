import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBookComponent } from './dialog-book.component';

describe('DialogBookComponent', () => {
  let component: DialogBookComponent;
  let fixture: ComponentFixture<DialogBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
