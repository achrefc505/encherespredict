import { Component, input } from '@angular/core';
import { BADGE_CONFIG } from '../../models/badge.config';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [style.background]="config().bg"
          [style.color]="config().color"
          [style.border]="'1px solid ' + config().border"
          style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:0.2px;">
      @if (config().dot) {
        <span [style.background]="config().dot" style="width:6px;height:6px;border-radius:50%;flex-shrink:0;"></span>
      }
      {{ config().label }}
    </span>
  `
})
export class BadgeComponent {
  type = input<string>('neutre');

  config() {
    return BADGE_CONFIG[this.type()] || BADGE_CONFIG['neutre'];
  }
}
