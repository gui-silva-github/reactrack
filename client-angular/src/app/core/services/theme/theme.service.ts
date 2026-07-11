import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'reactrack-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    this.applyTheme(mode);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  private getStoredTheme(): ThemeMode {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      return stored === 'dark' || stored === 'light' ? stored : 'light';
    } catch {
      return 'light';
    }
  }

  private applyTheme(mode: ThemeMode): void {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
}
