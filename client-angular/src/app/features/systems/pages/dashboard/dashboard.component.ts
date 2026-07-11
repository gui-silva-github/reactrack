import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SYSTEM_NAV_LINKS } from '../../../../core/constants/navigation/systems';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-systems-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 class="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        {{ i18n.t('dashboard.title') }}
      </h1>
      <p class="mb-8 text-center text-gray-600">
        {{ i18n.t('dashboard.subtitle') }}
      </p>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        @for (system of systems; track system.path) {
          <a
            [routerLink]="system.path"
            class="flex min-h-[7.5rem] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-gray-800 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500 dark:hover:bg-gray-700"
          >
            <span class="text-xl font-semibold">{{ i18n.t('dashboard.' + system.dashboardKey) }}</span>
            <span class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ i18n.t('shortcuts.pressAlt') }} {{ system.shortcutDigit }}
            </span>
          </a>
        }
      </div>
    </section>
  `,
})
export class SystemsDashboardComponent {
  readonly i18n = inject(I18nService);
  readonly systems = SYSTEM_NAV_LINKS;
}
