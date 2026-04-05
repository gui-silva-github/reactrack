import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-talkive-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login">
      <form (ngSubmit)="submit()" class="login-form">
        @if (mode === 'signup') {
          <input [(ngModel)]="name" name="name" required type="text" placeholder="Nome de Usuário" class="form-input" />
        }
        <input [(ngModel)]="email" name="email" required type="email" placeholder="E-mail" class="form-input" />
        <input [(ngModel)]="password" name="password" required type="password" placeholder="Senha" class="form-input" />
        <button type="submit">{{ mode === 'signup' ? 'Criar conta' : 'Login' }}</button>

        <div class="login-term">
          <input type="checkbox" checked />
          <p>Concordo com os termos de uso e políticas de privacidade.</p>
        </div>

        <div class="login-forgot">
          @if (mode === 'signup') {
            <p class="login-toggle">Já tem uma conta? <span (click)="mode='login'">Login</span></p>
          } @else {
            <p class="login-toggle">Criar uma conta? <span (click)="mode='signup'">Clique aqui</span></p>
            <p class="login-toggle">Esqueceu a senha? <span (click)="forgotPassword()">Resete aqui</span></p>
          }
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login {
      min-height: 100vh;
      margin-top: -4rem;
      background: url('/talkive/bg_talkive.jpg') no-repeat center/cover;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
    .login-form {
      margin-top: 15rem;
      background-color: rgba(255, 255, 255, 1);
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      border-radius: 10px;
      min-width: 340px;
    }
    .form-input {
      padding: 8px 10px;
      border: 1px solid #c9c9c9;
      border-radius: 4px;
      outline-color: #077eff;
    }
    .login-form button {
      padding: 10px;
      background-color: #077eff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .login-term {
      display: flex;
      gap: 5px;
      font-size: 12px;
      color: #808080;
    }
    .login-forgot {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .login-toggle {
      font-size: 13px;
      color: #5c5c5c;
    }
    .login-toggle span {
      font-weight: 500;
      color: #077eff;
      cursor: pointer;
    }
  `]
})
export class TalkiveLoginComponent {
  mode: 'signup' | 'login' = 'signup';
  name = '';
  email = '';
  password = '';

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  submit(): void {
    if (!this.email || !this.password) return;
    if (this.mode === 'signup' && !this.name) return;

    const currentName = this.mode === 'signup' ? this.name : (this.email.split('@')[0] || 'Usuário');
    const profile = {
      name: currentName,
      email: this.email,
      bio: 'Olá! Estou usando o Talkive.',
      avatar: '/assets/talkive/avatar_icon.png'
    };
    localStorage.setItem('talkive-profile', JSON.stringify(profile));
    this.toastService.success(this.mode === 'signup' ? 'Conta criada no Talkive.' : 'Login realizado no Talkive.');
    this.router.navigate(['/systems/talkive/chat']);
  }

  forgotPassword(): void {
    this.toastService.info('Fluxo de reset simulado para este ambiente.');
  }
}










