import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  betaExpiresAt: string;
  isAdmin: boolean;
  betaDaysLeft: number;
}

const TOKEN_KEY = 'ep_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiUrl;

  private _user = signal<UserProfile | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !this.isExpired(token)) {
      this.http.get<UserProfile>(`${this.base}/auth/me`).subscribe({
        next: u => this._user.set(u),
        error: () => this.clearSession()
      });
    } else {
      this.clearSession();
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.http.get<UserProfile>(`${this.base}/auth/me`).subscribe(u => this._user.set(u));
      })
    );
  }

  register(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post(`${this.base}/auth/register`, { email, password, firstName, lastName });
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    this._user.set(null);
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
