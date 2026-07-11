import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AUTH_MESSAGES } from '../../../../core/constants/auth-messages';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0">
      <div class="w-full rounded-lg bg-slate-900 p-10 text-sm text-indigo-300 shadow-lg sm:w-96">
        <h2 class="mb-3 text-center text-3xl font-semibold text-white">{{ i18n.t('auth.signup') }}</h2>
        <p class="mb-6 text-center text-sm">{{ i18n.t('auth.signupSubtitle') }}</p>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5">
            <img src="/assets/svg/person.svg" [alt]="i18n.t('common.iconAlt')" class="h-5 w-5" />
            <input
              id="name"
              type="text"
              formControlName="name"
              class="flex-1 bg-transparent text-sm outline-none"
              [placeholder]="i18n.t('auth.fullName')"
              required
            />
          </div>

          <div class="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5">
            <img src="/assets/svg/mail.svg" [alt]="i18n.t('auth.email')" class="h-5 w-5" />
            <input
              id="email"
              type="email"
              formControlName="email"
              class="flex-1 bg-transparent text-sm outline-none"
              [placeholder]="i18n.t('auth.email')"
              required
            />
          </div>

          <div class="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333A5C] px-5 py-2.5">
            <img src="/assets/svg/lock.svg" [alt]="i18n.t('auth.password')" class="h-5 w-5" />
            <input
              id="password"
              type="password"
              formControlName="password"
              class="flex-1 bg-transparent text-sm outline-none"
              [placeholder]="i18n.t('auth.password')"
              required
            />
          </div>

          <p
            class="mb-4 cursor-pointer text-indigo-500"
            (click)="goToResetPassword()"
          >
            {{ i18n.t('auth.forgotPassword') }}
          </p>

          <button
            type="submit"
            class="w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            [disabled]="signupForm.invalid || loading()"
          >
            @if (loading()) {
              {{ i18n.t('common.loading') }}
            } @else {
              {{ i18n.t('auth.register') }}
            }
          </button>
        </form>

        <p class="mt-4 text-center text-xs text-gray-400">
          {{ i18n.t('auth.alreadyHaveAccount') }}
          <a routerLink="/login" class="cursor-pointer text-blue-400">{{ i18n.t('auth.login') }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [],
})
export class SignupComponent {
  readonly i18n = inject(I18nService);
  signupForm: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading.set(true);
      const { name, email, password } = this.signupForm.value;

      this.authService.register({ name, email, password }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success(AUTH_MESSAGES.signupSuccess);
            this.router.navigate(['/']);
          } else {
            this.toast.error(response.message || 'Erro ao cadastrar');
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.toast.error(getApiErrorMessage(err, 'Erro ao cadastrar. Tente novamente.'));
          this.loading.set(false);
        },
      });
    }
  }

  goToResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}
