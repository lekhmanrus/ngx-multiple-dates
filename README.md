# Angular Multiple Dates

Multiple dates picker based on [Angular Material](https://material.angular.io).

![Example](https://raw.githubusercontent.com/lekhmanrus/ngx-multiple-dates/master/assets/animation.gif)



## [Demo](https://lekhmanrus.github.io/ngx-multiple-dates/)



## Installation

1. Install  dependency:

```sh
npm install --save ngx-multiple-dates
```

2. Include `NgxMultipleDatesModule ` to your module:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates'; // module import

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    NgxMultipleDatesModule // import to Angular
    // ...
  ],
  // ...
})
export class AppModule { }
```

3. Styles:

* Add one of the prebuilt themes to `angular.json` or your styles file:
```css
@import 'ngx-multiple-dates/prebuilt-themes/indigo-pink.css';
```

* Or you can use custom SCSS theme:
```scss
@import '~@angular/material/theming';
@import '~ngx-multiple-dates/theming'; // import library theme

@include mat-core();
// Palette
$primary: mat-palette($mat-indigo);
$accent:  mat-palette($mat-pink);

$theme: mat-light-theme($primary, $accent); // theme
@include angular-material-theme($theme); // apply Angular Material styles
@include ngx-multiple-dates-theme($theme); // apply Angular Multiple Dates styles

// ...
```



### Available pre-built themes:

* `deeppurple-amber.css`
* `indigo-pink.css`
* `pink-bluegrey.css`
* `purple-green.css`



## Dependencies

* Angular
* Angular CDK
* Angular Material
* RxJs



## Examples

```html
<mat-form-field>
  <ngx-multiple-dates [matDatepicker]="picker" placeholder="Excluded Dates" name="excludedDates"
                      [(ngModel)]="model">
  </ngx-multiple-dates>
  <mat-datepicker-toggle matPrefix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```



## API reference

### MultipleDatesComponent<D = Date>

Selector: `ngx-multiple-dates`

Exported as: `ngxMultipleDates`

**Properties**

| Name                | Description                                                              |
|---------------------|--------------------------------------------------------------------------|
| **Input**           |                                                                          |
| `@Input()`<br />`value: D \| null` | The value of the `ngx-multiple-dates` control.             |
| `@Input()`<br />`matDatepicker: MatDatepicker<D>` | The datepicker that this `ngx-multiple-dates` element is associated with. |
| `@Input()`<br />`color: ThemePalette` | Theme color palette for the component.                        |
| `@Input()`<br />`placeholder: string` | Placeholder to be shown if no value has been selected.        |
| `@Input()`<br />`required: boolean` | Whether the component is required.                              |
| `@Input()`<br />`disabled: boolean` | Whether the component is disabled.                              |
| `@Input()`<br />`matDatepickerFilter: (date: D) => boolean` | Function that can be used to filter out dates within the datepicker. |
| `@Input()`<br />`max: D \| null` | The maximum valid date.                                             |
| `@Input()`<br />`min: D \| null` | The minimum valid date.                                             |
| `@Input()`<br />`id: string` | Unique id of the element.                                              |
| `@Input()`<br />`errorStateMatcher`: ErrorStateMatcher | An object used to control when error messages are shown. Color palette to use on the datepicker's calendar. |
| **Output**          |                                                                          |
| `@Output()`<br />`dateChange: EventEmitter<MatDatepickerInputEvent<D>>` | Emits when a change event is fired on this `ngx-multiple-dates` element. |
| **Properties**      |                                                                          |
| `resetModel: Date`  | Model used to reset datepicker selected value, so unselect just selectad date will be possible. |
| `closeOnSelected: boolean` | Whether datepicker should be closed on date selected, or opened to select more dates. |
| `empty: boolean`    | Whether the select has a value.                                          |
| `shouldLabelFloat: boolean` | Whether the `MatFormField` label should try to float.                   |
| `focused: boolean`  | Whether `ngx-multiple-dates` element has focus.                          |
| `errorState: boolean` | Whether the control is in an error state.                              |
| `stateChanges: Observable<void>` | Stream that emits whenever the state of the control changes such that the parent MatFormField needs to run change detection. |
| `ngControl: NgControl` | Form control to manage component.                                     |
| `controlType: 'ngx-multiple-dates'` | A name for this control that can be used by mat-form-field. |


**Methods**

* `focus` <br /> Focuses the `ngx-multiple-dates` element.

* `blur` <br /> Used to leave focus from the `ngx-multiple-dates` element.

* `setDescribedByIds` <br /> Sets the list of element IDs that currently describe this control.

| **Parameters**      |                                                                             |
|---------------------|-----------------------------------------------------------------------------|
| `ids: string[]`     | Ids to set.                                                                 |

* `onContainerClick` <br /> Handles a click on the control's container.

* `validate` <br /> Performs synchronous validation for the control.

| **Parameters**             |                                                                      |
|----------------------------|----------------------------------------------------------------------|
| `control: AbstractControl` | The control to validate against.                                     |
| **Returns**                                                                                       |
| `ValidationErrors \| null`  | A map of validation errors if validation fails, otherwise null.      |

* `dateClass` <br /> Function used to add CSS classes to selected dates.

| **Parameters**              |                                                                     |
|-----------------------------|---------------------------------------------------------------------|
| `date: D`                   | Date to check if classes should be applied.                         |
| **Returns**                 |                                                                     |
| `MatCalendarCellCssClasses` | CSS classes to apply.                                               |

* `dateChanged` <br /> Fires when a change event is fired on the datepicker `<input />`.

| **Parameters**                      |                                                             |
|-------------------------------------|-------------------------------------------------------------|
| `event: MatDatepickerInputEvent<D>` | Change event.                                               |

* `remove` <br /> Removes selected chip from the list.

| **Parameters**              |                                                                     |
|-----------------------------|---------------------------------------------------------------------|
| `date: D`                   | Value to remove.                                                    |



## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.



## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
