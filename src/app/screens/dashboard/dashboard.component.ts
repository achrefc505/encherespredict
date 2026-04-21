import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_AUCTIONS, formatEur } from '../../data/mock.data';
import { Auction } from '../../models/auction.model';
import { BadgeComponent } from '../../components/badge/badge.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { SparkLineComponent } from '../../components/spark-line/spark-line.component';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BadgeComponent, KpiCardComponent, SparkLineComponent],
  template: `
    <div style="padding:28px 32px;flex:1;overflow-y:auto;">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;">
        <div>
          <h1 style="font-size:22px;font-weight:800;color:var(--text-1);margin:0;letter-spacing:-0.3px;">Bonjour, Jean 👋</h1>
          <div style="font-size:13px;color:var(--text-3);margin-top:5px;">
            Lundi 21 avril 2026 —
            <span style="color:#10B981;font-weight:600;">5 nouvelles opportunités détectées</span>
          </div>
        </div>
        <button (click)="go('auctions')" class="btn-primary">Voir les enchères →</button>
      </div>

      <!-- KPIs -->
      <div style="display:flex;gap:14px;margin-bottom:22px;flex-wrap:wrap;">
        <app-kpi-card label="Biens suivis"     value="12"   sub="enchères actives"   [delta]="8"   icon="⊟" color="#2563EB"/>
        <app-kpi-card label="ROI moyen estimé" value="+18%" sub="sélection actuelle" [delta]="3"   icon="◎" color="#10B981"/>
        <app-kpi-card label="Bonnes affaires"  value="4"    sub="ce mois"            [delta]="-1"  icon="★" color="#60A5FA"/>
        <app-kpi-card label="Taux de réussite" value="67%"  sub="3 sur 5 acquis"    [delta]="12"  icon="◉" color="#A78BFA" [locked]="true"/>
      </div>

      <!-- Row 2: Chart + Opportunities -->
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:18px;margin-bottom:18px;">
        <!-- Bar chart -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div>
              <div style="font-size:15px;font-weight:700;color:var(--text-1);">Mise à prix vs Estimation IA</div>
              <div style="font-size:12px;color:var(--text-3);margin-top:3px;">5 biens en portefeuille</div>
            </div>
            <div style="display:flex;gap:12px;font-size:10px;color:var(--text-3);align-items:center;">
              <span><span style="color:#60A5FA;">■</span> Mise à prix</span>
              <span><span style="color:#34D399;">■</span> Estimation IA</span>
            </div>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-end;height:138px;padding:0 4px;">
            @for (a of auctions; track a.id) {
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                <div style="display:flex;gap:3px;align-items:flex-end;width:100%;">
                  <div [style.height.px]="barH(a.startPrice)" style="flex:1;background:rgba(37,99,235,0.45);border-radius:3px 3px 0 0;transition:height 0.4s ease;min-height:4px;"></div>
                  <div [style.height.px]="barH(a.aiEstimate)" style="flex:1;background:rgba(16,185,129,0.55);border-radius:3px 3px 0 0;transition:height 0.4s ease;min-height:4px;"></div>
                </div>
                <div style="font-size:9px;color:var(--text-3);margin-top:6px;text-align:center;white-space:nowrap;">{{ a.city }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Opportunities -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div style="font-size:15px;font-weight:700;color:var(--text-1);">🔥 Meilleures opportunités</div>
            <button (click)="go('auctions')" class="btn-secondary">Tout voir</button>
          </div>
          @for (a of opportunities.slice(0,3); track a.id; let i = $index) {
            <div (click)="goDetail(a)"
              style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;cursor:pointer;transition:background 0.1s;"
              [style.border-bottom]="i < opportunities.length - 1 ? '1px solid var(--border)' : 'none'"
              (mouseenter)="$event.target && setRowBg($event, true)" (mouseleave)="$event.target && setRowBg($event, false)">
              <div style="flex:1;min-width:0;">
                <div style="font-size:12px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ a.title }}</div>
                <div style="font-size:11px;color:var(--text-3);margin-top:2px;">{{ fmt(a.startPrice) }} mise à prix · {{ a.surface }} m²</div>
              </div>
              <div style="text-align:right;margin-left:12px;flex-shrink:0;">
                <app-badge [type]="a.badge"/>
                <div style="font-size:11px;color:#10B981;margin-top:4px;font-weight:700;">+{{ a.roi }}% ROI</div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Row 3: Market trend + Alerts -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
        <!-- Market trend -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:3px;">Tendance marché</div>
          <div style="font-size:12px;color:var(--text-3);margin-bottom:20px;">Évolution sur 6 mois</div>
          <div style="display:flex;gap:20px;">
            @for (a of auctions.slice(0,3); track a.id) {
              <div style="flex:1;text-align:center;">
                <app-spark-line [data]="a.priceHistory" [width]="70" [height]="32"/>
                <div style="font-size:10px;color:var(--text-3);margin-top:4px;">{{ a.city }}</div>
                <div style="font-size:11px;font-weight:700;color:var(--text-1);">{{ a.marketPricePerM2.toLocaleString('fr-FR') }} €/m²</div>
              </div>
            }
          </div>
        </div>

        <!-- Alerts -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:20px;">Alertes récentes</div>
          @for (alert of alerts; track alert.msg; let last = $last) {
            <div style="display:flex;gap:12px;align-items:flex-start;"
              [style.padding]="'11px 0'"
              [style.border-bottom]="!last ? '1px solid var(--border)' : 'none'">
              <div [style.background]="alertColor(alert.type)"
                style="width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0;"
                [style.box-shadow]="'0 0 6px ' + alertColor(alert.type) + '66'"></div>
              <div style="flex:1;font-size:12px;color:var(--text-2);line-height:1.55;">{{ alert.msg }}</div>
              <div style="font-size:11px;color:var(--text-3);white-space:nowrap;flex-shrink:0;">{{ alert.time }}</div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary { background:#2563EB;color:#fff;border:none;padding:8px 18px;font-size:13px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit; }
    .btn-primary:hover { background:#1D4ED8; }
    .btn-secondary { background:rgba(37,99,235,0.08);color:#60A5FA;border:1px solid rgba(37,99,235,0.28);padding:5px 12px;font-size:12px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit; }
    .btn-secondary:hover { background:rgba(37,99,235,0.14); }
  `]
})
export class DashboardComponent {
  private router = inject(Router);
  private state = inject(StateService);

