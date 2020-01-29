import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDatesComponent } from './multiple-dates.component';

describe('MultipleDatesComponent', () => {
  let component: MultipleDatesComponent;
  let fixture: ComponentFixture<MultipleDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
