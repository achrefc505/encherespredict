import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { StateService } from '../../services/state.service';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  auctions: 'Enchères',
  profitability: 'Rentabilité',
  landing: 'Accueil',
  onboarding: 'Onboarding',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--border);background:var(--surface-1);flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:11px;color:var(--text-3);">Accueil</span>
        <span style="font-size:11px;color:var(--text-3);">›</span>
        <span style="font-size:11px;color:var(--text-1);font-weight:600;">{{ screenLabel() }}</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="font-size:11px;color:var(--text-3);display:flex;align-items:center;gap:6px;">
          <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;box-shadow:0 0 6px #10B981;"></span>
          Données en temps réel
        </div>
        <div style="width:30px;height:30px;border-radius:8px;background:var(--surface-3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--text-2);">🔔</div>
        <div (click)="state.tweaksOpen.set(true)" style="width:30px;height:30px;border-radius:8px;background:var(--surface-3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--text-2);" title="Tweaks">⚙</div>
      </div>
    </header>
  `
})
export class TopbarComponent {
  state = inject(StateService);
  private router = inject(Router);

  // Reactive URL signal — updates on every navigation in zoneless mode
  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  screenLabel() {
    const segment = this.url().split('/')[1] ?? '';
    return LABELS[segment] ?? (segment.charAt(0).toUpperCase() + segment.slice(1));
  }
}