  auctions = MOCK_AUCTIONS;
  fmt = formatEur;

  get opportunities() {
    return this.auctions.filter(a => ['tres_bonne_affaire', 'bonne_affaire'].includes(a.badge));
  }

  private maxVal = Math.max(...this.auctions.map(a => Math.max(a.startPrice, a.aiEstimate)));
  barH(val: number) { return Math.max(4, (val / this.maxVal) * 110); }

  alerts = [
    { type: 'success', msg: 'Vous avez remporté l\'enchère T2 Nantes — félicitations !', time: 'hier' },
    { type: 'warn',    msg: 'L\'enchère Studio Paris 18ème commence dans 7 jours', time: 'il y a 5h' },
    { type: 'info',    msg: 'Nouvelle enchère disponible à Lyon, dans votre zone', time: 'il y a 2h' },
  ];

  alertColor(type: string) {
    return { info: '#2563EB', warn: '#F59E0B', success: '#10B981' }[type] || '#64748B';
  }

  go(path: string) { this.router.navigate([path]); }

  goDetail(a: Auction) {
    this.state.setAuction(a);
    this.router.navigate(['/auctions', a.id]);
  }

  setRowBg(e: Event, hover: boolean) {
    const el = (e.currentTarget as HTMLElement);
    if (el) el.style.background = hover ? 'rgba(0,0,0,0.015)' : 'transparent';
  }
}
