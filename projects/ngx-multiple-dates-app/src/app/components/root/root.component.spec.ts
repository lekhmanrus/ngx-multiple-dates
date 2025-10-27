import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';

import { RootComponent } from './root.component';

describe('RootComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatNativeDateModule,
        MtxPopoverModule,
        RootComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    await expect(app).toBeTruthy();
  });

  it('should set and get themeClass, and update overlay container class', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    const overlay = (app as any)._overlayContainer;
    spyOn(overlay.getContainerElement().classList, 'remove').and.callThrough();
    spyOn(overlay.getContainerElement().classList, 'add').and.callThrough();
    const prev = app.themeClass;
    app.themeClass = 'test-theme';
    expect(app.themeClass).toBe('test-theme');
    expect(overlay.getContainerElement().classList.remove).toHaveBeenCalledWith(prev);
    expect(overlay.getContainerElement().classList.add).toHaveBeenCalledWith('test-theme');
  });

  it('should not update themeClass if value is falsy', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    const overlay = (app as any)._overlayContainer;
    spyOn(overlay.getContainerElement().classList, 'remove').and.callThrough();
    spyOn(overlay.getContainerElement().classList, 'add').and.callThrough();
    app.themeClass = '';
    expect(overlay.getContainerElement().classList.remove).not.toHaveBeenCalled();
    expect(overlay.getContainerElement().classList.add).not.toHaveBeenCalled();
  });

  it('should call myFilter and return false for weekend, true for weekday', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    // Sunday (0)
    expect(app.myFilter(new Date(2024, 6, 14))).toBeFalse();
    // Monday (1)
    expect(app.myFilter(new Date(2024, 6, 15))).toBeTrue();
  });

  it('should call dateRemoved and not throw', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(() => app.dateRemoved({ type: 'chip', date: new Date() })).not.toThrow();
  });

  it('should have predefined models and classes', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(Array.isArray(app.modelPredefined)).toBeTrue();
    expect(Array.isArray(app.classes)).toBeTrue();
    expect(app.modelPredefined.length).toBeGreaterThan(0);
    expect(app.classes.length).toBeGreaterThan(0);
  });

  it('should have a reactive form with dynamicName', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(app.reactiveForm.contains(app.dynamicName)).toBeTrue();
  });

  it('should initialize and add github icon', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    const iconRegistry = (app as any).matIconRegistry;
    spyOn(iconRegistry, 'addSvgIcon').and.callThrough();
    expect(typeof iconRegistry.addSvgIcon).toBe('function');
  });
});
