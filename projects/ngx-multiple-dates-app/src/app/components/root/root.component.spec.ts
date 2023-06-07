import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MdePopoverModule } from '@material-extended/mde';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';

import { RootComponent } from './root.component';

describe('RootComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatNativeDateModule, MdePopoverModule, NgxMultipleDatesModule ],
      declarations: [
        RootComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    await expect(app).toBeTruthy();
  });
});
