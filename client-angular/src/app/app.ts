import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { ToastComponent } from './shared/components/toast/toast';
import { GlobalShortcutsListenerComponent } from './shared/components/keyboard-shortcuts/global-shortcuts-listener/global-shortcuts-listener.component';
import { ShortcutsModalComponent } from './shared/components/keyboard-shortcuts/shortcuts-modal/shortcuts-modal.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent,
    GlobalShortcutsListenerComponent,
    ShortcutsModalComponent,
  ],
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
