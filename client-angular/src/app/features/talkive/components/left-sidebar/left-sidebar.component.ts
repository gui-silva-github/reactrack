import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TALKIVE_ASSETS } from '@/assets/talkive/ts/assets';
import { TALKIVE_REDIRECT_URL } from '@/app/core/constants/api-urls';
import { IChatWithUser, ITalkiveUserData } from '@/app/core/models/systems/talkive/talkive.model';
import { I18nService } from '@/app/core/services/i18n/i18n.service';
import { TalkiveStateService } from '@/app/core/services/state/talkive-state.service';
import { TalkiveService } from '@/app/core/services/talkive/talkive.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'app-talkive-left-sidebar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './left-sidebar.component.html',
})
export class TalkiveLeftSidebarComponent {
  readonly assets = TALKIVE_ASSETS;
  readonly talkiveState = inject(TalkiveStateService);
  private readonly talkiveService = inject(TalkiveService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  menuOpen = signal(false);
  showSearch = signal(false);
  searchUser = signal<ITalkiveUserData | null>(null);

  async onSearchInput(event: Event): Promise<void> {
    const input = (event.target as HTMLInputElement).value.trim();
    const userData = this.talkiveState.userData();

    if (!input || !userData) {
      this.showSearch.set(false);
      this.searchUser.set(null);
      return;
    }

    this.showSearch.set(true);
    const user = await this.talkiveService.searchUserByUsername(input, userData.id);

    if (user && !this.talkiveService.chatAlreadyExists(this.talkiveState.chatData(), user.id)) {
      this.searchUser.set(user);
    } else {
      this.searchUser.set(null);
    }
  }

  async addChat(): Promise<void> {
    const user = this.searchUser();
    const userData = this.talkiveState.userData();

    if (!user || !userData) {
      this.toastService.error(this.i18n.t('talkive.errors.userDataNotAvailable'));
      return;
    }

    try {
      const messageId = await this.talkiveService.createChat(userData, user);
      this.selectChat({
        messageId,
        lastMessage: '',
        rId: user.id,
        updateAt: Date.now(),
        messageSeen: true,
        userData: user,
      });
      this.showSearch.set(false);
      this.searchUser.set(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : this.i18n.t('talkive.errors.createProfile');
      this.toastService.error(message);
    }
  }

  selectChat(item: IChatWithUser): void {
    const userData = this.talkiveState.userData();
    if (!userData) {
      this.toastService.error(this.i18n.t('talkive.errors.userDataNotAvailable'));
      return;
    }

    if (item.userData) {
      this.talkiveState.setChatUser(item.userData);
    }
    this.talkiveState.setMessagesId(item.messageId);
    this.talkiveState.setChatVisible(true);

    this.talkiveService.markChatSeen(userData.id, item.messageId).catch(() => undefined);
  }

  goToProfile(): void {
    this.menuOpen.set(false);
    this.router.navigate([`${TALKIVE_REDIRECT_URL}/profile`]);
  }

  async logout(): Promise<void> {
    this.menuOpen.set(false);
    await this.talkiveService.logout();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
