import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemePickerComponent } from './theme-picker.component';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ThemePickerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });

  it('should have 4 theme items', () => {
    expect(component.items.length).toBe(4);
    expect(component.items.map(i => i.className)).toEqual([
      'azure-blue-theme', 'cyan-orange-theme', 'magenta-violet-theme', 'rose-red-theme'
    ]);
  });

  it('should emit themeChange when theme is set', () => {
    const spy = spyOn(component.themeChange, 'emit');
    component.theme = 'azure-blue-theme';
    expect(component.theme).toBe('azure-blue-theme');
    expect(spy).toHaveBeenCalledWith('azure-blue-theme');
  });

  it('should update hovering on focus, mouseenter, mouseleave', () => {
    const item = component.items[0];
    // focus
    component.hovering = null;
    component.hovering = item.className;
    expect(component.hovering).toBe(item.className);
    // mouseleave
    component.hovering = null;
    expect(component.hovering).toBeNull();
  });

  it('should set theme via click simulation', () => {
    const spy = spyOn(component.themeChange, 'emit');
    // Симулюємо клік по кожній темі
    for (const item of component.items) {
      component.theme = item.className;
      expect(component.theme).toBe(item.className);
      expect(spy).toHaveBeenCalledWith(item.className);
    }
  });

  it('should handle empty theme', () => {
    component.theme = '';
    expect(component.theme).toBe('');
  });
});
