import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { formatEur } from '../../data/mock.data';
import { AuctionDetail } from '../../models/api.models';
import { AuctionService } from '../../services/auction.service';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ProBadgeComponent } from '../../components/pro-badge/pro-badge.component';
import { ConfidenceRingComponent } from '../../components/confidence-ring/confidence-ring.component';

interface DisplayDetail extends AuctionDetail {
  floor: string;
  marketPricePerM2: number;
  comparables: number;
  aiLow: number;
  aiHigh: number;
  priceHistory: number[];
}

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ProBadgeComponent, ConfidenceRingComponent],
  template: `
    @if (loading()) {
      <div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:14px;">Chargement du bien...</div>
    } @else if (error()) {
      <div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:#F87171;">
        <div style="font-size:48px;opacity:0.5;">⚠</div>
        <div style="font-size:14px;">{{ error() }}</div>
        <button (click)="go('auctions')" class="btn-primary">Retour aux enchères</button>
      </div>
    } @else if (auction()) {
    <div style="padding:28px 32px;flex:1;overflow-y:auto;">
      <!-- Back -->
      <button (click)="go('auctions')" style="background:none;border:none;color:var(--text-3);cursor:pointer;font-size:12px;margin-bottom:16px;padding:0;font-family:inherit;display:flex;align-items:center;gap:6px;">
        ← Retour aux enchères
      </button>

      <!-- Hero header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;">
        <div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <app-badge [type]="auction()!.badge"/>
            <app-badge [type]="auction()!.status"/>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:var(--text-1);margin:0 0 8px;letter-spacing:-0.3px;">{{ auction()!.title }}</h1>
          <div style="font-size:13px;color:var(--text-3);">📍 {{ auction()!.address }} &nbsp;·&nbsp; ⚖ {{ auction()!.tribunal }}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;margin-left:24px;">
          <div style="font-size:11px;color:var(--text-3);margin-bottom:4px;">Mise à prix</div>
          <div style="font-size:28px;font-weight:800;color:var(--text-1);letter-spacing:-0.5px;">{{ fmt(auction()!.startPrice) }}</div>
          <div style="font-size:13px;color:#34D399;margin-top:4px;font-weight:600;">Estimation IA : {{ fmt(auction()!.aiEstimate) }}</div>
          <div style="font-size:11px;color:#10B981;margin-top:2px;">↑ {{ upside() }}% en dessous du marché</div>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:22px;">
        @for (t of tabs; track t.id) {
          <button (click)="tab.set(t.id)"
            [style.color]="tab() === t.id ? '#60A5FA' : 'var(--text-2)'"
            [style.font-weight]="tab() === t.id ? 600 : 400"
            [style.border-bottom]="'2px solid ' + (tab() === t.id ? '#2563EB' : 'transparent')"
            style="padding:10px 18px;font-family:inherit;font-size:13px;background:none;border-top:none;border-left:none;border-right:none;cursor:pointer;margin-bottom:-1px;transition:all 0.12s;display:flex;align-items:center;gap:6px;">
            {{ t.label }}
            @if (t.pro) { <app-pro-badge/> }
          </button>
        }
      </div>

      <!-- Tab: Informations -->
      @if (tab() === 'info') {
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
          <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
            <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:20px;">Caractéristiques du bien</div>
            @for (row of infoRows(); track row.k) {
              <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);">
                <span style="font-size:12px;color:var(--text-3);">{{ row.k }}</span>
                <span style="font-size:12px;color:var(--text-1);font-weight:600;">{{ row.v }}</span>
              </div>
            }
          </div>
          <div style="display:flex;flex-direction:column;gap:18px;">
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;flex:1;">
              <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:16px;">Localisation</div>
              <div style="height:160px;background:var(--surface-3);border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px dashed var(--border);flex-direction:column;gap:6px;">
                <div style="font-size:28px;opacity:0.4;">📍</div>
                <div style="font-size:10px;font-family:monospace;color:var(--text-3);text-align:center;line-height:1.5;">carte interactive<br/>{{ auction()!.city }}</div>
              </div>
            </div>
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:16px;">
              <div style="font-size:12px;font-weight:600;color:var(--text-1);margin-bottom:8px;">Prix marché au m²</div>
              <div style="font-size:24px;font-weight:800;color:var(--text-1);">{{ auction()!.marketPricePerM2.toLocaleString('fr-FR') }} <span style="font-size:14px;color:var(--text-3);font-weight:400;">€/m²</span></div>
              <div style="font-size:11px;color:var(--text-3);margin-top:4px;">Moyenne du secteur · {{ auction()!.city }}</div>
            </div>
          </div>
        </div>
      }

      <!-- Tab: Prédiction IA -->
      @if (tab() === 'prediction') {
        <div style="display:grid;grid-template-columns:1fr 200px;gap:18px;align-items:start;">
          <div style="display:flex;flex-direction:column;gap:18px;">
            <!-- Market chart -->
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <div>
                  <div style="font-size:15px;font-weight:700;color:var(--text-1);">Analyse IA du marché</div>
                  <div style="font-size:11px;color:var(--text-3);margin-top:3px;">Évolution des prix au m² · {{ auction()!.city }}</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:8px;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.22);">
                  <span style="font-size:10px;color:#A78BFA;font-weight:700;">✦ Modèle ML {{ auction()!.aiAnalysis?.modelVersion ?? 'v2.1' }}</span>
                </div>
              </div>
              <svg width="100%" [attr.viewBox]="'0 0 480 174'" style="overflow:visible;">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2563EB" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                @for (p of [0.25, 0.5, 0.75]; track p) {
                  <line [attr.x1]="0" [attr.y1]="gridY(p)" x2="480" [attr.y2]="gridY(p)" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
                }
                <path [attr.d]="areaPath()" fill="url(#areaGrad)"/>
                <path [attr.d]="mktPath()" fill="none" stroke="#2563EB" stroke-width="2" stroke-linejoin="round"/>
                @for (pt of mktPoints(); track $index) {
                  <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3.5" fill="#2563EB" stroke="var(--surface-2)" stroke-width="2"/>
                }
                <line x1="0" [attr.y1]="aiY()" x2="480" [attr.y2]="aiY()" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6,4"/>
                <text x="476" [attr.y]="aiY() - 6" font-size="9.5" fill="#10B981" text-anchor="end" font-weight="600">Estimation IA · {{ fmtNum(aiPPM()) }} €/m²</text>
                <line x1="0" [attr.y1]="startY()" x2="480" [attr.y2]="startY()" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.75"/>
                <text x="476" [attr.y]="startY() - 6" font-size="9.5" fill="#F59E0B" text-anchor="end" font-weight="600">Mise à prix · {{ fmtNum(startPPM()) }} €/m²</text>
                @for (m of months; track m; let i = $index) {
                  <text [attr.x]="(i / (months.length-1)) * 480" y="168" font-size="10" fill="var(--text-3)" text-anchor="middle">{{ m }}</text>
                }
              </svg>
              <div style="display:flex;gap:20px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">
                <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:var(--text-2);"><span style="width:12px;height:2px;background:#2563EB;display:inline-block;border-radius:1px;"></span>Prix marché (€/m²)</div>
                <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:var(--text-2);"><span style="width:12px;height:2px;background:#10B981;display:inline-block;border-radius:1px;border-top:2px dashed;"></span>Estimation IA</div>
                <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:var(--text-2);"><span style="width:12px;height:2px;background:#F59E0B;display:inline-block;border-radius:1px;"></span>Mise à prix</div>
              </div>
            </div>

            <!-- Price range bar -->
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
              <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:4px;">Fourchette de prix estimée</div>
              <div style="font-size:12px;color:var(--text-3);margin-bottom:16px;">Basée sur les données comparables</div>
              <div style="margin-bottom:18px;">
                <div style="height:10px;background:var(--surface-3);border-radius:5px;position:relative;overflow:visible;">
                  <div [style.left.%]="lowPct()" [style.right.%]="100-highPct()" style="position:absolute;height:100%;background:linear-gradient(90deg,rgba(16,185,129,0.3),rgba(16,185,129,0.65),rgba(16,185,129,0.3));border-radius:5px;"></div>
                  <div [style.left.%]="midPct()" style="position:absolute;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;background:#10B981;border-radius:50%;border:2px solid var(--surface-2);box-shadow:0 0 10px rgba(16,185,129,0.5);"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:12px;">
                  <div>
                    <div style="font-size:10px;color:var(--text-3);">Fourchette basse</div>
                    <div style="font-weight:700;color:var(--text-1);font-size:14px;margin-top:2px;">{{ fmt(auction()!.aiLow) }}</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-size:10px;color:#10B981;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Estimation centrale</div>
                    <div style="font-weight:800;color:#34D399;font-size:22px;margin-top:2px;letter-spacing:-0.5px;">{{ fmt(auction()!.aiEstimate) }}</div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:10px;color:var(--text-3);">Fourchette haute</div>
                    <div style="font-weight:700;color:var(--text-1);font-size:14px;margin-top:2px;">{{ fmt(auction()!.aiHigh) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Strengths / Risks -->
            @if (auction()!.aiAnalysis) {
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:18px;">
                  <div style="font-size:13px;font-weight:700;color:#10B981;margin-bottom:12px;">✓ Points forts</div>
                  @for (s of auction()!.aiAnalysis!.strengths; track s) {
                    <div style="font-size:12px;color:var(--text-2);padding:5px 0;line-height:1.5;">• {{ s }}</div>
                  }
                </div>
                <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:18px;">
                  <div style="font-size:13px;font-weight:700;color:#EF4444;margin-bottom:12px;">⚠ Facteurs de risque</div>
                  @for (r of auction()!.aiAnalysis!.riskFactors; track r) {
                    <div style="font-size:12px;color:var(--text-2);padding:5px 0;line-height:1.5;">• {{ r }}</div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Sidebar metrics -->
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:22px;text-align:center;">
              <div style="font-size:11px;color:var(--text-2);font-weight:600;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.6px;">Score de confiance</div>
              <div style="display:flex;justify-content:center;">
                <app-confidence-ring [value]="auction()!.confidence" [size]="96"/>
              </div>
              <div style="font-size:11px;color:var(--text-3);margin-top:14px;line-height:1.6;">
                Basé sur <strong style="color:var(--text-2);">{{ auction()!.comparables }}</strong> comparables dans un rayon de 2 km
              </div>
            </div>
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:16px;">
              <div style="font-size:11px;font-weight:700;color:var(--text-2);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">Économie potentielle</div>
              <div style="font-size:24px;font-weight:800;color:#34D399;letter-spacing:-0.5px;">+{{ fmt(auction()!.aiEstimate - auction()!.startPrice) }}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:4px;margin-bottom:12px;">vs. valeur de marché</div>
              <div style="background:rgba(16,185,129,0.09);border-radius:7px;padding:8px 12px;font-size:11px;color:#10B981;font-weight:600;">
                {{ upside() }}% sous l'estimation IA
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tab: Rentabilité -->
      @if (tab() === 'rentabilite') {
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
          <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
            <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:20px;">Paramètres de calcul</div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
              <span style="font-size:12px;color:var(--text-3);">Prix d'acquisition</span>
              <span style="font-size:13px;font-weight:700;color:var(--text-1);">{{ fmt(auction()!.startPrice) }}</span>
            </div>
            <div style="padding:10px 0;border-bottom:1px solid var(--border);">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:12px;color:var(--text-3);">Frais notaire + droits</span>
                <span style="font-size:13px;font-weight:700;color:var(--text-1);">{{ fees() }}%</span>
              </div>
              <input type="range" min="5" max="22" [ngModel]="fees()" (ngModelChange)="fees.set(+$event)" style="accent-color:#2563EB;"/>
            </div>
            <div style="padding:10px 0;border-bottom:1px solid var(--border);">
              <label style="display:block;font-size:12px;color:var(--text-3);margin-bottom:6px;">Budget rénovation</label>
              <input type="number" [ngModel]="renov()" (ngModelChange)="renov.set(+$event || 0)"
                style="width:100%;background:var(--surface-3);border:1px solid var(--border-bright);color:var(--text-1);padding:8px 10px;border-radius:7px;font-size:13px;font-family:inherit;box-sizing:border-box;outline:none;"/>
            </div>
            <div style="padding:10px 0;border-bottom:1px solid var(--border);">
              <label style="display:block;font-size:12px;color:var(--text-3);margin-bottom:6px;">Prix de revente visé</label>
              <input type="number" [ngModel]="salePrice()" (ngModelChange)="salePrice.set(+$event || 0)"
                style="width:100%;background:var(--surface-3);border:1px solid var(--border-bright);color:var(--text-1);padding:8px 10px;border-radius:7px;font-size:13px;font-family:inherit;box-sizing:border-box;outline:none;"/>
            </div>
            <div style="margin-top:16px;padding:12px;background:var(--surface-3);border-radius:8px;font-size:11px;color:var(--text-3);line-height:1.6;">
              Coût total d'acquisition : <strong style="color:var(--text-1);">{{ fmt(totalCost()) }}</strong>
            </div>
          </div>
          <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
            <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:20px;">Résultats de l'analyse</div>
            @for (r of results(); track r.label; let i = $index) {
              <div style="display:flex;justify-content:space-between;align-items:center;"
                [style.padding]="'13px 0'"
                [style.border-bottom]="i < 3 ? '1px solid var(--border)' : 'none'">
                <span style="font-size:12px;color:var(--text-2);">{{ r.label }}</span>
                <span [style.color]="r.col" [style.font-size]="r.large ? '26px' : '14px'" [style.font-weight]="r.large ? 800 : 600" [style.letter-spacing]="r.large ? '-0.5px' : '0'">{{ r.val }}</span>
              </div>
            }
            <div [style.background]="gain() >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'"
                 [style.border]="'1px solid ' + (gain() >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)')"
                 style="margin-top:18px;padding:14px;border-radius:8px;">
              <div [style.color]="gain() >= 0 ? '#34D399' : '#F87171'" style="font-size:12px;font-weight:700;margin-bottom:5px;">
                {{ gain() >= 0 ? '✓ Opération rentable' : '⚠ Opération à risque' }}
              </div>
              <div style="font-size:11px;color:var(--text-2);line-height:1.55;">
                {{ gain() >= 0 ? 'Bénéfice estimé de ' + fmt(gain()) + ' sur cette opération.' : 'Cette opération génère une perte estimée de ' + fmt(Math.abs(gain())) + '.' }}
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tab: Documents -->
      @if (tab() === 'documents') {
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div>
              <div style="font-size:15px;font-weight:700;color:var(--text-1);">Documents juridiques</div>
              <div style="font-size:12px;color:var(--text-3);margin-top:3px;">{{ auction()!.documents.length }} fichiers disponibles</div>
            </div>
          </div>
          @for (doc of auction()!.documents; track doc.id; let last = $last) {
            <div style="display:flex;justify-content:space-between;align-items:center;"
              [style.padding]="'13px 0'"
              [style.border-bottom]="!last ? '1px solid var(--border)' : 'none'">
              <div style="display:flex;gap:12px;align-items:center;">
                <div style="width:38px;height:38px;background:rgba(239,68,68,0.10);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">📄</div>
                <div>
                  <div style="font-size:13px;font-weight:600;color:var(--text-1);">{{ doc.name }}</div>
                  <div style="font-size:10px;color:var(--text-3);margin-top:2px;">{{ doc.type }} · {{ doc.size }}</div>
                </div>
              </div>
              <button [disabled]="!doc.available"
                [style.opacity]="doc.available ? 1 : 0.4"
                [style.cursor]="doc.available ? 'pointer' : 'not-allowed'"
                style="background:transparent;color:var(--text-2);border:1px solid var(--border);padding:5px 12px;font-size:12px;border-radius:8px;font-weight:600;font-family:inherit;">
                ⬇ Télécharger
              </button>
            </div>
          }
          <div style="margin-top:20px;padding:24px;background:var(--surface-3);border-radius:10px;border:1px dashed var(--border);text-align:center;">
            <div style="font-size:28px;margin-bottom:8px;opacity:0.5;">📤</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-1);margin-bottom:4px;">Analyser un nouveau document</div>
            <div style="font-size:11px;color:var(--text-3);margin-bottom:14px;">Upload PDF · Extraction intelligente des informations clés via IA</div>
            <button style="background:rgba(37,99,235,0.08);color:#60A5FA;border:1px solid rgba(37,99,235,0.28);padding:8px 18px;font-size:13px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Glisser-déposer ou parcourir</button>
          </div>
        </div>
      }
    </div>
    }
  `,
  styles: [`
    .btn-primary { background:#2563EB;color:#fff;border:none;padding:8px 18px;font-size:13px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit; }
    .btn-primary:hover { background:#1D4ED8; }
  `]
})
export class PropertyDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private svc = inject(AuctionService);

  auction = signal<DisplayDetail | null>(null);
  loading = signal(true);
  error = signal('');
  tab = signal('info');
  fees = signal(10);
  renov = signal(12000);
  salePrice = signal(0);
  months = ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'];
  fmt = formatEur;
  Math = Math;
  fmtNum(n: number) { return n.toLocaleString('fr-FR'); }

  tabs = [
    { id: 'info',        label: 'Informations' },
    { id: 'prediction',  label: 'Prédiction IA' },
    { id: 'rentabilite', label: 'Rentabilité', pro: true },
    { id: 'documents',   label: 'Documents' },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const defaultTab = this.route.snapshot.data['defaultTab'];
    if (defaultTab) this.tab.set(defaultTab);

    if (!id) {
      this.error.set('Identifiant manquant');
      this.loading.set(false);
      return;
    }

    this.svc.getAuction(id).subscribe({
      next: d => {
        const ppSqm = d.aiAnalysis?.pricePerSqm ?? (d.surface ? Math.round(d.aiEstimate / d.surface) : 0);
        const base = Math.round(ppSqm * 0.87);
        const priceHistory = Array.from({ length: 6 }, (_, i) =>
          Math.round(base + ((ppSqm - base) * i) / 5)
        );
        const display: DisplayDetail = {
          ...d,
          floor: 'N/A',
          marketPricePerM2: ppSqm,
          comparables: 15,
          aiLow: Math.round(d.aiEstimate * 0.88),
          aiHigh: Math.round(d.aiEstimate * 1.12),
          priceHistory,
        };
        this.auction.set(display);
        this.salePrice.set(Math.round(d.aiEstimate * 1.06));
        this.renov.set(d.aiAnalysis?.renovationCost ?? 12000);
        this.loading.set(false);
      },
      error: e => {
        this.error.set(e.message ?? 'Impossible de charger ce bien');
        this.loading.set(false);
      }
    });
  }

  go(path: string) { this.router.navigate([path]); }

  upside = computed(() => {
    const a = this.auction();
    if (!a) return 0;
    return a.aiEstimate ? Math.round(((a.aiEstimate - a.startPrice) / a.aiEstimate) * 100) : 0;
  });

  totalCost = computed(() => {
    const a = this.auction();
    if (!a) return 0;
    return Math.round(a.startPrice * (1 + this.fees() / 100)) + this.renov();
  });

  gain = computed(() => this.salePrice() - this.totalCost());

  roi = computed(() => ((this.gain() / this.totalCost()) * 100).toFixed(1));

  results = computed(() => {
    const g = this.gain(), r = this.roi();
    const col = g >= 0 ? '#34D399' : '#F87171';
    return [
      { label: 'Coût total',      val: this.fmt(this.totalCost()),                         col: 'var(--text-1)' },
      { label: 'Prix de revente', val: this.fmt(this.salePrice()),                         col: 'var(--text-1)' },
      { label: 'Gain net',        val: `${g >= 0 ? '+' : ''}${this.fmt(g)}`,              col },
      { label: 'ROI',             val: `${parseFloat(r) >= 0 ? '+' : ''}${r}%`,           col, large: true },
    ];
  });

  infoRows = computed(() => {
    const a = this.auction();
    if (!a) return [];
    return [
      { k: 'Surface',        v: `${a.surface} m²` },
      { k: 'Étage / Niveau', v: a.floor },
      { k: 'Pièces',         v: String(a.rooms) },
      { k: 'Type',           v: a.type },
      { k: 'Ville',          v: a.city },
      { k: 'Région',         v: a.region },
      { k: 'Tribunal',       v: a.tribunal },
      { k: 'Date audience',  v: a.auctionDate ? new Date(a.auctionDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
    ];
  });

  // Chart calculations
  private chartBounds = computed(() => {
    const a = this.auction();
    if (!a) return { mn: 0, mx: 1 };
    const aiPPM = a.surface ? Math.round(a.aiEstimate / a.surface) : 0;
    const startPPM = a.surface ? Math.round(a.startPrice / a.surface) : 0;
    const all = [...a.priceHistory, aiPPM, startPPM];
    return { mn: Math.min(...all) * 0.96, mx: Math.max(...all) * 1.04 };
  });

  aiPPM = computed(() => {
    const a = this.auction();
    return a && a.surface ? Math.round(a.aiEstimate / a.surface) : 0;
  });

  startPPM = computed(() => {
    const a = this.auction();
    return a && a.surface ? Math.round(a.startPrice / a.surface) : 0;
  });

  private toY(v: number) {
    const { mn, mx } = this.chartBounds();
    return 150 - ((v - mn) / (mx - mn)) * 150;
  }

  private toX(i: number) { return (i / (this.months.length - 1)) * 480; }

  mktPoints = computed(() => {
    const a = this.auction();
    if (!a) return [];
    return a.priceHistory.map((v, i) => ({ x: this.toX(i), y: this.toY(v) }));
  });

  mktPath = computed(() => {
    const pts = this.mktPoints();
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  });

  areaPath = computed(() => {
    return `${this.mktPath()} L480,150 L0,150 Z`;
  });

  aiY = computed(() => this.toY(this.aiPPM()));
  startY = computed(() => this.toY(this.startPPM()));

  gridY(p: number) {
    const { mn, mx } = this.chartBounds();
    return this.toY(mn + (mx - mn) * (1 - p));
  }

  private rangeSpan = computed(() => {
    const a = this.auction();
    return a ? a.aiHigh * 1.15 - a.startPrice : 1;
  });

  lowPct = computed(() => {
    const a = this.auction();
    return a ? ((a.aiLow - a.startPrice) / this.rangeSpan()) * 100 : 0;
  });

  highPct = computed(() => {
    const a = this.auction();
    return a ? ((a.aiHigh - a.startPrice) / this.rangeSpan()) * 100 : 0;
  });

  midPct = computed(() => {
    const a = this.auction();
    return a ? ((a.aiEstimate - a.startPrice) / this.rangeSpan()) * 100 : 0;
  });
}
