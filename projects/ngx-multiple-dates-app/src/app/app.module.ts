import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { /*MAT_DATE_LOCALE,*/ MatNativeDateModule, MatRippleModule } from '@angular/material/core';
// import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
// import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
// import { enUS } from 'date-fns/locale';

import { RootComponent } from './components/root/root.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';

@NgModule({
  declarations: [
    RootComponent,
    ThemePickerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatNativeDateModule,
    // MatDateFnsModule,
    // MatLuxonDateModule,
    // MatMomentDateModule,
    MatRippleModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MtxPopoverModule,
    NgxMultipleDatesModule
  ],
  providers: [
    // { provide: MAT_DATE_LOCALE, useValue: enUS }
  ],
  bootstrap: [ RootComponent ]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon(
      'github',
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/github.svg')
    );
  }
}
