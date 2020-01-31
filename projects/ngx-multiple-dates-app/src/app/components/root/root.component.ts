import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

import { DEFAULT_THEME } from '../../app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: [ './root.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public min = new Date(+(new Date()) - 30 * 24 * 60 * 60 * 1000);
  public max = new Date(+(new Date()) + 30 * 24 * 60 * 60 * 1000);
  public reactiveControl = new FormControl();
  public dynamicName = 'reactiveFormControl';
  public reactiveForm = new FormGroup({
    [this.dynamicName]: new FormControl(this.modelPredefined)
  });
  @HostBinding('class') private _themeClass: string = DEFAULT_THEME;

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

  constructor(private _overlayContainer: OverlayContainer) {
    this._overlayContainer.getContainerElement().classList.add(this.themeClass);
    this.reactiveControl.valueChanges.subscribe((values) => console.log('reactiveControl', values));
    this.reactiveForm.valueChanges.subscribe((values) => console.log('reactiveForm', values));
  }
}
