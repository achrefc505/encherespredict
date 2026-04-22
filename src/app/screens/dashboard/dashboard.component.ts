import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { DashboardStats, AuctionListItem } from '../../models/api.models';
import { BadgeComponent } from '../../components/badge/badge.component';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { formatEur } from '../../utils/format';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BadgeComponent, KpiCardComponent],
  template: `
    <div style="padding:28px 32px;flex:1;overflow-y:auto;">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
        <div>
          <h1 style="font-size:22px;font-weight:800;color:var(--text-1);margin:0;letter-spacing:-0.3px;">Dashboard</h1>
          <div style="font-size:13px;color:var(--text-3);margin-top:5px;">
            @if (loading()) {
              <span>Chargement des données...</span>
            } @else {
              {{ stats()?.totalAuctions ?? 0 }} enchères analysées —
              <span style="color:#10B981;">données live depuis l'API</span>
            }
          </div>
        </div>
        <button (click)="router.navigate(['/auctions'])"
          style="background:#2563EB;color:#fff;border:none;padding:9px 18px;font-size:12px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">
          Voir toutes les enchères →
        </button>
      </div>

      @if (error()) {
        <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px 20px;margin-bottom:20px;color:#F87171;font-size:13px;">
          ⚠ Impossible de contacter l'API : {{ error() }}<br>
          <span style="font-size:11px;opacity:0.8;">Vérifiez que le backend .NET tourne sur https://localhost:7001</span>
        </div>
      }

      <!-- KPI Cards -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
        <app-kpi-card label="Enchères actives"    [value]="stats()?.totalAuctions ?? 0"            unit=""     trend="+3 ce mois"  color="#2563EB"/>
        <app-kpi-card label="ROI moyen IA"        [value]="(stats()?.avgRoi ?? 0) + '%'"           unit=""     trend="vs marché"   color="#10B981"/>
        <app-kpi-card label="Confiance IA moy."   [value]="(stats()?.avgConfidence ?? 0) + '%'"    unit=""     trend="modèle v2.1" color="#8B5CF6"/>
        <app-kpi-card label="Opportunités"        [value]="stats()?.totalOpportunities ?? 0"       unit=""     trend="ROI > 15%"   color="#F59E0B"/>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">

        <!-- Chart mise à prix vs estimation IA -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="font-size:13px;font-weight:700;color:var(--text-1);margin-bottom:4px;">Mise à prix vs Estimation IA</div>
          <div style="font-size:11px;color:var(--text-3);margin-bottom:16px;">Top 10 opportunités par ROI</div>
          @if (loading()) {
            <div style="height:160px;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:12px;">Chargement...</div>
          } @else {
            <div style="display:flex;flex-direction:column;gap:8px;">
              @for (pt of stats()?.chartData ?? []; track pt.title) {
                <div style="display:flex;align-items:center;gap:8px;">
                  <div style="font-size:10px;color:var(--text-3);width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;">{{ pt.title }}</div>
                  <div style="flex:1;display:flex;flex-direction:column;gap:3px;">
                    <div style="display:flex;align-items:center;gap:4px;">
                      <div [style.width]="barWidth(pt.startPrice) + '%'" style="height:6px;background:#2563EB;border-radius:3px;min-width:4px;transition:width 0.4s;"></div>
                      <span style="font-size:9px;color:var(--text-3);">{{ fmt(pt.startPrice) }}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:4px;">
                      <div [style.width]="barWidth(pt.aiEstimate) + '%'" style="height:6px;background:#10B981;border-radius:3px;min-width:4px;transition:width 0.4s;"></div>
                      <span style="font-size:9px;color:#34D399;">{{ fmt(pt.aiEstimate) }}</span>
                    </div>
                  </div>
                  <div [style.color]="pt.roi >= 0 ? '#10B981' : '#EF4444'" style="font-size:10px;font-weight:700;width:36px;text-align:right;flex-shrink:0;">
                    {{ pt.roi > 0 ? '+' : '' }}{{ pt.roi }}%
                  </div>
                </div>
              }
            </div>
            <div style="display:flex;gap:12px;margin-top:12px;">
              <div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--text-3);">
                <div style="width:10px;height:6px;background:#2563EB;border-radius:2px;"></div> Mise à prix
              </div>
              <div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--text-3);">
                <div style="width:10px;height:6px;background:#10B981;border-radius:2px;"></div> Estimation IA
              </div>
            </div>
          }
        </div>

        <!-- Répartition badges -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="font-size:13px;font-weight:700;color:var(--text-1);margin-bottom:4px;">Répartition par profil IA</div>
          <div style="font-size:11px;color:var(--text-3);margin-bottom:18px;">Sur l'ensemble du portefeuille</div>
          @if (loading()) {
            <div style="height:120px;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:12px;">Chargement...</div>
          } @else {
            @for (b of badgeRows(); track b.label) {
              <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                  <span style="font-size:12px;color:var(--text-2);">{{ b.label }}</span>
                  <span style="font-size:12px;font-weight:700;color:var(--text-1);">{{ b.count }}</span>
                </div>
                <div style="height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden;">
                  <div [style.width]="badgePct(b.count) + '%'" [style.background]="b.color" style="height:100%;border-radius:3px;transition:width 0.5s;"></div>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- Top opportunités -->
      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--text-1);">Top opportunités</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:2px;">Meilleures affaires par ROI</div>
          </div>
          <button (click)="router.navigate(['/auctions'])"
            style="background:transparent;color:#60A5FA;border:1px solid rgba(37,99,235,0.28);padding:5px 12px;font-size:11px;border-radius:7px;cursor:pointer;font-family:inherit;">
            Voir tout
          </button>
        </div>
        @if (loading()) {
          <div style="padding:20px;text-align:center;color:var(--text-3);font-size:12px;">Chargement des opportunités...</div>
        } @else {
          <div style="display:flex;flex-direction:column;gap:0;">
            @for (a of topAuctions(); track a.id; let last = $last) {
              <div (click)="goDetail(a)"
                style="display:flex;align-items:center;gap:16px;padding:12px 0;cursor:pointer;"
                [style.border-bottom]="!last ? '1px solid var(--border)' : 'none'">
                <div style="flex:1;min-width:0;">
                  <div style="font-size:12px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ a.title }}</div>
                  <div style="font-size:10px;color:var(--text-3);margin-top:2px;">{{ a.city }} · {{ a.surface }}m² · {{ fmtDate(a.auctionDate) }}</div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                  <div style="font-size:12px;font-weight:800;color:var(--text-1);">{{ fmt(a.startPrice) }}</div>
                  <div style="font-size:10px;color:#34D399;">est. {{ fmt(a.aiEstimate) }}</div>
                </div>
                <div [style.color]="a.roi >= 0 ? '#10B981' : '#EF4444'" style="font-size:13px;font-weight:800;width:52px;text-align:right;flex-shrink:0;">
                  {{ a.roi > 0 ? '+' : '' }}{{ a.roi }}%
                </div>
                <app-badge [type]="a.badge"/>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  router = inject(Router);
  private svc = inject(AuctionService);

  stats = signal<DashboardStats | null>(null);
  topAuctions = signal<AuctionListItem[]>([]);
  loading = signal(true);
  error = signal('');

  fmt = formatEur;
  fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR');

  ngOnInit() {
    this.svc.getStats().subscribe({
      next: s => { this.stats.set(s); this.loading.set(false); },
      error: e => { this.error.set(e.message ?? 'Erreur réseau'); this.loading.set(false); }
    });
    this.svc.getAuctions({ sort: 'roi', pageSize: 5 }).subscribe({
      next: r => this.topAuctions.set(r.items)
    });
  }

  badgeRows() {
    const b = this.stats()?.byBadge;
    if (!b) return [];
    return [
      { label: 'Très bonne affaire', count: b.tresBonneAffaire, color: '#10B981' },
      { label: 'Bonne affaire',      count: b.bonneAffaire,     color: '#8B8FF9' },
      { label: 'Neutre',             count: b.neutre,           color: '#64748B' },
      { label: 'Risqué',             count: b.risque,           color: '#EF4444' },
    ];
  }

  badgePct(count: number) {
    const total = this.stats()?.totalAuctions ?? 1;
    return Math.round((count / total) * 100);
  }

  barWidth(price: number) {
    const max = Math.max(...(this.stats()?.chartData ?? []).map(p => p.aiEstimate), 1);
    return Math.round((price / max) * 100);
  }

  goDetail(a: AuctionListItem) {
    this.router.navigate(['/auctions', a.id]);
  }
}
