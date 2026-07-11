import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center bg-gray-50">
      <div class="mt-20 flex flex-col items-center px-4 text-center text-gray-900">
        <img
          src="/assets/png/header.png"
          [alt]="i18n.t('common.headerAlt')"
          class="mb-6 h-36 w-36 shrink-0 rounded-full object-cover"
        />

        <div class="mb-2 flex items-center gap-2 text-xl font-medium text-gray-900 sm:text-3xl">
          <span>{{ i18n.t('home.hello', { name: userName() }) }}</span>
          <img src="/assets/png/hand.png" class="aspect-square w-8" [alt]="i18n.t('common.robotAlt')" />
        </div>

        <h2 class="mb-4 text-3xl font-semibold text-gray-900 sm:text-5xl">{{ i18n.t('home.welcome') }}</h2>
        <p class="mb-8 max-w-md text-gray-700">{{ i18n.t('home.startUsing') }}</p>

        @if (isLoggedIn()) {
          <a
            routerLink="/systems"
            class="rounded-full border border-gray-500 px-8 py-2.5 text-gray-900 transition-all hover:bg-gray-100"
          >
            {{ i18n.t('home.systemsButton') }}
          </a>
        } @else {
          <a
            routerLink="/login"
            class="rounded-full border border-gray-500 px-8 py-2.5 text-gray-900 transition-all hover:bg-gray-100"
          >
            {{ i18n.t('home.letsGo') }}
          </a>
        }
      </div>
    </div>
  `,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  readonly i18n = inject(I18nService);

  userName(): string {
    return this.authService.userData()?.name ?? this.i18n.t('home.user');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
