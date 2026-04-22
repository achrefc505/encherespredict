import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { formatEur } from '../../utils/format';
import { AuctionListItem } from '../../models/api.models';
import { AuctionService } from '../../services/auction.service';
import { BadgeComponent } from '../../components/badge/badge.component';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [FormsModule, BadgeComponent],
  template: `
    <div style="padding:28px 32px;flex:1;overflow-y:auto;">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;">
        <div>
          <h1 style="font-size:22px;font-weight:800;color:var(--text-1);margin:0;letter-spacing:-0.3px;">Enchères en cours</h1>
          <div style="font-size:13px;color:var(--text-3);margin-top:5px;">
            @if (loading()) {
              <span>Chargement des enchères...</span>
            } @else {
              {{ filtered().length }} biens —
              <span style="color:#10B981;">données live depuis l'API</span>
            }
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          @for (v of ['table','cards']; track v) {
            <button (click)="view.set(v)"
              [style.background]="view() === v ? 'rgba(37,99,235,0.14)' : 'transparent'"
              [style.color]="view() === v ? '#60A5FA' : 'var(--text-2)'"
              [style.border]="'1px solid ' + (view() === v ? 'rgba(37,99,235,0.3)' : 'var(--border)')"
              style="padding:7px 14px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.12s;">
              {{ v === 'table' ? '⊟ Tableau' : '▦ Cartes' }}
            </button>
          }
        </div>
      </div>

      @if (error()) {
        <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px 20px;margin-bottom:20px;color:#F87171;font-size:13px;">
          ⚠ Impossible de contacter l'API : {{ error() }}
        </div>
      }

      <!-- Filters -->
      <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;align-items:center;">
        <select [ngModel]="city()" (ngModelChange)="city.set($event)" class="sel">
          <option value="">Toutes les villes</option>
          @for (c of cities(); track c) { <option [value]="c">{{ c }}</option> }
        </select>
        <select [ngModel]="type()" (ngModelChange)="type.set($event)" class="sel">
          <option value="">Tous les types</option>
          @for (t of types(); track t) { <option [value]="t">{{ t }}</option> }
        </select>
        <select [ngModel]="badge()" (ngModelChange)="badge.set($event)" class="sel">
          <option value="">Tous profils IA</option>
          <option value="tres_bonne_affaire">Très bonne affaire</option>
          <option value="bonne_affaire">Bonne affaire</option>
          <option value="neutre">Neutre</option>
          <option value="risque">Risqué</option>
        </select>
        <select [ngModel]="sort()" (ngModelChange)="sort.set($event)" class="sel">
          <option value="roi">Trier par ROI</option>
          <option value="price">Trier par prix</option>
          <option value="date">Trier par date</option>
          <option value="conf">Trier par confiance IA</option>
        </select>
        @if (hasFilters()) {
          <button (click)="resetFilters()" style="background:rgba(239,68,68,0.06);color:#F87171;border:1px solid rgba(239,68,68,0.28);padding:7px 12px;border-radius:7px;font-size:12px;cursor:pointer;font-family:inherit;">
            ✕ Réinitialiser
          </button>
        }
      </div>

      <!-- Table view -->
      @if (view() === 'table') {
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead>
              <tr style="border-bottom:1px solid var(--border);">
                @for (h of headers; track h) {
                  <th style="padding:11px 16px;text-align:left;color:var(--text-3);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:0.7px;white-space:nowrap;">{{ h }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr><td colspan="10" style="padding:40px;text-align:center;color:var(--text-3);font-size:13px;">Chargement...</td></tr>
              } @else {
                @for (a of filtered(); track a.id; let last = $last) {
                  <tr (click)="goDetail(a)"
                    style="cursor:pointer;transition:background 0.1s;"
                    [style.border-bottom]="!last ? '1px solid var(--border)' : 'none'"
                    (mouseenter)="setRowBg($event, true)" (mouseleave)="setRowBg($event, false)">
                    <td style="padding:13px 16px;">
                      <div style="font-weight:600;color:var(--text-1);">{{ a.title.split('—')[0].trim() }}</div>
                      <div style="color:var(--text-3);margin-top:2px;font-size:10px;">{{ a.tribunal }}</div>
                    </td>
                    <td style="padding:13px 16px;color:var(--text-2);">{{ a.city }}</td>
                    <td style="padding:13px 16px;color:var(--text-2);">{{ a.surface }} m²</td>
                    <td style="padding:13px 16px;"><span style="font-weight:700;color:var(--text-1);">{{ fmt(a.startPrice) }}</span></td>
                    <td style="padding:13px 16px;">
                      <div style="font-weight:700;color:#34D399;">{{ fmt(a.aiEstimate) }}</div>
                      <div [style.color]="pct(a) > 0 ? '#10B981' : '#F87171'" style="font-size:10px;margin-top:1px;font-weight:600;">{{ pct(a) > 0 ? '+' : '' }}{{ pct(a) }}%</div>
                    </td>
                    <td style="padding:13px 16px;">
                      <div style="height:4px;background:var(--surface-3);border-radius:2px;width:60px;overflow:hidden;">
                        <div [style.width.%]="a.confidence" [style.background]="confColor(a.confidence)" style="height:100%;border-radius:2px;"></div>
                      </div>
                      <div [style.color]="confColor(a.confidence)" style="font-size:10px;margin-top:3px;font-weight:600;">{{ a.confidence }}%</div>
                    </td>
                    <td style="padding:13px 16px;">
                      <span [style.color]="a.roi >= 0 ? '#10B981' : '#EF4444'" style="font-weight:700;">{{ a.roi > 0 ? '+' : '' }}{{ a.roi }}%</span>
                    </td>
                    <td style="padding:13px 16px;"><app-badge [type]="a.badge"/></td>
                    <td style="padding:13px 16px;color:var(--text-3);white-space:nowrap;">{{ fmtDate(a.auctionDate) }}</td>
                    <td style="padding:13px 16px;">
                      <button style="background:rgba(37,99,235,0.08);color:#60A5FA;border:1px solid rgba(37,99,235,0.28);padding:5px 12px;font-size:12px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Voir →</button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Cards view -->
      @if (view() === 'cards') {
        @if (loading()) {
          <div style="padding:60px;text-align:center;color:var(--text-3);font-size:13px;">Chargement...</div>
        } @else {
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:16px;">
            @for (a of filtered(); track a.id) {
              <div (click)="goDetail(a)" class="auction-card" style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.15s ease;">
                <!-- Photo placeholder -->
                <div style="height:136px;background:linear-gradient(135deg,var(--surface-3) 0%,var(--border) 100%);position:relative;display:flex;align-items:center;justify-content:center;">
                  <div style="text-align:center;color:var(--text-3);">
                    <div style="font-size:32px;margin-bottom:4px;opacity:0.5;">🏠</div>
                    <div style="font-size:9px;font-family:monospace;opacity:0.5;">photo du bien</div>
                  </div>
                  <div style="position:absolute;top:10px;left:10px;"><app-badge [type]="a.status"/></div>
                  <div style="position:absolute;top:10px;right:10px;"><app-badge [type]="a.badge"/></div>
                  <div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;color:#fff;">
                    {{ a.surface }} m² · {{ a.rooms }} p.
                  </div>
                </div>
                <div style="padding:16px;">
                  <div style="font-weight:700;color:var(--text-1);font-size:13px;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ a.title }}</div>
                  <div style="font-size:11px;color:var(--text-3);margin-bottom:14px;">{{ a.tribunal }} · {{ fmtDate(a.auctionDate) }}</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                    <div>
                      <div style="font-size:10px;color:var(--text-3);margin-bottom:3px;">Mise à prix</div>
                      <div style="font-weight:800;color:var(--text-1);font-size:15px;">{{ fmt(a.startPrice) }}</div>
                    </div>
                    <div>
                      <div style="font-size:10px;color:var(--text-3);margin-bottom:3px;">Estimation IA</div>
                      <div style="font-weight:800;color:#34D399;font-size:15px;">{{ fmt(a.aiEstimate) }}</div>
                    </div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border);">
                    <span [style.color]="a.roi >= 0 ? '#10B981' : '#EF4444'" style="font-size:12px;font-weight:700;">ROI {{ a.roi > 0 ? '+' : '' }}{{ a.roi }}%</span>
                    <span [style.color]="pct(a) > 0 ? '#60A5FA' : '#F87171'" style="font-size:11px;font-weight:600;">
                      {{ pct(a) > 0 ? '↑' : '↓' }} {{ absVal(pct(a)) }}% vs marché
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .sel {
      background: var(--surface-3);
      border: 1px solid var(--border);
      color: var(--text-1);
      padding: 7px 12px;
      border-radius: 7px;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      outline: none;
    }
    .auction-card:hover {
      border-color: var(--border-bright) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
  `]
})
export class AuctionListComponent implements OnInit {
  private router = inject(Router);
  private svc = inject(AuctionService);

