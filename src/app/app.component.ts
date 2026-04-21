import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from './screens/sidebar/sidebar.component';
import { TopbarComponent } from './screens/topbar/topbar.component';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div style="display:flex;width:100%;height:100vh;background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;color:var(--text-1);">
      @if (hasSidebar()) {
        <app-sidebar/>
      }
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;">
        @if (hasSidebar()) {
          <app-topbar/>
        }
        <div style="flex:1;overflow-y:auto;">
          <router-outlet/>
        </div>
      </div>

      <!-- Tweaks panel -->
      @if (state.tweaksOpen()) {
        <div style="position:fixed;right:16px;bottom:16px;width:280px;z-index:9999;background:var(--surface-2);border:1px solid var(--border-bright);border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,0.18);overflow:hidden;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid var(--border);">
            <div style="font-size:13px;font-weight:700;color:var(--text-1);">Tweaks</div>
            <button (click)="state.tweaksOpen.set(false)" style="background:none;border:none;color:var(--text-3);cursor:pointer;font-size:16px;line-height:1;font-family:inherit;">✕</button>
          </div>
          <div style="padding:16px 18px;display:flex;flex-direction:column;gap:18px;">

            <!-- Theme -->
            <div>
              <div style="font-size:11px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Thème</div>
              <div style="display:flex;gap:8px;">
                @for (t of themes; track t.val) {
                  <button (click)="state.setTheme(t.val)"
                    [style.background]="state.theme() === t.val ? 'rgba(37,99,235,0.18)' : 'var(--surface-3)'"
                    [style.color]="state.theme() === t.val ? '#60A5FA' : 'var(--text-2)'"
                    [style.border]="'1px solid ' + (state.theme() === t.val ? 'rgba(37,99,235,0.32)' : 'var(--border)')"
                    style="flex:1;padding:8px 0;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.12s;">
                    {{ t.label }}
                  </button>
                }
              </div>
            </div>

            <!-- AI Explainer toggle -->
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--text-1);">Explications IA</div>
                <div style="font-size:11px;color:var(--text-3);margin-top:2px;">Afficher les détails du modèle</div>
              </div>
              <div (click)="state.showAIExplainer.update(v => !v)"
                [style.background]="state.showAIExplainer() ? '#2563EB' : 'var(--surface-3)'"
                [style.border]="'1px solid ' + (state.showAIExplainer() ? '#1D4ED8' : 'var(--border)')"
                style="width:40px;height:22px;border-radius:11px;cursor:pointer;position:relative;transition:all 0.2s;flex-shrink:0;">
                <div [style.left]="state.showAIExplainer() ? '20px' : '2px'"
                  style="position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
              </div>
            </div>

            <!-- Density -->
            <div>
              <div style="font-size:11px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Densité du tableau</div>
              <div style="display:flex;gap:8px;">
                @for (d of densities; track d.val) {
                  <button (click)="state.density.set(d.val)"
                    [style.background]="state.density() === d.val ? 'rgba(16,185,129,0.12)' : 'var(--surface-3)'"
                    [style.color]="state.density() === d.val ? '#34D399' : 'var(--text-2)'"
                    [style.border]="'1px solid ' + (state.density() === d.val ? 'rgba(16,185,129,0.28)' : 'var(--border)')"
                    style="flex:1;padding:7px 0;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.12s;">
                    {{ d.label }}
                  </button>
                }
              </div>
            </div>

          </div>
        </div>
      }
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);
  state = inject(StateService);

  themes = [{ val: 'light' as const, label: '○ Clair' }, { val: 'dark' as const, label: '◑ Sombre' }];
  densities = [{ val: 'normal' as const, label: 'Normal' }, { val: 'compact' as const, label: 'Compact' }];

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  hasSidebar() {
    const url = this.currentUrl() || '';
    return !url.startsWith('/landing') && !url.startsWith('/onboarding');
  }
}
