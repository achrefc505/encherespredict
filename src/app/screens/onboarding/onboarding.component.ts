import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { formatEur } from '../../data/mock.data';

interface OnboardingData {
  profile: string | null;
  regions: string[];
  budgetMin: number;
  budgetMax: number;
  types: string[];
}

const STEPS = [
  { id: 'profile', label: 'Profil',   title: 'Quel est votre profil ?',    sub: 'Personnalisez votre expérience' },
  { id: 'regions', label: 'Régions',  title: 'Vos zones d\'intérêt',       sub: 'Sélectionnez vos régions cibles' },
  { id: 'budget',  label: 'Budget',   title: 'Votre budget indicatif',      sub: 'Définissez votre fourchette' },
  { id: 'types',   label: 'Biens',    title: 'Types de biens recherchés',   sub: 'Sélectionnez ce qui vous intéresse' },
];

const PROFILES = [
  { id: 'investor',    label: 'Investisseur immobilier',  desc: 'Je cherche des biens à fort potentiel locatif ou de revente', icon: '◎' },
  { id: 'marchant',    label: 'Marchand de biens',        desc: "J'achète, rénove et revends des biens avec valorisation",     icon: '⊟' },
  { id: 'particulier', label: 'Particulier',              desc: 'Je recherche ma résidence principale à prix avantageux',       icon: '◉' },
];

