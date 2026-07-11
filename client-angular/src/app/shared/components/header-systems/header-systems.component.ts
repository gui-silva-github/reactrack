import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { I18nService } from '../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-header-systems',
  standalone: true,
  template: `
    <div class="mt-20 flex flex-col items-center px-4 text-center text-gray-800">
      <img
        src="/assets/png/header.png"
        [alt]="i18n.t('common.headerAlt')"
        class="mb-6 h-36 w-36 shrink-0 rounded-full object-cover"
      />

      <h1 class="mb-2 flex items-center gap-2 text-xl font-medium text-gray-800 sm:text-3xl">
        {{ i18n.t('home.hello', { name: userName() }) }}
        <img src="/assets/png/hand.png" class="aspect-square w-8" [alt]="i18n.t('common.robotAlt')" />
      </h1>

      <h2 class="mb-4 text-3xl font-semibold text-gray-800 sm:text-5xl">{{ i18n.t('home.welcome') }}</h2>
      <p class="mb-8 max-w-md text-gray-700">{{ i18n.t('home.startUsing') }}</p>

      @if (!isLoggedIn()) {
        <button
          type="button"
          (click)="goToLogin()"
          class="rounded-full border border-gray-500 px-8 py-2.5 text-gray-800 transition-all hover:bg-gray-100"
        >
          {{ i18n.t('home.letsGo') }}
        </button>
      } @else {
        <button
          type="button"
          (click)="goToSystems()"
          class="rounded-full border border-gray-500 px-8 py-2.5 text-gray-800 transition-all hover:bg-gray-100"
        >
          {{ i18n.t('home.systemsButton') }}
        </button>
      }
    </div>
  `,
})
export class HeaderSystemsComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  userName(): string {
    return this.authService.userData()?.name ?? this.i18n.t('home.user');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSystems(): void {
    this.router.navigate(['/systems']);
  }
}
