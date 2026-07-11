import { ApplicationRef, Injectable, inject, signal } from '@angular/core';
import en from '../../constants/i18n/locales/en.json';
import pt from '../../constants/i18n/locales/pt.json';

export type AppLanguage = 'pt' | 'en';

const LANG_STORAGE_KEY = 'reactrack-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly appRef = inject(ApplicationRef);
  private readonly translations = { pt, en } as const;

  readonly language = signal<AppLanguage>(this.getStoredLanguage());

  constructor() {
    this.applyLanguage(this.language());
  }

  t(key: string, params?: Record<string, string>): string {
    const lang = this.language();
    const parts = key.split('.');
    let node: unknown = this.translations[lang];

    for (const part of parts) {
      if (node && typeof node === 'object' && part in (node as object)) {
        node = (node as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }

    if (typeof node !== 'string') {
      return key;
    }

    if (!params) {
      return node;
    }

    return Object.entries(params).reduce(
      (text, [paramKey, value]) => text.replace(`{{${paramKey}}}`, value),
      node
    );
  }

  toggleLanguage(): void {
    const next = this.language() === 'pt' ? 'en' : 'pt';
    this.language.set(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    this.applyLanguage(next);
    this.appRef.tick();
  }

  isEn(): boolean {
    return this.language() === 'en';
  }

  private getStoredLanguage(): AppLanguage {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as AppLanguage | null;
      return stored === 'en' || stored === 'pt' ? stored : 'pt';
    } catch {
      return 'pt';
    }
  }

  private applyLanguage(lang: AppLanguage): void {
    document.documentElement.lang = lang === 'pt' ? 'pt-br' : 'en';
  }
}