const REGIONS = ['Île-de-France', 'PACA', 'Auvergne-Rhône-Alpes', 'Occitanie', 'Nouvelle-Aquitaine', 'Bretagne', 'Hauts-de-France', 'Grand Est', 'Pays de la Loire', 'Normandie'];
const TYPES   = ['Appartement', 'Maison', 'Studio', 'Immeuble de rapport', 'Local commercial', 'Terrain'];

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;background:var(--bg);overflow-y:auto;">
      <div style="width:100%;max-width:520px;">

        <!-- Logo -->
        <div style="text-align:center;margin-bottom:36px;">
          <div style="display:inline-flex;width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#2563EB,#8B5CF6);align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;margin-bottom:14px;box-shadow:0 6px 20px rgba(37,99,235,0.3);">EP</div>
          <div style="font-size:20px;font-weight:800;color:var(--text-1);letter-spacing:-0.3px;">Enchères<span style="color:#60A5FA;">Predict</span></div>
          <div style="font-size:13px;color:var(--text-3);margin-top:4px;">Configuration de votre compte</div>
        </div>

        <!-- Step indicator -->
        <div style="display:flex;align-items:center;margin-bottom:28px;">
          @for (s of steps; track s.id; let i = $index) {
            <div style="display:flex;align-items:center;gap:6px;">
              <div [style.background]="i < step() ? '#10B981' : i === step() ? '#2563EB' : 'var(--surface-3)'"
                   [style.color]="i <= step() ? '#fff' : 'var(--text-3)'"
                   [style.border]="i === step() ? '2px solid rgba(37,99,235,0.35)' : '2px solid transparent'"
                   [style.box-shadow]="i === step() ? '0 0 0 4px rgba(37,99,235,0.12)' : 'none'"
                   style="width:28px;height:28px;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:all 0.25s;flex-shrink:0;">
                {{ i < step() ? '✓' : i + 1 }}
              </div>
              @if (i === step()) {
                <span style="font-size:11px;color:var(--text-1);font-weight:600;">{{ s.label }}</span>
              }
            </div>
            @if (i < steps.length - 1) {
              <div [style.background]="i < step() ? '#10B981' : 'var(--border)'" style="flex:1;height:1px;transition:background 0.3s;margin:0 6px;"></div>
            }
          }
        </div>

        <!-- Card -->
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:16px;padding:32px;">
          <h2 style="font-size:19px;font-weight:800;color:var(--text-1);margin:0 0 5px;letter-spacing:-0.2px;">{{ steps[step()].title }}</h2>
          <p style="font-size:13px;color:var(--text-3);margin:0 0 26px;">{{ steps[step()].sub }}</p>

          <!-- Step 0: Profile -->
          @if (step() === 0) {
            <div style="display:flex;flex-direction:column;gap:10px;">
              @for (p of profiles; track p.id) {
                <div (click)="data.profile = p.id"
                  [style.background]="data.profile === p.id ? 'rgba(37,99,235,0.10)' : 'var(--surface-3)'"
                  [style.border]="'1.5px solid ' + (data.profile === p.id ? 'rgba(37,99,235,0.36)' : 'var(--border)')"
                  style="display:flex;gap:14px;align-items:center;padding:14px 16px;border-radius:10px;cursor:pointer;transition:all 0.14s;">
                  <span style="font-size:22px;">{{ p.icon }}</span>
                  <div style="flex:1;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-1);">{{ p.label }}</div>
                    <div style="font-size:11px;color:var(--text-3);margin-top:3px;line-height:1.4;">{{ p.desc }}</div>
                  </div>
                  @if (data.profile === p.id) {
                    <div style="color:#60A5FA;font-weight:700;font-size:16px;">✓</div>
                  }
                </div>
              }
            </div>
          }

          <!-- Step 1: Regions -->
          @if (step() === 1) {
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
              @for (r of regions; track r) {
                <div (click)="toggleArr('regions', r)" [style]="chipStyle(data.regions.includes(r))">{{ r }}</div>
              }
            </div>
          }

          <!-- Step 2: Budget -->
          @if (step() === 2) {
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <div>
                  <div style="font-size:10px;color:var(--text-3);margin-bottom:2px;">Minimum</div>
                  <div style="font-size:18px;font-weight:800;color:var(--text-1);">{{ fmt(data.budgetMin) }}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:10px;color:var(--text-3);margin-bottom:2px;">Maximum</div>
                  <div style="font-size:18px;font-weight:800;color:var(--text-1);">{{ fmt(data.budgetMax) }}</div>
                </div>
              </div>
              <div style="padding:8px 0 20px;">
                <label style="font-size:11px;color:var(--text-3);display:block;margin-bottom:6px;">Budget minimum</label>
                <input type="range" min="10000" max="500000" step="5000" [ngModel]="data.budgetMin" (ngModelChange)="data.budgetMin = min(+$event, data.budgetMax - 10000)" style="accent-color:#2563EB;margin-bottom:16px;"/>
                <label style="font-size:11px;color:var(--text-3);display:block;margin-bottom:6px;">Budget maximum</label>
                <input type="range" min="50000" max="2000000" step="10000" [ngModel]="data.budgetMax" (ngModelChange)="data.budgetMax = max(+$event, data.budgetMin + 10000)" style="accent-color:#10B981;"/>
              </div>
              <div style="background:var(--surface-3);border-radius:8px;padding:12px 16px;text-align:center;font-size:13px;color:var(--text-2);">
                Fourchette : <strong style="color:var(--text-1);">{{ fmt(data.budgetMin) }}</strong> — <strong style="color:var(--text-1);">{{ fmt(data.budgetMax) }}</strong>
              </div>
            </div>
          }

          <!-- Step 3: Types -->
          @if (step() === 3) {
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
              @for (t of types; track t) {
                <div (click)="toggleArr('types', t)" [style]="chipStyle(data.types.includes(t), '#10B981')">{{ t }}</div>
              }
            </div>
          }

          <!-- Navigation -->
          <div style="display:flex;justify-content:space-between;margin-top:28px;">
            <button (click)="prev()" class="btn-ghost">← {{ step() === 0 ? 'Retour' : 'Précédent' }}</button>
            <button (click)="next()" [disabled]="!canNext()" class="btn-primary" [style.opacity]="!canNext() ? 0.45 : 1">
              {{ step() < steps.length - 1 ? 'Suivant →' : '✓ Accéder au dashboard' }}
            </button>
          </div>
        </div>

        <div style="text-align:center;margin-top:14px;font-size:11px;color:var(--text-3);">
          Étape {{ step() + 1 }} sur {{ steps.length }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary { background:#2563EB;color:#fff;border:none;padding:8px 18px;font-size:13px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit; }
    .btn-primary:hover:not([disabled]) { background:#1D4ED8; }
    .btn-primary[disabled] { cursor:not-allowed; }
    .btn-ghost { background:transparent;color:var(--text-2);border:1px solid var(--border);padding:8px 18px;font-size:13px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit; }
  `]
})
export class OnboardingComponent {
  private router = inject(Router);

  steps = STEPS;
  profiles = PROFILES;
  regions = REGIONS;
  types = TYPES;
  fmt = formatEur;
  min = Math.min;
  max = Math.max;

  step = signal(0);
  data: OnboardingData = { profile: null, regions: [], budgetMin: 50000, budgetMax: 400000, types: [] };

  canNext(): boolean {
    switch (this.step()) {
      case 0: return !!this.data.profile;
      case 1: return this.data.regions.length > 0;
      case 2: return this.data.budgetMin < this.data.budgetMax;
      case 3: return this.data.types.length > 0;
      default: return false;
    }
  }

  next() {
    if (this.step() < this.steps.length - 1) this.step.update(s => s + 1);
    else this.router.navigate(['/dashboard']);
  }

  prev() {
    if (this.step() > 0) this.step.update(s => s - 1);
    else this.router.navigate(['/landing']);
  }

  toggleArr(key: 'regions' | 'types', val: string) {
    const arr = this.data[key] as string[];
    if (arr.includes(val)) {
      (this.data[key] as string[]) = arr.filter(x => x !== val);
    } else {
      (this.data[key] as string[]) = [...arr, val];
    }
  }

  chipStyle(selected: boolean, col = '#2563EB') {
    const isBlue = col === '#2563EB';
    return selected
      ? `padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:600;background:${isBlue ? 'rgba(59,130,246,0.13)' : 'rgba(16,185,129,0.13)'};color:${isBlue ? '#60A5FA' : '#34D399'};border:1px solid ${isBlue ? 'rgba(37,99,235,0.32)' : 'rgba(16,185,129,0.32)'};transition:all 0.12s;`
      : `padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:400;background:var(--surface-3);color:var(--text-2);border:1px solid var(--border);transition:all 0.12s;`;
  }
}
