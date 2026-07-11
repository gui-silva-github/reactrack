import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { I18nService } from '../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  host: {
    class: 'inline-flex shrink-0',
  },
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
  readonly i18n = inject(I18nService);
  readonly isLight = computed(() => this.themeService.theme() === 'light');
}
