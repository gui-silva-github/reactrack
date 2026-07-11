import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SYSTEM_NAV_LINKS } from '../../../core/constants/navigation/systems';
import { I18nService } from '../../../core/services/i18n/i18n.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar-systems',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './navbar-systems.html',
  host: {
    class: 'block w-full',
  },
})
export class NavbarSystemsComponent {
  readonly i18n = inject(I18nService);
  readonly navLinks = computed(() => SYSTEM_NAV_LINKS);

  toggleLanguage(): void {
    this.i18n.toggleLanguage();
  }

  linkClasses(isActive: boolean): string {
    return `text-sm font-medium px-3 py-2 rounded-md transition duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
  }
}
