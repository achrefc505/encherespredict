import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { StateService } from '../../services/state.service';
import { AuctionService } from '../../services/auction.service';
import { AlertDto } from '../../models/api.models';

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
    <header style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--border);background:var(--surface-1);flex-shrink:0;position:relative;">
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

        <!-- Bell + dropdown -->
        <div style="position:relative;">
          <div (click)="toggleAlerts()"
            style="width:30px;height:30px;border-radius:8px;background:var(--surface-3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--text-2);position:relative;">
            🔔
            @if (unreadCount() > 0) {
              <span style="position:absolute;top:-4px;right:-4px;background:#EF4444;color:#fff;font-size:9px;font-weight:700;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 4px;box-shadow:0 0 0 2px var(--surface-1);">
                {{ unreadCount() }}
              </span>
            }
          </div>

          @if (open()) {
            <div style="position:absolute;top:calc(100% + 8px);right:0;width:340px;max-height:420px;overflow-y:auto;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.15);z-index:100;">
              <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:13px;font-weight:700;color:var(--text-1);">Alertes</div>
                @if (unreadCount() > 0) {
                  <span style="font-size:11px;color:#60A5FA;">{{ unreadCount() }} non-lues</span>
                }
              </div>
              @if (alertsLoading()) {
                <div style="padding:30px;text-align:center;color:var(--text-3);font-size:12px;">Chargement...</div>
              } @else if (alerts().length === 0) {
                <div style="padding:30px;text-align:center;color:var(--text-3);font-size:12px;">Aucune alerte</div>
              } @else {
                @for (a of alerts(); track a.id; let last = $last) {
                  <div (click)="openAlert(a)"
                    [style.background]="a.isRead ? 'transparent' : 'rgba(37,99,235,0.05)'"
                    [style.border-bottom]="!last ? '1px solid var(--border)' : 'none'"
                    style="padding:12px 16px;cursor:pointer;transition:background 0.12s;">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                      <div [style.background]="typeColor(a.type)" style="width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0;"></div>
                      <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
                          <div [style.font-weight]="a.isRead ? 500 : 700" style="font-size:12px;color:var(--text-1);">{{ a.title }}</div>
                          @if (!a.isRead) {
                            <span style="width:6px;height:6px;border-radius:50%;background:#2563EB;flex-shrink:0;margin-top:5px;"></span>
                          }
                        </div>
                        <div style="font-size:11px;color:var(--text-3);margin-top:3px;line-height:1.4;">{{ a.message }}</div>
                        <div style="font-size:10px;color:var(--text-3);margin-top:4px;opacity:0.7;">{{ relTime(a.createdAt) }}</div>
                      </div>
                    </div>
                  </div>
                }
              }
            </div>
          }
        </div>

        <div (click)="state.tweaksOpen.set(true)" style="width:30px;height:30px;border-radius:8px;background:var(--surface-3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--text-2);" title="Tweaks">⚙</div>
      </div>
    </header>
  `
})
export class TopbarComponent implements OnInit {
  state = inject(StateService);
  private router = inject(Router);
  private svc = inject(AuctionService);

  alerts = signal<AlertDto[]>([]);
  alertsLoading = signal(false);
  open = signal(false);

  unreadCount = computed(() => this.alerts().filter(a => !a.isRead).length);

  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.alertsLoading.set(true);
    this.svc.getAlerts().subscribe({
      next: list => { this.alerts.set(list); this.alertsLoading.set(false); },
      error: () => { this.alertsLoading.set(false); }
    });
  }

  toggleAlerts() {
    const next = !this.open();
    this.open.set(next);
    if (next && this.alerts().length === 0) this.loadAlerts();
  }

  openAlert(a: AlertDto) {
    if (!a.isRead) {
      this.svc.markAlertRead(a.id).subscribe({
        next: () => {
          this.alerts.update(list => list.map(x => x.id === a.id ? { ...x, isRead: true } : x));
        }
      });
    }
    if (a.auctionId) {
      this.open.set(false);
      this.router.navigate(['/auctions', a.auctionId]);
    }
  }

  typeColor(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('opportunity') || t.includes('bonne')) return '#10B981';
    if (t.includes('risk') || t.includes('risque')) return '#EF4444';
    if (t.includes('new') || t.includes('nouveau')) return '#2563EB';
    return '#8B5CF6';
  }

  relTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return `il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `il y a ${h} h`;
    const d = Math.floor(h / 24);
    return `il y a ${d} j`;
  }

  screenLabel() {
    const segment = this.url().split('/')[1] ?? '';
    return LABELS[segment] ?? (segment.charAt(0).toUpperCase() + segment.slice(1));
  }
}
