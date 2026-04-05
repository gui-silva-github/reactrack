import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { NavbarSystemsComponent } from '../../shared/components/navbar-systems/navbar-systems'
import { filter } from "rxjs";

@Component({
  selector: 'app-systems-layout',
  imports: [CommonModule, RouterOutlet, NavbarSystemsComponent],
  templateUrl: './systems-layout.html',
  styleUrl: './systems-layout.css',
})
export class SystemsLayoutComponent {
  private currentUrl = signal<string>('/systems');

  isSystemRoute = computed(() => {
    const url = this.currentUrl();
    return url !== '/systems' && url.startsWith('/systems/');
  });

  constructor(private router: Router) {
    this.currentUrl.set(this.router.url || '/systems');

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
    }
}
