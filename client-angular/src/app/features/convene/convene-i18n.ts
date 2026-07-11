import { inject, Injectable } from '@angular/core';
import { I18nService } from '../../core/services/i18n/i18n.service';

@Injectable({ providedIn: 'root' })
export class ConveneI18n {
  private readonly i18n = inject(I18nService);

  t(key: string): string {
    return this.i18n.t(`convene.${key}`);
  }
}
