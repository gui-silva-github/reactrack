import { Component, computed, inject } from '@angular/core';
import { TALKIVE_ASSETS } from '@/assets/talkive/ts/assets';
import { I18nService } from '@/app/core/services/i18n/i18n.service';
import { TalkiveStateService } from '@/app/core/services/state/talkive-state.service';
import { TalkiveService } from '@/app/core/services/talkive/talkive.service';

@Component({
  selector: 'app-talkive-right-sidebar',
  standalone: true,
  templateUrl: './right-sidebar.component.html',
})
export class TalkiveRightSidebarComponent {
  readonly assets = TALKIVE_ASSETS;
  readonly talkiveState = inject(TalkiveStateService);
  private readonly talkiveService = inject(TalkiveService);
  readonly i18n = inject(I18nService);

  readonly mediaImages = computed(() => {
    const images = new Set<string>();
    for (const msg of this.talkiveState.messages()) {
      if (msg.image) {
        images.add(msg.image);
      }
    }
    return Array.from(images);
  });

  isOnline(lastSeen: number): boolean {
    return Date.now() - lastSeen <= 70000;
  }

  async logout(): Promise<void> {
    await this.talkiveService.logout();
  }

  openImage(url: string): void {
    window.open(url, '_blank');
  }
}
