import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;background:var(--bg);min-height:100vh;">
      <div style="width:100%;max-width:400px;">

        <div style="text-align:center;margin-bottom:36px;">
          <div style="display:inline-flex;width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#2563EB,#8B5CF6);align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;margin-bottom:14px;box-shadow:0 6px 20px rgba(37,99,235,0.3);">EP</div>
          <div style="font-size:20px;font-weight:800;color:var(--text-1);letter-spacing:-0.3px;">Enchères<span style="color:#60A5FA;">Predict</span></div>
          <div style="font-size:13px;color:var(--text-3);margin-top:4px;">Connectez-vous à votre compte</div>
        </div>

        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:16px;padding:32px;">

          @if (error()) {
            <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#FCA5A5;">
              {{ error() }}
            </div>
          }

          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:11px;font-weight:600;color:var(--text-2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Email</label>
            <input [(ngModel)]="email" type="email" placeholder="vous@exemple.fr" (keyup.enter)="submit()"
              style="width:100%;padding:10px 12px;background:var(--surface-3);border:1px solid var(--border);border-radius:8px;color:var(--text-1);font-size:13px;outline:none;box-sizing:border-box;font-family:inherit;" />
          </div>

          <div style="margin-bottom:24px;">
            <label style="display:block;font-size:11px;font-weight:600;color:var(--text-2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Mot de passe</label>
            <input [(ngModel)]="password" type="password" placeholder="••••••••" (keyup.enter)="submit()"
              style="width:100%;padding:10px 12px;background:var(--surface-3);border:1px solid var(--border);border-radius:8px;color:var(--text-1);font-size:13px;outline:none;box-sizing:border-box;font-family:inherit;" />
          </div>

          <button (click)="submit()" [disabled]="loading()" class="btn-primary" style="width:100%;">
            {{ loading() ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>

        <div style="text-align:center;margin-top:18px;font-size:12px;color:var(--text-3);">
          Pas encore de compte ?
          <a routerLink="/register" style="color:#60A5FA;text-decoration:none;font-weight:600;"> Créer un accès beta</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary { background:#2563EB;color:#fff;border:none;padding:10px 18px;font-size:13px;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;transition:background 0.15s; }
    .btn-primary:hover:not([disabled]) { background:#1D4ED8; }
    .btn-primary[disabled] { opacity:0.5;cursor:not-allowed; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  submit() {
    if (!this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Email ou mot de passe incorrect.');
      }
    });
  }
}
