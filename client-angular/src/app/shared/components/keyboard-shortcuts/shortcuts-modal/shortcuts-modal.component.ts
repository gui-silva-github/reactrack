import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import {
  GLOBAL_SHORTCUTS,
  SHORTCUT_CATEGORY_LABEL_KEYS,
  SHORTCUT_CATEGORY_ORDER,
} from '../../../../core/constants/keyboard/shortcuts';
import { KeyboardShortcutsService } from '../../../../core/services/keyboard/keyboard-shortcuts.service';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { ShortcutKeysComponent } from '../shortcut-keys/shortcut-keys.component';

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [ShortcutKeysComponent],
  template: `
    <dialog
      #dialogRef
      (close)="onDialogClose()"
      (cancel)="onDialogClose()"
      class="m-auto w-[min(100%,32rem)] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-0 text-black dark:text-gray-100 shadow-2xl backdrop:bg-black/50"
      aria-labelledby="shortcuts-modal-title"
    >
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 id="shortcuts-modal-title" class="text-lg font-semibold">{{ i18n.t('shortcuts.title') }}</h2>
        <button
          type="button"
          (click)="shortcutsService.closeModal()"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {{ i18n.t('shortcuts.close') }}
        </button>
      </div>

      <div class="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-6">
        @for (category of categories; track category) {
          @if (shortcutsByCategory(category).length > 0) {
            <section>
              <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {{ i18n.t(categoryLabelKey(category)) }}
              </h3>
              <ul class="space-y-2 list-none m-0 p-0">
                @for (shortcut of shortcutsByCategory(category); track shortcut.id) {
                  <li class="flex items-center justify-between gap-4 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <span class="text-sm">{{ i18n.t(shortcut.labelKey) }}</span>
                    <app-shortcut-keys [keys]="shortcut.keys" />
                  </li>
                }
              </ul>
            </section>
          }
        }
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
        {{ i18n.t('shortcuts.hint') }}
      </div>
    </dialog>
  `,
})
export class ShortcutsModalComponent {
  readonly shortcutsService = inject(KeyboardShortcutsService);
  readonly i18n = inject(I18nService);
  readonly categories = SHORTCUT_CATEGORY_ORDER;
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  constructor() {
    effect(() => {
      const isOpen = this.shortcutsService.isModalOpen();

      queueMicrotask(() => {
        const dialog = this.dialogRef()?.nativeElement;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
          dialog.showModal();
        } else if (!isOpen && dialog.open) {
          dialog.close();
        }
      });
    });
  }

  shortcutsByCategory(category: (typeof SHORTCUT_CATEGORY_ORDER)[number]) {
    return GLOBAL_SHORTCUTS.filter((shortcut) => shortcut.category === category);
  }

  categoryLabelKey(category: (typeof SHORTCUT_CATEGORY_ORDER)[number]): string {
    return SHORTCUT_CATEGORY_LABEL_KEYS[category];
  }

  onDialogClose(): void {
    this.shortcutsService.closeModal();
  }
}
