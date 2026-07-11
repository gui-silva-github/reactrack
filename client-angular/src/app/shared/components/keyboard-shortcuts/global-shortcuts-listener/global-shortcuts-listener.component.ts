import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL_SHORTCUTS } from '../../../../core/constants/keyboard/shortcuts';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { KeyboardShortcutsService } from '../../../../core/services/keyboard/keyboard-shortcuts.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import {
  isEditableTarget,
  matchKeyboardEvent,
} from '../../../../core/utils/keyboard/match-keyboard-event.util';

@Component({
  selector: 'app-global-shortcuts-listener',
  standalone: true,
  template: '',
})
export class GlobalShortcutsListenerComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);
  private readonly shortcuts = inject(KeyboardShortcutsService);
  private readonly shortcutsById = Object.fromEntries(GLOBAL_SHORTCUTS.map((s) => [s.id, s]));

  private readonly onKeyDown = (event: KeyboardEvent) => this.handleKeyDown(event);

  ngOnInit(): void {
    window.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (isEditableTarget(event.target)) {
      return;
    }

    for (const shortcut of GLOBAL_SHORTCUTS) {
      if (shortcut.id === 'close-modal' && !this.shortcuts.isModalOpen()) {
        continue;
      }

      if (!matchKeyboardEvent(event, shortcut.match)) {
        continue;
      }

      event.preventDefault();
      this.executeShortcut(shortcut.id);
      return;
    }
  }

  private executeShortcut(id: string): void {
    const shortcut = this.shortcutsById[id];

    if (shortcut?.path) {
      void this.router.navigateByUrl(shortcut.path);
      return;
    }

    switch (id) {
      case 'show-shortcuts':
        this.shortcuts.openModal();
        break;
      case 'close-modal':
        this.shortcuts.closeModal();
        break;
      case 'toggle-language':
        this.i18n.toggleLanguage();
        break;
      case 'toggle-theme':
        this.theme.toggleTheme();
        break;
      default:
        break;
    }
  }
}
