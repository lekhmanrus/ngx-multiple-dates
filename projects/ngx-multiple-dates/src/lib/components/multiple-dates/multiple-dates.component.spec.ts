import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';

import { MultipleDatesComponent } from './multiple-dates.component';

describe('MultipleDatesComponent', () => {
  let component: MultipleDatesComponent;
  let fixture: ComponentFixture<MultipleDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatChipsModule, MatNativeDateModule ],
      declarations: [ MultipleDatesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<MultipleDatesComponent>(MultipleDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
});
