import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: [ './theme-picker.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class ThemePickerComponent {
  public hovering: string | null = null;
  public items = [
    { className: 'azure-blue-theme'     },
    { className: 'cyan-orange-theme'    },
    { className: 'magenta-violet-theme' },
    { className: 'rose-red-theme'       }
  ];
  public readonly theme = model.required<string>();
}
