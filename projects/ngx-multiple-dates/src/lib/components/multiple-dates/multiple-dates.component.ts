import {
  Component,
  ChangeDetectionStrategy,
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
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DateAdapter,
  ThemePalette,
  CanUpdateErrorState,
  HasTabIndex,
  CanDisable,
  ErrorStateMatcher,
  HasTabIndexCtor,
  CanDisableCtor,
  CanUpdateErrorStateCtor,
  mixinTabIndex,
  mixinDisabled,
  mixinErrorState
} from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class MultipleDatesBase {
  constructor(
    protected $elementRef: ElementRef<HTMLElement>,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) { }
}
const _MultipleDatesBaseMixinBase: HasTabIndexCtor & CanDisableCtor & CanUpdateErrorStateCtor
  & typeof MultipleDatesBase = mixinTabIndex(mixinDisabled(mixinErrorState(MultipleDatesBase)));

@Component({
  selector: 'ngx-multiple-dates',
  templateUrl: './multiple-dates.component.html',
  styleUrls: [ './multiple-dates.component.scss' ],
  providers: [
    { provide: MatFormFieldControl, useExisting: MultipleDatesComponent }
  ],
  exportAs: 'ngxMultipleDates',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleDatesComponent<D = Date>
  extends _MultipleDatesBaseMixinBase
  implements AfterViewInit, OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<D[]>,
    HasTabIndex, CanDisable, CanUpdateErrorState, Validator {
  public static nextId = 0;
  // tslint:disable-next-line:variable-name
  public static ngAcceptInputType_required: BooleanInput;
  // tslint:disable-next-line:variable-name
  public static ngAcceptInputType_disabled: BooleanInput;
  // tslint:disable-next-line:variable-name
  public static ngAcceptInputType_value: any[];
  @Input()
  @HostBinding()
  public id = `ngx-multiple-dates-${MultipleDatesComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') public describedBy = '';
  @HostBinding('attr.aria-invalid')
  @HostBinding('class.mat-form-field-invalid')
  public errorState = false;
  @Input() public errorStateMatcher: ErrorStateMatcher;
  @Input()
  @HostBinding('attr.tabindex')
  public tabIndex: number;
  @Output() public dateChange = new EventEmitter<MatDatepickerInputEvent<D>>();
  public focused = false;
  public controlType ?: string | undefined = 'ngx-multiple-dates';
  public resetModel = new Date(0);
  public readonly stateChanges = new Subject<void>();
  private readonly _destroy = new Subject<void>();
  private _matDatepicker: MatDatepicker<D>;
  private _closeOnSelected = false;
  private _placeholder: string;
  private _required = false;
  private _disabled = false;
  private _value: D[] | null = [ ];
  private _color: ThemePalette | null = null;
  private _dateFilter: (date: D | null) => boolean;
  private _min: D | null;
  private _max: D | null;
  private _onChange: (_: any) => void = () => { };
  private _onTouched: () => void =  () => { };
  private _onValidatorChange: () => void =  () => { };
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !value || this._dateFilter(value)
      ? null
      : { matDatepickerFilter: true };
  }
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.min || !value || this._dateAdapter.compareDate(this.min, value) <= 0)
      ? null
      : { matDatepickerMin: { min: this.min, actual: value } };
  }
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.max || !value || this._dateAdapter.compareDate(this.max, value) >= 0)
      ? null
      : { matDatepickerMax: { max: this.max, actual: value } };
  }
  // tslint:disable-next-line:member-ordering
  private _validator: ValidatorFn | null = Validators.compose([
    this._filterValidator,
    this._minValidator,
    this._maxValidator
  ]);

  @Input()
  public get matDatepicker(): MatDatepicker<D> {
    return this._matDatepicker;
  }
  public set matDatepicker(value: MatDatepicker<D>) {
    if (!value || !(value instanceof MatDatepicker)) {
      throw new TypeError(
        `"matDatepicker" attribute of "ngx-multiple-dates" is required and should be an instance of
        Angular Material Datepicker component.`
      );
    }
    this._matDatepicker = value;

    this.matDatepicker.closedStream
      .pipe(takeUntil(this._destroy))
      .subscribe(() => this.blur());
    if (!this.matDatepicker.startAt) {
      this._setStartAt();
    }
    this._setDisabled();
    this._setDateClass();
  }

  @Input()
  public get closeOnSelected(): boolean {
    return this._closeOnSelected;
  }
  public set closeOnSelected(value: boolean) {
    this._closeOnSelected = coerceBooleanProperty(value);
  }

  @Input()
  @HostBinding('attr.aria-label')
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  @HostBinding('attr.aria-required')
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  @HostBinding('attr.disabled')
  public get disabled(): boolean {
    // if (this.ngControl && this.ngControl.disabled !== null) {
    //   return this.ngControl.disabled;
    // }
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

  @Input()
  public get color(): ThemePalette | null {
    return this._color;
  }
  public set color(value: ThemePalette | null) {
    this._color = value;
  }

  @Input()
  public get matDatepickerFilter(): (date: D | null) => boolean {
    return this._dateFilter;
  }
  public set matDatepickerFilter(value: (date: D | null) => boolean) {
    this._dateFilter = value;
    this._onValidatorChange();
  }

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

  @HostBinding('class.floating')
  public get shouldLabelFloat() {
    return !this.empty || (this.focused && !this.disabled);
  }

  public get empty(): boolean {
    return !this.value || !this.value.length;
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected $elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Attribute('tabindex') tabIndex: string
  ) {
    super($elementRef, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    _focusMonitor.monitor($elementRef.nativeElement, true)
      .subscribe((origin: any) => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
    this.tabIndex = Number(tabIndex) || 0;
  }

  public ngAfterViewInit(): void {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValidators(this.validate.bind(this));
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
      this.updateErrorState();
    }
  }

  @HostListener('focus')
  public focus(): void {
    if (!this.disabled) {
      this.focused = true;
      if (this.matDatepicker) {
        this.matDatepicker.open();
      }
      // this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  @HostListener('blur')
  public blur(): void {
    this.focused = false;
    if (!this.disabled) {
      this._onTouched();
      // if (this.matDatepicker && this.matDatepicker.opened) {
      //   this.matDatepicker.close();
      // }
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  public writeValue(value: D[] | null): void {
    this._value = value;
    if (value) {
      this._sort();
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

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick(): void {
    if (!this.focused) {
      this.focus();
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(control) : null;
  }

  public dateClass = (date: D) => {
    if (this._find(date) !== -1) {
      return [ 'selected' ];
    }
    return [ ];
  }

  public dateChanged(event: MatDatepickerInputEvent<D>): void {
    if (event.value) {
      const date = event.value;
      if (this.value) {
        const index = this._find(date);
        if (index === -1) {
          this.value.push(date);
          this._sort();
        } else {
          this.value.splice(index, 1)
        }
      }
      this.resetModel = new Date(0);
      this._setStartAt();
      if (this.matDatepicker && !this.closeOnSelected) {
        const closeFn = this.matDatepicker.close;
        this.matDatepicker.close = () => { };
        // tslint:disable-next-line:no-string-literal
        this.matDatepicker['_popupComponentRef'].instance._calendar.monthView._createWeekCells();
        setTimeout(() => this.matDatepicker.close = closeFn);
        this._changeDetectorRef.detectChanges();
      }
      this.writeValue(this.value);
    }
    this.dateChange.emit(event);
  }

  public remove(date: D): void {
    if (this.value && this.value.length) {
      const index = this._find(date);
      this.value.splice(index, 1);
      this.writeValue(this.value);
      this._changeDetectorRef.detectChanges();
    }
  }

  public trackByValue(_index: number, item: D): D {
    return item;
  }

  private _setStartAt(): void {
    if (this.matDatepicker) {
      if (this.value && this.value.length) {
        this.matDatepicker.startAt = this.value[this.value.length - 1];
      } else {
        this.matDatepicker.startAt = new Date() as any;
      }
    }
  }

  private _setDisabled(): void {
    if (this.matDatepicker) {
      this.matDatepicker.disabled = this.disabled;
    }
  }

  private _setDateClass(): void {
    if (this.matDatepicker) {
      const dateClassFn = this.matDatepicker.dateClass;
      this.matDatepicker.dateClass = (date: D) => {
        const classList = this.dateClass(date);
        if (dateClassFn) {
          const oldClasses = dateClassFn(date);
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
    return this.value.map((value) => this._toNumber(value)).indexOf(this._toNumber(date));
  }

  private _sort(): void {
    if (this.value) {
      this.value.sort((lhs, rhs) => this._toNumber(lhs) - this._toNumber(rhs));
    }
  }

  private _toNumber(date: D): number {
    if (date instanceof Date) {
      return +date;
    } else {
      const momentLike = date as any;
      if (momentLike.toDate && momentLike.toDate instanceof Function) {
        return +momentLike.toDate();
      } else {
        throw new TypeError('Unknown type. It can be either Date or Moment.');
      }
    }
  }
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }
}
