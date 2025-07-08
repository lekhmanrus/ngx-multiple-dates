/* eslint-disable max-classes-per-file */
import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  DoCheck,
  HostBinding,
  Input,
  Output,
  EventEmitter,
  Optional,
  Self,
  ElementRef,
  Attribute,
  HostListener
} from '@angular/core';
import {
  ControlValueAccessor,
  AbstractControl,
  NgControl,
  NgForm,
  FormGroupDirective,
  Validator,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceArray, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDatepickerModule,
  MatCalendar,
  MatDatepicker,
  MatDatepickerInputEvent,
  MatCalendarCellClassFunction
} from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  DateAdapter,
  ThemePalette,
  ErrorStateMatcher
} from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DateClass } from '../../models/date-class.model';
import { DateRemoveEvent } from '../../models/date-remove-event.model';

abstract class MultipleDatesBaseMixinBase {
  /**
   * Stream that emits whenever the state of the control changes such that the parent
   * `MatFormField` needs to run change detection.
   */
  public readonly stateChanges = new Subject<void>();

  constructor(
    protected $elementRef: ElementRef<HTMLElement>,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) { }
}

// Temporarily disable mixins until we find the correct API
const _MultipleDatesBaseMixinBase = MultipleDatesBaseMixinBase;

/**
 * Multiple dates component.
 * @template D Date type.
 */
