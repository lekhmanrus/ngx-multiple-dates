import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-theme-picker',
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ThemePickerComponent {
  public hovering: string | null = null;
  public items: any[] = [
    { className: 'azure-blue-theme'     },
    { className: 'cyan-orange-theme'    },
    { className: 'magenta-violet-theme' },
    { className: 'rose-red-theme'       }
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
