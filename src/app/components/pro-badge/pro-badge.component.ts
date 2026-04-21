import { Component } from '@angular/core';

@Component({
  selector: 'app-pro-badge',
  standalone: true,
  template: `
    <span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;background:rgba(139,92,246,0.18);color:#A78BFA;border:1px solid rgba(139,92,246,0.32);letter-spacing:0.4px;">
      ✦ PRO
    </span>
  `
})
export class ProBadgeComponent {}
