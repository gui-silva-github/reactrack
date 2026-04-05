import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (!newPassword || !confirmPassword) {
    return null;
  }

  return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0">
      <div class="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300">
        <h2 class="text-white text-2xl font-semibold text-center mb-4">Redefinir Senha</h2>
        <p class="text-center mb-6 text-indigo-300">Use seu e-mail, OTP e nova senha</p>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src="/assets/svg/mail.svg" alt="Email" class="w-4 h-4" />
            <input id="email" type="email" formControlName="email" class="bg-transparent outline-none text-white w-full" placeholder="E-mail" />
          </div>
          @if (resetForm.get('email')?.invalid && resetForm.get('email')?.touched) {
            <span class="text-xs text-red-400 mb-2 block">Email inválido</span>
          }

          <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src="/assets/svg/lock.svg" alt="OTP" class="w-4 h-4" />
            <input id="otp" type="text" maxlength="6" formControlName="otp" class="bg-transparent outline-none text-white w-full" placeholder="Código OTP" />
          </div>
          @if (resetForm.get('otp')?.invalid && resetForm.get('otp')?.touched) {
            <span class="text-xs text-red-400 mb-2 block">Código OTP é obrigatório</span>
          }

          <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src="/assets/svg/lock.svg" alt="Nova senha" class="w-4 h-4" />
            <input id="newPassword" type="password" formControlName="newPassword" class="bg-transparent outline-none text-white w-full" placeholder="Nova senha" />
          </div>
          @if (resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched) {
            <span class="text-xs text-red-400 mb-2 block">Senha deve ter pelo menos 6 caracteres</span>
          }

          <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src="/assets/svg/lock.svg" alt="Confirmar senha" class="w-4 h-4" />
            <input id="confirmPassword" type="password" formControlName="confirmPassword" class="bg-transparent outline-none text-white w-full" placeholder="Confirmar senha" />
          </div>
          @if (resetForm.get('confirmPassword')?.invalid && resetForm.get('confirmPassword')?.touched) {
            <span class="text-xs text-red-400 mb-2 block">Senhas não coincidem</span>
          }

          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mb-2" [disabled]="resetForm.invalid || loading()">
            @if (loading()) { Redefinindo... } @else { Redefinir Senha }
          </button>

          <button type="button" class="w-full py-2.5 rounded-full bg-[#333A5C] text-white" (click)="sendOtp()" [disabled]="sendingOtp()">
            @if (sendingOtp()) { Enviando... } @else { Enviar Código }
          </button>
        </form>

        <div class="mt-4 text-center text-xs">
          <a routerLink="/login" class="text-blue-400 cursor-pointer">Voltar para login</a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = signal(false);
  sendingOtp = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.loading.set(true);
      const { email, otp, newPassword } = this.resetForm.value;

      this.authService.resetPassword({ email, otp, newPassword }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success(response.message || 'Senha redefinida com sucesso!');
            this.router.navigate(['/login']);
          } else {
            this.toast.error(response.message || 'Erro ao redefinir senha');
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.toast.error('Erro ao redefinir senha. Tente novamente.');
          this.loading.set(false);
        }
      });
    }
  }

  sendOtp(): void {
    const email = this.resetForm.get('email')?.value;
    if (email) {
      this.sendingOtp.set(true);
      this.authService.sendResetOtp({ email }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success('Código enviado com sucesso!');
          } else {
            this.toast.error(response.message || 'Erro ao enviar código');
          }
          this.sendingOtp.set(false);
        },
        error: () => {
          this.toast.error('Erro ao enviar código. Tente novamente.');
          this.sendingOtp.set(false);
        }
      });
    }
  }
}

















