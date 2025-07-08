import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
// import { DateTime } from 'luxon';
// import * as moment from 'moment';
import { DateClass, DateRemoveEvent, MultipleDatesComponent } from 'ngx-multiple-dates';

import { DEFAULT_THEME } from '../../app.constants';
import { ThemePickerComponent } from '../theme-picker/theme-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: [ './root.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MtxPopoverModule,
    MultipleDatesComponent,
    ThemePickerComponent
  ]
})
export class RootComponent {
  public model: Date[];
  public modelWithToggleButton: Date[];
  public modelPredefined: Date[] = [
    new Date('7/15/1966'),
    new Date('3/23/1968'),
    new Date('7/4/1992'),
    new Date('1/25/1994'),
    new Date('6/17/1998')
  ];
  public modelMinMax: Date[];
  public modelMinlengthMaxlength: Date[];
  public modelRequired: Date[];
  public modelColor: Date[];
  public modelFormat: Date[];
  public modelCalendar: Date[];
  public modelClasses: Date[] = [ new Date('3/7/2021'), new Date('3/11/2021') ];
  public modelFilterValidation: Date[];
  public min = new Date(+(new Date()) - 30 * 24 * 60 * 60 * 1000);
  public max = new Date(+(new Date()) + 30 * 24 * 60 * 60 * 1000);
  public classes: DateClass[] = [
    { value: new Date('3/5/2021'), className: 'my-red' },
    { value: new Date('3/7/2021'), className: 'my-green' },
    { value: new Date('3/9/2021'), className: 'my-blue' }
  ];
  public reactiveControl = new UntypedFormControl();
  public dynamicName = 'reactiveFormControl';
  public reactiveForm = new UntypedFormGroup({
    [this.dynamicName]: new UntypedFormControl(this.modelPredefined)
  });
  private _themeClass: string = DEFAULT_THEME;

  @HostBinding('class')
  public get themeClass(): string {
    return this._themeClass;
  }
  public set themeClass(value: string) {
    if (value) {
      this._overlayContainer.getContainerElement().classList.remove(this._themeClass);
      this._overlayContainer.getContainerElement().classList.add(value);
      this._themeClass = value;
    }
  }

  constructor(
    private _overlayContainer: OverlayContainer,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this._overlayContainer.getContainerElement().classList.add(this.themeClass);
    this.reactiveControl.valueChanges.subscribe((values) => console.log('reactiveControl', values));
    this.reactiveForm.valueChanges.subscribe((values) => console.log('reactiveForm', values));

    // Register GitHub icon
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/github.svg')
    );
  }

  public myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  public dateRemoved(date: DateRemoveEvent<Date>): void {
    console.log('removed', date);
  }
}
