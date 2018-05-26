import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularLibrariesComponent } from './popular-libraries.component';

describe('PopularLibrariesComponent', () => {
  let component: PopularLibrariesComponent;
  let fixture: ComponentFixture<PopularLibrariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularLibrariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularLibrariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
