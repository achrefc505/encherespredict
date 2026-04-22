import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateService {
  theme = signal<'light' | 'dark'>('light');
  density = signal<'normal' | 'compact'>('normal');
  showAIExplainer = signal(true);
  tweaksOpen = signal(false);

  toggleTheme() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    document.body.classList.toggle('dark', next === 'dark');
  }

  setTheme(t: 'light' | 'dark') {
    this.theme.set(t);
    document.body.classList.toggle('dark', t === 'dark');
  }
}