@Component({
  selector: 'ngx-multiple-dates',
  templateUrl: './multiple-dates.component.html',
  styleUrls: [ './multiple-dates.component.scss' ],
  providers: [
    { provide: MatFormFieldControl, useExisting: MultipleDatesComponent }
  ],
  exportAs: 'ngxMultipleDates',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ]
})
export class MultipleDatesComponent<D = Date>
  extends _MultipleDatesBaseMixinBase
  implements AfterViewInit, OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<D[]>,
    Validator {
  public static nextId = 0;
  /** Unique id of the element. */
  @Input()
  @HostBinding()
  public id = `ngx-multiple-dates-${MultipleDatesComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') public describedBy = '';
  /** Whether the control is in an error state. */
  @HostBinding('attr.aria-invalid')
  @HostBinding('class.mat-form-field-invalid')
  public errorState = false;
  /** An object used to control when error messages are shown. */
  @Input() public errorStateMatcher: ErrorStateMatcher;
  @Input()
  @HostBinding('attr.tabindex')
  public tabIndex: number;
  /**
   * The date/time components to include, using predefined options or a custom format string.
   * @see {@link https://angular.io/api/common/DatePipe#usage-notes DatePipe Usage notes} for more
   * information.
   */
  @Input() public format?: string;
  /** Emits when a change event is fired on this `ngx-multiple-dates` element. */
  @Output() public readonly dateChange = new EventEmitter<MatDatepickerInputEvent<D>>();
  /** Emits on a date removal. */
  @Output() public readonly remove = new EventEmitter<DateRemoveEvent<D>>();
  /** Whether `ngx-multiple-dates` element has focus. */
  public focused = false;
  /** A name for this control that can be used by mat-form-field. */
  public controlType? = 'ngx-multiple-dates';
  /**
   * Model used to reset datepicker selected value, so unselect just selected date will be
   * possible.
   */
  public resetModel: D;
  private readonly _destroy = new Subject<void>();
  /**
   * The datepicker (or calendar - for inline view) that this `ngx-multiple-dates` element is
   * associated with.
   */
  private _matDatepicker: MatDatepicker<D> | MatCalendar<D>;
  /** Whether datepicker should be closed on date selected, or opened to select more dates. */
  private _closeOnSelected = false;
  /** Placeholder to be shown if no value has been selected. */
  private _placeholder: string;
  /** Whether the component is required. */
  private _required = false;
  /** Whether the component is disabled. */
  private _disabled = false;
  /** The value of the `ngx-multiple-dates` control. */
  private _value: D[] | null = [ ];
  /**
   * Theme color palette for the component. This API is supported in M2 themes only, it has no
   * effect in M3 themes.
   * For information on applying color variants in M3, see
   * https://material.angular.io/guide/theming#using-component-color-variants.
   */
  private _color: ThemePalette | null = null;
  /** Function that can be used to filter out dates within the datepicker. */
  private _dateFilter: (date: D | null) => boolean;
  /** The minimum valid date. */
  private _min: D | null;
  /** The maximum valid date. */
  private _max: D | null;
  /** Custom date classes. */
  private _classes: Array<DateClass<D>> = [ ];
  private _validator: ValidatorFn | null;
  private _onChange: (_: any) => void = () => { };
  private _onTouched: () => void =  () => { };
  private _onValidatorChange: () => void =  () => { };
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !value || this._dateFilter(value)
      ? null
      : { matDatepickerFilter: true };
  };
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.min || !value || this._dateAdapter.compareDate(this.min, value) <= 0)
      ? null
      : { matDatepickerMin: { min: this.min, actual: value } };
  };
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.max || !value || this._dateAdapter.compareDate(this.max, value) >= 0)
      ? null
      : { matDatepickerMax: { max: this.max, actual: value } };
  };

  /**
   * The datepicker (or calendar - for inline view) that this `ngx-multiple-dates` element is
   * associated with.
   */
  @Input()
  public get matDatepicker(): MatDatepicker<D> | MatCalendar<D> {
    return this._matDatepicker;
  }
  public set matDatepicker(value: MatDatepicker<D> | MatCalendar<D>) {
    if (!value || (!(value instanceof MatDatepicker) && !(value instanceof MatCalendar))) {
      throw new TypeError(
        `Either "matDatepicker" or "matCalendar" attribute of "ngx-multiple-dates" is required and
        should be an instance of Angular Material Datepicker component.`
      );
    }
    this._matDatepicker = value;

    if (this.matDatepicker instanceof MatDatepicker) {
      this.matDatepicker.closedStream
        .pipe(takeUntil(this._destroy))
        .subscribe(() => this.blur());
    }  else {
      this.matDatepicker.selectedChange
        .pipe(takeUntil(this._destroy))
        .subscribe((event) => this.dateChanged({ value: event } as MatDatepickerInputEvent<D>));
    }
    if (!this.matDatepicker.startAt) {
      this._setStartAt();
    }
    this._setDisabled();
    this._setDateClass();
  }

  /** Whether datepicker should be closed on date selected, or opened to select more dates. */
  @Input()
  public get closeOnSelected(): boolean {
    return this._closeOnSelected;
  }
  public set closeOnSelected(value: boolean) {
    this._closeOnSelected = coerceBooleanProperty(value);
  }

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  @HostBinding('attr.aria-label')
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  /** Whether the component is required. */
  @Input()
  @HostBinding('attr.aria-required')
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /** Whether the component is disabled. */
  @Input()
  @HostBinding('attr.disabled')
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._setDisabled();
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  /** The value of the `ngx-multiple-dates` control. */
  @Input()
  public get value(): D[] | null {
    if (!this._value) {
      this._value = [ ];
    }
    return this._value;
  }
  public set value(value: D[] | null) {
    if (value !== this._value) {
      this.writeValue(value);
    }
  }

  /**
   * Theme color palette for the component. This API is supported in M2 themes only, it has no
   * effect in M3 themes.
   * For information on applying color variants in M3, see
   * https://material.angular.io/guide/theming#using-component-color-variants.
   */
  @Input()
  public get color(): ThemePalette | null {
    return this._color;
  }
  public set color(value: ThemePalette | null) {
    this._color = value;
  }

  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  public get matDatepickerFilter(): (date: D | null) => boolean {
    return this._dateFilter;
  }
  public set matDatepickerFilter(value: (date: D | null) => boolean) {
    this._dateFilter = value;
    this._onValidatorChange();
  }

  /** The minimum valid date. */
  @Input()
  public get min(): D | null {
    return this._min;
  }
  public set min(value: D | null) {
    this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._onValidatorChange();
  }

  /** The maximum valid date. */
  @Input()
  public get max(): D | null {
    return this._max;
  }
  public set max(value: D | null) {
    this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._onValidatorChange();
  }

  /** Custom date classes. */
  @Input()
  public get classes(): Array<DateClass<D>> {
    return this._classes;
  }
  public set classes(value: Array<DateClass<D>>) {
    this._classes = coerceArray(value);
  }

  /** Whether the `MatFormField` label should try to float. */
  @HostBinding('class.floating')
  public get shouldLabelFloat() {
    return !this.empty || (this.focused && !this.disabled);
  }

  /** Whether the select has a value. */
  public get empty(): boolean {
    return !this.value || !this.value.length;
  }

  /** Whether the settled picker is a datepicker. */
  public get isDatepicker(): boolean {
    return this.matDatepicker instanceof MatDatepicker;
  }

  /**
   * Creates an instance of MultipleDatesComponent.
   * @param ngControl Form control to manage component.
   * @param $elementRef A wrapper around a native element inside of a View.
   * @param _changeDetectorRef Base class that provides change detection functionality.
   * @param _focusMonitor Monitors mouse and keyboard events to determine the cause of focus events.
   * @param _dateAdapter Adapts type `D` to be usable as a date by cdk-based components that work
   * with dates.
   * @param parentForm Parent form.
   * @param parentFormGroup Parent form group.
   * @param defaultErrorStateMatcher Provider that defines how form controls behave with regards to
   * displaying error messages.
   * @param tabIndex Tab index.
   */
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected $elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    private _dateAdapter: DateAdapter<D>,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Attribute('tabindex') tabIndex: string
  ) {
    super($elementRef, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);
    this.resetModel = _dateAdapter.createDate(0, 0, 1);
    const validators = [
      this._filterValidator,
      this._minValidator,
      this._maxValidator
    ];
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
      if (this.ngControl.validator) {
        validators.push(this.ngControl.validator);
      }
    }
    this._validator = Validators.compose(validators);
    _focusMonitor.monitor($elementRef.nativeElement, true)
      .subscribe((origin: any) => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
    this.tabIndex = Number(tabIndex) || 0;
  }

  public ngAfterViewInit(): void {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.addValidators(this.validate.bind(this));
    }
    this._setStartAt();
    this._setDateClass();
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this.$elementRef.nativeElement);
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      this._updateErrorState();
    }
  }

  private _updateErrorState(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
    const control = this.ngControl ? this.ngControl.control as AbstractControl : null;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const newState = matcher.isErrorState(control, parent);

    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }

  /** Focuses the `ngx-multiple-dates` element. */
  @HostListener('focus')
  public focus(): void {
    if (!this.disabled) {
      this.focused = true;
      if (this.matDatepicker && this.matDatepicker instanceof MatDatepicker) {
        this.matDatepicker.open();
      }
      this.stateChanges.next();
    }
  }

  /** Used to leave focus from the `ngx-multiple-dates` element. */
  @HostListener('blur')
  public blur(): void {
    this.focused = false;
    if (!this.disabled) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  public writeValue(value: D[] | null): void {
    if (Array.isArray(value)) {
      this._value = [ ...value ];
      this._sort();
    } else {
      this._value = value;
    }
    this._onChange(value);
    this.stateChanges.next();
  }

  public registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this._onValidatorChange = fn;
  }

  /**
   * Sets the list of element IDs that currently describe this control.
   * @param ids Ids to set.
   */
  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  /** Handles a click on the control's container. */
  public onContainerClick(): void {
    if (!this.focused) {
      this.focus();
    }
  }

  /**
   * Performs synchronous validation for the control.
   * @param control The control to validate against.
   * @returns A map of validation errors if validation fails, otherwise null.
   */
  public validate(control: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(control) : null;
  }

  /**
   * Function used to add CSS classes to selected dates.
   * @param date Date to check if classes should be applied.
   * @returns CSS classes to apply.
   */
  public dateClass = (date: D) => {
    let className: string | undefined;
    if (this.classes.length) {
      className = this.getClassName(date);
    }
    if (this._find(date) !== -1) {
      return [ 'selected', ...(className ? [ className ] : [ ]) ];
    }
    if (className) {
      return [ className ];
    }
    return [ ];
  };

  /**
   * Fires when a change event is fired on the datepicker `<input />`.
   * @param event Change event.
   */
  public dateChanged(event: MatDatepickerInputEvent<D>): void {
    if (event.value) {
      const date = event.value;
      if (this.value) {
        const index = this._find(date);
        if (index === -1) {
          this.value.push(date);
          this._sort();
        } else {
          this.value.splice(index, 1);
          this.remove.emit({ type: 'datepicker', date });
        }
      }
      this.resetModel = this._dateAdapter.createDate(0, 0, 1);
      this._setStartAt();
      if (this.matDatepicker && this.matDatepicker instanceof MatDatepicker
        && !this.closeOnSelected) {
        const closeFn = this.matDatepicker.close;
        this.matDatepicker.close = () => { };
        this.matDatepicker['_componentRef'].instance._calendar.monthView._createWeekCells();
        setTimeout(() => (this.matDatepicker as MatDatepicker<D>).close = closeFn);
        this._changeDetectorRef.detectChanges();
      } else if (this.matDatepicker instanceof MatCalendar) {
        (this.matDatepicker.monthView as any)._createWeekCells();
      }
      this.writeValue(this.value);
    }
    this.dateChange.emit(event);
  }

  /**
   * Removes selected chip from the list.
   * @param date Value to remove.
   */
  public removeChip(date: D): void {
    if (this.value && this.value.length) {
      this._onTouched();
      const index = this._find(date);
      this.value.splice(index, 1);
      this.writeValue(this.value);
      if (this.matDatepicker instanceof MatCalendar) {
        (this.matDatepicker.monthView as any)._createWeekCells();
        (this.matDatepicker.monthView as any)._changeDetectorRef.detectChanges();
      }
      this.remove.emit({ type: 'chip', date });
      this._changeDetectorRef.detectChanges();
    }
  }

  public trackByValue(_index: number, item: D): D {
    return item;
  }

  public getClassName(value: D): string | undefined {
    for (const classValue of this.classes) {
      if (this._dateAdapter.compareDate(classValue.value, value) === 0) {
        return classValue.className;
      }
    }
    return undefined;
  }

  private _setStartAt(): void {
    if (this.matDatepicker) {
      if (this.value && this.value.length) {
        this.matDatepicker.startAt = this.value[this.value.length - 1];
      } else {
        this.matDatepicker.startAt = this._dateAdapter.today();
      }
    }
  }

  private _setDisabled(): void {
    if (this.matDatepicker && this.matDatepicker instanceof MatDatepicker) {
      this.matDatepicker.disabled = this.disabled;
    }
  }

  private _setDateClass(): void {
    if (this.matDatepicker) {
      const dateClassFn: MatCalendarCellClassFunction<D> = this.matDatepicker.dateClass;
      this.matDatepicker.dateClass = (date: D) => {
        const classList = this.dateClass(date);
        if (dateClassFn) {
          const oldClasses = dateClassFn(date, 'month');
          if (classList.length) {
            if (oldClasses instanceof Set) {
              for (const className of classList) {
                oldClasses.add(className);
              }
            } else if (oldClasses instanceof Array) {
              for (const className of classList) {
                oldClasses.push(className);
              }
            } else if (typeof('t') === 'string') {
              return [ oldClasses, ...classList ].join(' ');
            } else {
              for (const className of classList) {
                oldClasses[className] = className;
              }
            }
            return oldClasses;
          }
          return oldClasses;
        }
        return classList;
      };
    }
  }

  private _find(date: D): number {
    if (!this.value) {
      return -1;
    }
    return this.value.map((value) => this._dateAdapter.compareDate(value, date)).indexOf(0);
  }

  private _sort(): void {
    if (this.value) {
      this.value.sort((lhs, rhs) => this._dateAdapter.compareDate(lhs, rhs));
    }
  }

  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }

  getDateFormat(date: any) {
    return this._dateAdapter.format(date, this.format || undefined)
  }
}
