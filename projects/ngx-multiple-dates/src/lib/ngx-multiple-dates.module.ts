import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MultipleDatesComponent } from './components/multiple-dates/multiple-dates.component';

@NgModule({
  declarations: [MultipleDatesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [MultipleDatesComponent]
})
export class NgxMultipleDatesModule { }