  view    = signal('table');
  city    = signal('');
  type    = signal('');
  badge   = signal('');
  sort    = signal('roi');
  loading = signal(true);
  error   = signal('');

  auctions = signal<AuctionListItem[]>([]);

  headers = ['Bien', 'Ville', 'Surface', 'Mise à prix', 'Estimation IA', 'Confiance', 'ROI', 'Analyse IA', 'Date', ''];
  fmt = formatEur;

  cities = computed(() => [...new Set(this.auctions().map(a => a.city))].sort());
  types  = computed(() => [...new Set(this.auctions().map(a => a.type))].sort());

  ngOnInit() {
    this.svc.getAuctions({ pageSize: 200 }).subscribe({
      next: r => { this.auctions.set(r.items); this.loading.set(false); },
      error: e => { this.error.set(e.message ?? 'Erreur réseau'); this.loading.set(false); }
    });
  }

  filtered = computed(() => {
    const c = this.city(), t = this.type(), b = this.badge(), s = this.sort();
    let list = this.auctions().filter(a =>
      (!c || a.city === c) &&
      (!t || a.type === t) &&
      (!b || a.badge === b)
    );
    if (s === 'roi')   list = [...list].sort((a, b) => b.roi - a.roi);
    if (s === 'price') list = [...list].sort((a, b) => a.startPrice - b.startPrice);
    if (s === 'date')  list = [...list].sort((a, b) => new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime());
    if (s === 'conf')  list = [...list].sort((a, b) => b.confidence - a.confidence);
    return list;
  });

  hasFilters = computed(() => !!(this.city() || this.type() || this.badge()));

  pct(a: AuctionListItem) { return a.startPrice ? Math.round(((a.aiEstimate - a.startPrice) / a.startPrice) * 100) : 0; }
  absVal(n: number) { return Math.abs(n); }
  confColor(v: number) { return v >= 80 ? '#10B981' : v >= 65 ? '#2563EB' : '#F59E0B'; }
  fmtDate(d: string) { return new Date(d).toLocaleDateString('fr-FR'); }

  resetFilters() { this.city.set(''); this.type.set(''); this.badge.set(''); }

  goDetail(a: AuctionListItem) {
    this.router.navigate(['/auctions', a.id]);
  }

  setRowBg(e: Event, hover: boolean) {
    const el = e.currentTarget as HTMLElement;
    if (el) el.style.background = hover ? 'rgba(0,0,0,0.018)' : 'transparent';
  }
}
