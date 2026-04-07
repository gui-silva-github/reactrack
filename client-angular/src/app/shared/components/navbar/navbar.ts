import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../services/toast.service';
import { AUTH_MESSAGES } from '../../../core/constants/auth-messages';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  userData = this.authService.userData;
  private menuOpen = signal(false);
  showMenu = computed(() => this.menuOpen());

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
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
    this.menuOpen.set(false);
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
    this.menuOpen.set(false);
  }
}
