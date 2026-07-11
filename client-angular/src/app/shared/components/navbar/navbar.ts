import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../services/toast.service';
import { AUTH_MESSAGES } from '../../../core/constants/auth-messages';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { I18nService } from '../../../core/services/i18n/i18n.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, ThemeToggleComponent],
  templateUrl: './navbar.html',
  host: {
    class: 'block w-full',
  },
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  readonly i18n = inject(I18nService);

  userData = this.authService.userData;
  showMenu = false;

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  toggleLanguage(): void {
    this.i18n.toggleLanguage();
  }

  sendVerificationOtp(): void {
    const user = this.userData();
    if (user) {
      this.authService.sendVerifyOtp({ email: user.email }).subscribe({
        next: (response) => {
          if (response.success) {
            this.toast.success(response.message || 'Código enviado!');
            this.router.navigate(['/email-verify'], { queryParams: { email: user.email } });
          } else {
            this.toast.error(response.message || 'Erro ao enviar código!');
          }
        },
        error: (err) => {
          this.toast.error(getApiErrorMessage(err, 'Erro ao enviar código!'));
        }
      })
    }
    this.showMenu = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toast.success(AUTH_MESSAGES.logoutSuccess);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.error(getApiErrorMessage(err, 'Erro ao fazer logout'));
      }
    });
    this.showMenu = false;
  }
}
