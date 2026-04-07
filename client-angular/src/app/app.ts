import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { ToastComponent } from './shared/components/toast/toast';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'ReactRack';

  private currentUrl = signal<string>('/');
  isSystemsSection = computed(() => this.currentUrl().startsWith('/systems'));

  constructor(private router: Router) {
    this.currentUrl.set(this.router.url || '/');

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
    }
}
