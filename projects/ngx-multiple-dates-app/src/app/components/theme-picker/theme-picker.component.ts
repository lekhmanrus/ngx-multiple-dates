import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: [ './theme-picker.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemePickerComponent {
  public hovering: string | null = null;
  public items: any[] = [
    { className: 'indigo-pink-theme'      },
    { className: 'deeppurple-amber-theme' },
    { className: 'purple-green-theme'     }
  ];
  @Output() public themeChange = new EventEmitter<string>();
  private _theme = '';

  @Input()
  public get theme(): string {
    return this._theme;
  }
  public set theme(value: string) {
    this._theme = value;
    this.themeChange.emit(this._theme);
  }
}
