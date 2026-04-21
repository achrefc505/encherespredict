import { Component, input, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-confidence-ring',
  standalone: true,
  template: `
    <div [style.width.px]="size()" [style.height.px]="size()" style="position:relative;">
      <svg [attr.width]="size()" [attr.height]="size()" style="transform:rotate(-90deg);">
        <circle [attr.cx]="size()/2" [attr.cy]="size()/2" [attr.r]="r()"
          fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="6"/>
        <circle [attr.cx]="size()/2" [attr.cy]="size()/2" [attr.r]="r()"
          fill="none" [attr.stroke]="color()" stroke-width="6"
          [attr.stroke-dasharray]="dasharray()"
          stroke-linecap="round"/>
        <circle [attr.cx]="size()/2" [attr.cy]="size()/2" [attr.r]="r()"
          fill="none" [attr.stroke]="color()" stroke-width="6" opacity="0.15"
          [attr.stroke-dasharray]="circ() + ' 0'"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <span [style.font-size.px]="size() * 0.22" [style.color]="color()" style="font-weight:800;line-height:1;">{{ current() }}%</span>
        <span style="font-size:9px;color:var(--text-3);letter-spacing:0.3px;margin-top:2px;">confiance</span>
      </div>
    </div>
  `
})
export class ConfidenceRingComponent {
  value = input(0);
  size = input(88);
  animate = input(true);

  current = signal(0);

  r() { return this.size() / 2 - 7; }
  circ() { return 2 * Math.PI * this.r(); }
  dasharray() {
    const dash = (this.current() / 100) * this.circ();
    return `${dash} ${this.circ() - dash}`;
  }
  color() {
    const v = this.value();
    return v >= 80 ? '#10B981' : v >= 65 ? '#2563EB' : '#F59E0B';
  }

  constructor() {
    afterNextRender(() => {
      if (!this.animate()) {
        this.current.set(this.value());
        return;
      }
      let start: number | null = null;
      const dur = 1400;
      const target = this.value();
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        this.current.set(Math.round(e * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
}
