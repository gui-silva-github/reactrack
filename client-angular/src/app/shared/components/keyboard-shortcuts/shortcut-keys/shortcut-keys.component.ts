import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shortcut-keys',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1 shrink-0">
      @for (key of keys(); track $index; let index = $index) {
        <span class="inline-flex items-center gap-1">
          @if (index > 0) {
            <span class="text-gray-400 dark:text-gray-500 text-xs" aria-hidden>+</span>
          }
          <kbd class="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-black dark:text-gray-100 shadow-sm">
            {{ key }}
          </kbd>
        </span>
      }
    </span>
  `,
})
export class ShortcutKeysComponent {
  readonly keys = input<string[]>([]);
}
