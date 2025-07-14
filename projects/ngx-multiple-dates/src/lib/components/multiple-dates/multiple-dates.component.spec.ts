import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';

import { MultipleDatesComponent } from './multiple-dates.component';

describe('MultipleDatesComponent', () => {
  let component: MultipleDatesComponent;
  let fixture: ComponentFixture<MultipleDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatNativeDateModule,
        MultipleDatesComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ],
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

  it('should add a date via dateChanged and emit dateChange', () => {
    const testDate = new Date(2024, 0, 1);
    const spy = spyOn(component.dateChange, 'emit');
    component.dateChanged({ value: testDate } as any);
    expect(component.value).toContain(testDate);
    expect(spy).toHaveBeenCalled();
  });

  it('should remove a date via removeChip and emit remove', () => {
    const testDate = new Date(2024, 0, 2);
    component.value = [ testDate ];
    const spy = spyOn(component.remove, 'emit');
    component.removeChip(testDate);
    expect(component.value).not.toContain(testDate);
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ date: testDate, type: 'chip' }));
  });

  it('should set and get placeholder', () => {
    component.placeholder = 'Select dates';
    expect(component.placeholder).toBe('Select dates');
  });

  it('should set and get required', () => {
    component.required = true;
    expect(component.required).toBeTrue();
    component.required = false;
    expect(component.required).toBeFalse();
  });

  it('should set and get disabled', () => {
    component.disabled = true;
    expect(component.disabled).toBeTrue();
    component.disabled = false;
    expect(component.disabled).toBeFalse();
  });

  it('should set and get min/max', () => {
    const minDate = new Date(2023, 0, 1);
    const maxDate = new Date(2025, 0, 1);
    component.min = minDate;
    component.max = maxDate;
    expect(component.min).toBe(minDate);
    expect(component.max).toBe(maxDate);
  });

  it('should return undefined from getClassName if no classes match', () => {
    expect(component.getClassName(new Date())).toBeUndefined();
  });

  it('should emit remove event with correct type when removeChip is called', () => {
    const testDate = new Date(2024, 0, 3);
    component.value = [ testDate ];
    const spy = spyOn(component.remove, 'emit');
    component.removeChip(testDate);
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ type: 'chip', date: testDate }));
  });

  it('should call writeValue and update value', () => {
    const testDates = [ new Date(2024, 0, 4), new Date(2024, 0, 5) ];
    component.writeValue(testDates);
    expect(component.value).toEqual(jasmine.arrayContaining(testDates));
  });

  it('should not add duplicate date via dateChanged', () => {
    const testDate = new Date(2024, 0, 6);
    component.value = [testDate];
    const spy = spyOn(component.dateChange, 'emit');
    component.dateChanged({ value: testDate } as any);
    // Дата повинна бути видалена (toggle)
    expect(component.value).not.toContain(testDate);
    expect(spy).toHaveBeenCalled();
  });

  it('should not remove date if value is empty in removeChip', () => {
    component.value = [];
    const spy = spyOn(component.remove, 'emit');
    component.removeChip(new Date(2024, 0, 7));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call setDescribedByIds and update describedBy', () => {
    component.setDescribedByIds(['a', 'b']);
    expect(component.describedBy).toBe('a b');
  });

  it('should call onContainerClick and focus if not focused', () => {
    component.focused = false;
    const spy = spyOn(component, 'focus');
    component.onContainerClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call focus in onContainerClick if already focused', () => {
    component.focused = true;
    const spy = spyOn(component, 'focus');
    component.onContainerClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should return true for empty if value is null or empty', () => {
    component.value = null;
    expect(component.empty).toBeTrue();
    component.value = [];
    expect(component.empty).toBeTrue();
  });

  it('should return false for empty if value has items', () => {
    component.value = [new Date()];
    expect(component.empty).toBeFalse();
  });

  it('should call registerOnChange and registerOnTouched', () => {
    const fn = jasmine.createSpy('onChange');
    component.registerOnChange(fn);
    component.registerOnTouched(fn);
    (component as any)._onChange('test');
    (component as any)._onTouched();
    expect(fn).toHaveBeenCalled();
  });

  it('should call registerOnValidatorChange', () => {
    const fn = jasmine.createSpy('onValidatorChange');
    component.registerOnValidatorChange(fn);
    (component as any)._onValidatorChange();
    expect(fn).toHaveBeenCalled();
  });

  it('should validate using custom validator', () => {
    const control = { value: new Date(2024, 0, 8) } as any;
    // _validator is composed, but we can check that validate returns null for default
    expect(component.validate(control)).toBeNull();
  });

  it('should call trackByValue and return item', () => {
    const date = new Date();
    expect(component.trackByValue(0, date)).toBe(date);
  });
});
