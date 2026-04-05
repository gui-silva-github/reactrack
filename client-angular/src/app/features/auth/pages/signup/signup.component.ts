import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen px-6 sm:px-0 pt-24 pb-10 bg-gradient-to-br from-blue-200 to-purple-400 flex items-center justify-center text-indigo-300">
      <div class="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm border border-slate-700">
          <h2 class="text-3xl font-semibold text-white text-center mb-3">Cadastre-se</h2>
          <p class="text-center text-sm mb-6 text-indigo-200">Crie sua conta</p>

          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src="/assets/svg/person.svg" alt="Pessoa" class="w-5 h-5" />
              <input
                id="name"
                type="text"
                formControlName="name"
                class="bg-transparent outline-none flex-1 text-sm placeholder-indigo-200/70"
                placeholder="Nome completo"
                required
              />
            </div>
            @if (signupForm.get('name')?.invalid && signupForm.get('name')?.touched) {
              <span class="text-xs text-red-400 mb-2 block">Nome é obrigatório</span>
            }

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
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
              <span class="text-xs text-red-400 mb-2 block">Email inválido</span>
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
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
              <span class="text-xs text-red-400 mb-2 block">Senha deve ter pelo menos 6 caracteres</span>
            }

            <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src="/assets/svg/lock.svg" alt="Confirmar senha" class="w-5 h-5" />
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="bg-transparent outline-none flex-1 text-sm placeholder-indigo-200/70"
                placeholder="Confirmar senha"
                required
              />
            </div>
            @if (signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched) {
              <span class="text-xs text-red-400 mb-2 block">Senhas não coincidem</span>
            }

            <button
              type="submit"
              class="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              [disabled]="signupForm.invalid || loading()"
            >
              @if (loading()) {
                Cadastrando...
              } @else {
                Cadastrar
              }
            </button>
          </form>

          <p class="text-gray-400 text-center text-xs mt-4">
            Já tem uma conta?
            <a routerLink="/login" class="text-blue-400 cursor-pointer hover:underline">Login</a>
          </p>
      </div>
    </div>
  `,
  styles: []
})
export class SignupComponent {
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
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading.set(true);
      const { name, email, password } = this.signupForm.value;

      this.authService.register({ name, email, password }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success(response.message || 'Cadastro realizado com sucesso!');
            this.router.navigate(['/email-verify'], { queryParams: { email } });
          } else {
            this.toast.error(response.message || 'Erro ao cadastrar');
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.toast.error('Erro ao cadastrar. Tente novamente.');
          this.loading.set(false);
        }
      });
    }
  }
}

