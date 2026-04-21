import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div style="flex:1;overflow-y:auto;background:var(--bg);color:var(--text-1);">

      <!-- Nav bar -->
      <nav style="display:flex;justify-content:space-between;align-items:center;padding:18px 48px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--bg);backdrop-filter:blur(12px);z-index:10;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#2563EB,#8B5CF6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;">EP</div>
          <span style="font-size:14px;font-weight:700;">Enchères<span style="color:#60A5FA;">Predict</span></span>
        </div>
        <div style="display:flex;gap:28px;font-size:13px;color:var(--text-2);">
          <span class="nav-link">Fonctionnalités</span>
          <span class="nav-link">Tarifs</span>
          <span class="nav-link">À propos</span>
        </div>
        <div style="display:flex;gap:10px;">
          <button (click)="go('dashboard')" class="btn-ghost">Connexion</button>
          <button (click)="go('onboarding')" class="btn-primary">Commencer gratuitement</button>
        </div>
      </nav>

      <!-- Hero -->
      <div style="min-height:88vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 32px 60px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:800px;height:500px;background:radial-gradient(ellipse,rgba(37,99,235,0.10) 0%,transparent 70%);pointer-events:none;"></div>
        <div style="position:absolute;bottom:10%;right:10%;width:400px;height:300px;background:radial-gradient(ellipse,rgba(139,92,246,0.06) 0%,transparent 70%);pointer-events:none;"></div>

        <div style="display:inline-flex;gap:8px;align-items:center;padding:6px 16px;border-radius:20px;background:rgba(37,99,235,0.10);border:1px solid rgba(37,99,235,0.22);color:#60A5FA;font-size:12px;font-weight:600;margin-bottom:28px;letter-spacing:0.2px;">
          <span style="width:6px;height:6px;border-radius:50%;background:#34D399;box-shadow:0 0 6px #10B981;"></span>
          Propulsé par l'IA · Modèle entraîné sur 2M+ transactions
        </div>

        <h1 style="font-size:clamp(32px,5vw,60px);font-weight:800;color:var(--text-1);line-height:1.12;margin:0 0 22px;max-width:720px;letter-spacing:-1px;">
          Remportez les meilleures
          <span style="background:linear-gradient(90deg,#2563EB,#10B981 60%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;"> enchères immobilières</span>
        </h1>

        <p style="font-size:18px;color:var(--text-2);max-width:520px;line-height:1.72;margin:0 0 42px;">
          Prédictions de prix par IA, analyse de rentabilité instantanée et documents juridiques en un seul endroit.
        </p>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:64px;">
          <button (click)="go('onboarding')" class="btn-primary btn-lg">Commencer gratuitement →</button>
          <button (click)="go('dashboard')" class="btn-ghost btn-lg">Voir la démo</button>
        </div>

        <!-- Social proof -->
        <div style="display:flex;gap:48px;justify-content:center;flex-wrap:wrap;padding-top:32px;border-top:1px solid var(--border);">
          @for (stat of stats; track stat.label) {
            <div style="text-align:center;">
              <div style="font-size:28px;font-weight:800;color:var(--text-1);letter-spacing:-0.5px;">{{ stat.value }}</div>
              <div style="font-size:12px;color:var(--text-3);margin-top:4px;">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>

      <!-- Features -->
      <div style="padding:80px 48px;max-width:1100px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:56px;">
          <h2 style="font-size:36px;font-weight:800;color:var(--text-1);margin:0 0 14px;letter-spacing:-0.5px;">Tout pour investir intelligemment</h2>
          <p style="color:var(--text-2);font-size:16px;">De la détection de l'opportunité à l'acquisition, une plateforme tout-en-un.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px;">
          @for (f of features; track f.title) {
            <div class="feature-card" style="background:var(--surface-2);border:1px solid var(--border);border-radius:14px;padding:26px;transition:all 0.15s;">
              <div [style.background]="f.col + '18'" style="width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:18px;">{{ f.icon }}</div>
              <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:10px;">{{ f.title }}</div>
              <div style="font-size:13px;color:var(--text-3);line-height:1.65;">{{ f.desc }}</div>
            </div>
          }
        </div>
      </div>

      <!-- How it works -->
      <div style="padding:60px 48px;background:var(--surface-1);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
        <div style="max-width:900px;margin:0 auto;text-align:center;">
          <h2 style="font-size:32px;font-weight:800;color:var(--text-1);margin:0 0 48px;letter-spacing:-0.5px;">Comment ça fonctionne ?</h2>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
            @for (step of steps; track step.n) {
              <div>
                <div style="font-size:11px;font-weight:800;color:#2563EB;letter-spacing:1.5px;margin-bottom:14px;">{{ step.n }}</div>
                <div style="font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:8px;">{{ step.title }}</div>
                <div style="font-size:13px;color:var(--text-3);line-height:1.65;">{{ step.desc }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Pricing -->
      <div style="padding:80px 48px;">
        <div style="max-width:800px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:48px;">
            <h2 style="font-size:32px;font-weight:800;color:var(--text-1);margin:0 0 12px;letter-spacing:-0.5px;">Commencez gratuitement</h2>
            <p style="color:var(--text-2);font-size:15px;">Passez à Pro quand vous êtes prêt.</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
            <!-- Free -->
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:16px;padding:28px;">
              <div style="font-size:16px;font-weight:700;color:var(--text-1);margin-bottom:8px;">Gratuit</div>
              <div style="margin-bottom:22px;">
                <span style="font-size:38px;font-weight:800;color:var(--text-1);letter-spacing:-1px;">0€</span>
                <span style="font-size:13px;color:var(--text-3);">/mois</span>
              </div>
              @for (f of freeFeatures; track f) {
                <div style="display:flex;gap:8px;margin-bottom:10px;font-size:13px;color:var(--text-2);">
                  <span style="color:#10B981;flex-shrink:0;">✓</span>{{ f }}
                </div>
              }
              <button (click)="go('onboarding')" style="display:block;width:100%;margin-top:24px;padding:11px 0;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;background:transparent;color:var(--text-2);border:1px solid var(--border);">
                Créer un compte gratuit
              </button>
            </div>
            <!-- Pro -->
            <div style="background:linear-gradient(145deg,rgba(37,99,235,0.10),rgba(139,92,246,0.07));border:1px solid rgba(37,99,235,0.32);border-radius:16px;padding:28px;position:relative;">
              <div style="position:absolute;top:-11px;right:22px;background:#2563EB;color:#fff;font-size:10px;font-weight:700;padding:4px 12px;border-radius:10px;letter-spacing:0.6px;">RECOMMANDÉ</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-1);margin-bottom:8px;">Pro</div>
              <div style="margin-bottom:22px;">
                <span style="font-size:38px;font-weight:800;color:var(--text-1);letter-spacing:-1px;">29€</span>
                <span style="font-size:13px;color:var(--text-3);">/mois</span>
              </div>
              @for (f of proFeatures; track f) {
                <div style="display:flex;gap:8px;margin-bottom:10px;font-size:13px;color:var(--text-2);">
                  <span style="color:#10B981;flex-shrink:0;">✓</span>{{ f }}
                </div>
              }
              <button (click)="go('onboarding')" class="btn-primary" style="display:block;width:100%;margin-top:24px;padding:11px 0;border-radius:9px;">
                Essai gratuit 14 jours
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA footer -->
      <div style="padding:64px 48px;text-align:center;background:var(--surface-1);border-top:1px solid var(--border);">
        <h2 style="font-size:28px;font-weight:800;color:var(--text-1);margin:0 0 12px;letter-spacing:-0.3px;">Prêt à trouver la prochaine pépite ?</h2>
        <p style="color:var(--text-2);margin-bottom:28px;font-size:15px;">Rejoignez 3 400 investisseurs qui utilisent EnchèresPredict.</p>
        <button (click)="go('onboarding')" class="btn-primary btn-lg">Commencer maintenant — c'est gratuit</button>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      background: #2563EB; color: #fff; border: none;
      padding: 8px 18px; font-size: 13px; border-radius: 8px;
      font-weight: 600; cursor: pointer; font-family: inherit;
      transition: background 0.15s;
    }
    .btn-primary:hover { background: #1D4ED8; }
    .btn-ghost {
      background: transparent; color: var(--text-2);
      border: 1px solid var(--border); padding: 8px 18px;
      font-size: 13px; border-radius: 8px; font-weight: 600;
      cursor: pointer; font-family: inherit;
    }
    .btn-ghost:hover { background: rgba(37,99,235,0.05); }
    .btn-lg { padding: 12px 28px; font-size: 15px; }
    .nav-link { cursor: pointer; transition: color 0.12s; }
    .nav-link:hover { color: var(--text-1); }
    .feature-card:hover {
      border-color: var(--border-bright) !important;
      transform: translateY(-2px);
    }
  `]
})
export class LandingComponent {
  private router = inject(Router);

  go(path: string) { this.router.navigate([path]); }

  stats = [
    { value: '2 400+', label: 'Enchères analysées' },
    { value: '94%', label: 'Précision IA moyenne' },
    { value: '18%', label: 'ROI moyen constaté' },
    { value: '3 min', label: 'Pour une analyse complète' },
  ];

  features = [
    { icon: '⚡', title: 'Prédiction IA instantanée', desc: 'Estimation de valeur avec score de confiance, fourchette de prix et analyse des comparables du secteur.', col: '#2563EB' },
    { icon: '◎',  title: 'Analyse de rentabilité',    desc: 'ROI, cashflow, frais notariaux et coûts de rénovation calculés automatiquement en temps réel.', col: '#10B981' },
    { icon: '📄', title: 'Documents intelligents',    desc: "Upload et analyse automatique des cahiers des conditions de vente. Extraction des infos clés par IA.", col: '#F59E0B' },
    { icon: '🔔', title: 'Alertes personnalisées',    desc: "Soyez notifié dès qu'une bonne affaire correspond à vos critères d'investissement.", col: '#8B5CF6' },
  ];

  steps = [
    { n: '01', title: 'Parcourez les enchères', desc: 'Accédez à toutes les ventes judiciaires en France, filtrées et enrichies en temps réel.' },
    { n: '02', title: "L'IA analyse le bien", desc: "Notre modèle ML évalue le prix de marché, détecte les bonnes affaires et calcule le potentiel de rentabilité." },
    { n: '03', title: 'Investissez en confiance', desc: "Téléchargez les documents, comparez avec le marché et passez à l'action avec toutes les cartes en main." },
  ];

  freeFeatures = ['5 biens consultables / mois', 'Téléchargement des documents', 'Accès limité aux prédictions IA'];
  proFeatures = ['Enchères illimitées', 'Prédictions IA complètes', 'Analyses de rentabilité', 'Alertes en temps réel', 'Export PDF & rapports'];
}
