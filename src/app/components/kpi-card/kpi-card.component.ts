import { Component, input } from '@angular/core';
import { ProBadgeComponent } from '../pro-badge/pro-badge.component';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [ProBadgeComponent],
  template: `
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;flex:1;min-width:160px;position:relative;overflow:hidden;">
      @if (locked()) {
        <div style="position:absolute;inset:0;backdrop-filter:blur(4px);background:rgba(241,244,248,0.7);border-radius:12px;display:flex;align-items:center;justify-content:center;z-index:1;">
          <app-pro-badge/>
        </div>
      }
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <span style="font-size:11px;color:var(--text-3);font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">{{ label() }}</span>
        <div [style.background]="(color() || '#2563EB') + '18'" style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;">{{ icon() }}</div>
      </div>
      <div [style.color]="color() || 'var(--text-1)'" style="font-size:28px;font-weight:800;margin-bottom:6px;letter-spacing:-0.5px;">{{ value() }}</div>
      <div style="display:flex;align-items:center;gap:8px;">
        @if (sub()) {
          <span style="font-size:11px;color:var(--text-3);">{{ sub() }}</span>
        }
        @if (delta() !== undefined) {
          <span [style.color]="(delta()! >= 0) ? '#10B981' : '#EF4444'"
                [style.background]="(delta()! >= 0) ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'"
                style="font-size:11px;font-weight:600;padding:1px 6px;border-radius:4px;">
            {{ delta()! >= 0 ? '↑' : '↓' }} {{ abs(delta()!) }}%
          </span>
        }
      </div>
    </div>
  `
})
export class KpiCardComponent {
  label = input('');
  value = input<string | number>('');
  sub = input('');
  delta = input<number | undefined>(undefined);
  icon = input('');
  color = input('');
  locked = input(false);
  unit = input('');
  trend = input('');

  abs(n: number) { return Math.abs(n); }
}
