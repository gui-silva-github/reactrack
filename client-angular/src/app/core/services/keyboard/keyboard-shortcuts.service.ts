import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KeyboardShortcutsService {
  readonly isModalOpen = signal(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  toggleModal(): void {
    this.isModalOpen.update((open) => !open);
  }
}
