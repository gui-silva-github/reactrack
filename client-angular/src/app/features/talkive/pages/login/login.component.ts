import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '@/app/core/services/i18n/i18n.service';
import { TalkiveService } from '@/app/core/services/talkive/talkive.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'app-talkive-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class TalkiveLoginComponent {
  private readonly talkiveService = inject(TalkiveService);
  private readonly toastService = inject(ToastService);
  readonly i18n = inject(I18nService);

  mode = signal<'signup' | 'login'>('signup');
  username = '';
  email = '';
  password = '';

  async submit(): Promise<void> {
    if (!this.email || !this.password) return;
    if (this.mode() === 'signup' && !this.username) return;

    try {
      if (this.mode() === 'signup') {
        await this.talkiveService.signup({ username: this.username, email: this.email, password: this.password });
        this.toastService.success(this.i18n.t('talkive.signup.createAccount'));
      } else {
        await this.talkiveService.login({ email: this.email, password: this.password });
        this.toastService.success(this.i18n.t('auth.loginSuccess'));
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const message = err?.code?.split('/')[1]?.split('-').join(' ') || err?.message || this.i18n.t('talkive.errors.createProfile');
      this.toastService.error(message);
    }
  }

  async forgotPassword(): Promise<void> {
    if (!this.email) {
      this.toastService.warning(this.i18n.t('auth.insertEmailError'));
      return;
    }

    const sent = await this.talkiveService.resetPassword({ email: this.email });
    if (sent) {
      this.toastService.success(this.i18n.t('talkive.errors.emailSent'));
    } else {
      this.toastService.error(this.i18n.t('talkive.errors.emailNotExist'));
    }
  }
}
