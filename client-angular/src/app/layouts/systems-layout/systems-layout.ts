import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarSystemsComponent } from '../../shared/components/navbar-systems/navbar-systems';
import { HeaderSystemsComponent } from '../../shared/components/header-systems/header-systems.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-systems-layout',
  imports: [CommonModule, RouterOutlet, NavbarSystemsComponent, HeaderSystemsComponent],
  templateUrl: './systems-layout.html',
})
export class SystemsLayoutComponent {
  private currentUrl = signal<string>('/systems');

  isSystemRoute = computed(() => {
    const url = this.normalizePath(this.currentUrl());
    return url !== '/systems' && url.startsWith('/systems/');
  });

  constructor(private router: Router) {
    this.currentUrl.set(this.router.url || '/systems');

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }

  private normalizePath(url: string): string {
    return url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  }
}
