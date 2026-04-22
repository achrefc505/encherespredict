import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  id: string;
  path: string;
  icon: string;
  label: string;
  exact: boolean;
}

const NAV: NavItem[] = [
  { id: 'dashboard',  path: '/dashboard',  icon: '⊞', label: 'Dashboard',    exact: true  },
  { id: 'auctions',   path: '/auctions',   icon: '⊟', label: 'Enchères',     exact: false },
  { id: 'landing',    path: '/landing',    icon: '◉', label: 'Landing Page', exact: true  },
  { id: 'onboarding', path: '/onboarding', icon: '◈', label: 'Onboarding',   exact: true  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside style="width:220px;flex-shrink:0;background:#1A2744;display:flex;flex-direction:column;padding:20px 10px 14px;height:100vh;position:sticky;top:0;box-shadow:2px 0 12px rgba(0,0,0,0.15);">
      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:10px;padding:0 6px;margin-bottom:6px;">
        <div style="width:38px;height:38px;border-radius:10px;flex-shrink:0;background:linear-gradient(135deg,#2563EB 0%,#1E40AF 100%);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;letter-spacing:-0.5px;box-shadow:0 4px 12px rgba(37,99,235,0.4);">EP</div>
        <div style="line-height:1;">
          <div style="font-size:14px;font-weight:700;color:#F1F5F9;">Enchères</div>
          <div style="font-size:9px;color:#93C5FD;font-weight:700;letter-spacing:1.4px;margin-top:2px;">PREDICT</div>
        </div>
      </div>

      <div style="height:1px;background:rgba(255,255,255,0.08);margin:16px 0 14px;"></div>
      <div style="font-size:9px;color:rgba(148,163,184,0.7);font-weight:700;letter-spacing:1.4px;margin-bottom:6px;padding-left:10px;text-transform:uppercase;">Navigation</div>

      <nav style="flex:1;">
        @for (item of nav; track item.id) {
          <a [routerLink]="item.path"
             routerLinkActive="nav-item--active"
             [routerLinkActiveOptions]="{ exact: item.exact }"
             #rla="routerLinkActive"
             class="nav-item"
             style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;margin-bottom:2px;cursor:pointer;text-decoration:none;font-size:13px;transition:all 0.12s;">
            <span style="font-size:14px;" [style.opacity]="rla.isActive ? 1 : 0.65">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Upgrade card -->
      <div style="background:rgba(37,99,235,0.18);border:1px solid rgba(59,130,246,0.28);border-radius:10px;padding:14px;margin-bottom:12px;">
        <div style="font-size:12px;font-weight:700;color:#93C5FD;margin-bottom:4px;">✦ Passer à Pro</div>
        <div style="font-size:11px;color:rgba(148,163,184,0.8);margin-bottom:10px;line-height:1.5;">Prédictions illimitées + analyses complètes</div>
        <div style="background:#2563EB;color:#fff;border-radius:7px;padding:7px 12px;font-size:11px;font-weight:700;text-align:center;cursor:pointer;">Voir les offres →</div>
      </div>

      <!-- User -->
      <div style="display:flex;align-items:center;gap:10px;padding:10px 8px;border-top:1px solid rgba(255,255,255,0.07);">
        <div style="width:32px;height:32px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#2563EB,#10B981);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;">JD</div>
        <div style="overflow:hidden;flex:1;">
          <div style="font-size:12px;font-weight:600;color:#E2E8F0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Jean Dupont</div>
          <div style="font-size:10px;color:#64748B;">Plan Gratuit</div>
        </div>
        <div style="font-size:14px;color:#64748B;cursor:pointer;flex-shrink:0;">⋯</div>
      </div>
    </aside>
  `,
  styles: [`
    .nav-item { color: #94A3B8; font-weight: 400; }
    .nav-item:hover { background: rgba(255,255,255,0.06) !important; color: #E2E8F0 !important; }
    .nav-item--active {
      background: #2563EB !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 8px rgba(37,99,235,0.35);
    }
  `]
})
export class SidebarComponent {
  nav = NAV;
}
