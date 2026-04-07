import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IPostResponse } from '../../../../core/models/apiResponse/api-response.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AUTH_MESSAGES } from '../../../../core/constants/auth-messages';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen px-6 sm:px-0 pt-24 pb-10 bg-gradient-to-br from-blue-200 to-purple-400 flex items-center justify-center text-indigo-300">
      <div class="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm border border-slate-700">
          <h2 class="text-3xl font-semibold text-white text-center mb-3">Login</h2>
          <p class="text-center text-sm mb-6 text-indigo-200">Logue na sua conta</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src="/assets/svg/mail.svg" alt="Email" class="w-5 h-5" />
              <input
                id="email"
                type="email"
                formControlName="email"
                class="bg-transparent outline-none flex-1 text-sm placeholder-indigo-200/70"
                placeholder="E-mail"
                required
              />
            </div>
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <span class="text-xs text-red-400 mb-2 block">Email é obrigatório</span>
            }

            <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src="/assets/svg/lock.svg" alt="Senha" class="w-5 h-5" />
              <input
                id="password"
                type="password"
                formControlName="password"
                class="bg-transparent outline-none flex-1 text-sm placeholder-indigo-200/70"
                placeholder="Senha"
                required
              />
            </div>
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="text-xs text-red-400 mb-2 block">Senha é obrigatória</span>
            }

            <p
              class="mb-4 text-indigo-500 cursor-pointer text-xs text-right hover:underline"
              (click)="goToResetPassword()"
            >
              Esqueceu sua senha?
            </p>

            <button
              type="submit"
              class="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              [disabled]="loginForm.invalid || loading()"
            >
              @if (loading()) {
                Carregando...
              } @else {
                Login
              }
            </button>
          </form>

          <p class="text-gray-400 text-center text-xs mt-4">
            Não tem uma conta?
            <a routerLink="/signup" class="text-blue-400 cursor-pointer hover:underline">Cadastre-se</a>
          </p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response: IPostResponse) => {
          if (response.success) {
            this.toast.success(AUTH_MESSAGES.loginSuccess);
            this.router.navigate(['/']);
          } else {
            this.toast.error(response.message || 'Erro ao fazer login');
          }
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.toast.error(
            getApiErrorMessage(err, 'Erro ao fazer login. Tente novamente.')
          );
          this.loading.set(false);
        }
      });
    }
  }

  goToResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}

