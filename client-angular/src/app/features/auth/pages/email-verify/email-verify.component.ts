import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-email-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0">
      <div class="bg-slate-900 p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300">
        <h2 class="text-white text-2xl font-semibold text-center mb-4">Verificar Email</h2>
        <p class="text-center mb-6 text-indigo-300">Insira o código enviado para seu e-mail</p>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
          <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src="/assets/svg/mail.svg" alt="Email" class="w-4 h-4" />
            <input
              id="email"
              type="email"
              formControlName="email"
              [readonly]="true"
              class="bg-transparent outline-none text-white w-full opacity-80"
            />
          </div>

          <div class="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src="/assets/svg/lock.svg" alt="OTP" class="w-4 h-4" />
            <input
              id="otp"
              type="text"
              formControlName="otp"
              maxlength="6"
              placeholder="Código OTP"
              class="bg-transparent outline-none text-white w-full"
            />
          </div>

          @if (verifyForm.get('otp')?.invalid && verifyForm.get('otp')?.touched) {
            <span class="text-xs text-red-400 mb-3 block">Código OTP é obrigatório</span>
          }

          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mb-2" [disabled]="verifyForm.invalid || loading()">
            @if (loading()) { Verificando... } @else { Verificar }
          </button>

          <button type="button" class="w-full py-2.5 rounded-full bg-[#333A5C] text-white" (click)="sendOtp()" [disabled]="sendingOtp()">
            @if (sendingOtp()) { Enviando... } @else { Reenviar Código }
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
export class EmailVerifyComponent {
  verifyForm: FormGroup;
  loading = signal(false);
  sendingOtp = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    const email = this.route.snapshot.queryParams['email'] || '';
    this.verifyForm = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      otp: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      this.loading.set(true);
      const { email, otp } = this.verifyForm.value;

      this.authService.verifyEmail({ email, otp }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success(response.message || 'Email verificado com sucesso!');
            this.router.navigate(['/login']);
          } else {
            this.toast.error(response.message || 'Código inválido');
          }
          this.loading.set(false);
        },
        error: () => {
          this.toast.error('Erro ao verificar email. Tente novamente.');
          this.loading.set(false);
        }
      });
    }
  }

  sendOtp(): void {
    const email = this.verifyForm.get('email')?.value;
    if (email) {
      this.sendingOtp.set(true);
      this.authService.sendVerifyOtp({ email }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success('Código reenviado com sucesso!');
          } else {
            this.toast.error(response.message || 'Erro ao reenviar código');
          }
          this.sendingOtp.set(false);
        },
        error: () => {
          this.toast.error('Erro ao reenviar código. Tente novamente.');
          this.sendingOtp.set(false);
        }
      });
    }
  }
}


