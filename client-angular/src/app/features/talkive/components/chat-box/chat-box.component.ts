import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TALKIVE_ASSETS } from '@/assets/talkive/ts/assets';
import { formatTalkiveTimestamp } from '@/app/core/utils/talkive/timestamp.util';
import { IMessage } from '@/app/core/models/systems/talkive/talkive.model';
import { CloudinaryService } from '@/app/core/services/cloudinary/cloudinary.service';
import { I18nService } from '@/app/core/services/i18n/i18n.service';
import { TalkiveStateService } from '@/app/core/services/state/talkive-state.service';
import { TalkiveService } from '@/app/core/services/talkive/talkive.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'app-talkive-chat-box',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-box.component.html',
})
export class TalkiveChatBoxComponent {
  readonly assets = TALKIVE_ASSETS;
  readonly talkiveState = inject(TalkiveStateService);
  private readonly talkiveService = inject(TalkiveService);
  private readonly cloudinary = inject(CloudinaryService);
  private readonly toastService = inject(ToastService);
  readonly i18n = inject(I18nService);

  draft = signal('');

  isOnline(lastSeen: number): boolean {
    return Date.now() - lastSeen <= 70000;
  }

  formatTimestamp(message: IMessage): string {
    return formatTalkiveTimestamp(message.createdAt);
  }

  async sendMessage(): Promise<void> {
    const text = this.draft().trim();
    const user = this.talkiveState.userData();
    const chatUser = this.talkiveState.chatUser();
    const messagesId = this.talkiveState.messagesId();

    if (!text || !user || !chatUser || !messagesId) return;

    try {
      await this.talkiveService.sendMessage(messagesId, user.id, chatUser.id, text);
      this.draft.set('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : this.i18n.t('talkive.errors.createProfile');
      this.toastService.error(message);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const user = this.talkiveState.userData();
    const chatUser = this.talkiveState.chatUser();
    const messagesId = this.talkiveState.messagesId();

    if (!file || !user || !chatUser || !messagesId) return;

    try {
      const imageUrl = await firstValueFrom(this.cloudinary.upload(file));
      await this.talkiveService.sendImageMessage(messagesId, user.id, chatUser.id, imageUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : this.i18n.t('talkive.errors.createProfile');
      this.toastService.error(message);
    } finally {
      input.value = '';
    }
  }

  closeChat(): void {
    this.talkiveState.setChatVisible(false);
  }
}
