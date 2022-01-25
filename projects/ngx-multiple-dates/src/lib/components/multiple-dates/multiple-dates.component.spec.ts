import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';

import { MultipleDatesComponent } from './multiple-dates.component';

describe('MultipleDatesComponent', () => {
  let component: MultipleDatesComponent;
  let fixture: ComponentFixture<MultipleDatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ MatNativeDateModule ],
      declarations: [ MultipleDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<MultipleDatesComponent>(MultipleDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
