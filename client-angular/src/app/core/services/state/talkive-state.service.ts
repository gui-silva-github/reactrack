import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Unsubscribe } from 'firebase/firestore';
import {
  IChatWithUser,
  IMessage,
  ITalkiveUserData,
} from '../../models/systems/talkive/talkive.model';
import { TalkiveService } from '../talkive/talkive.service';

@Injectable({ providedIn: 'root' })
export class TalkiveStateService implements OnDestroy {
  private readonly talkiveService = inject(TalkiveService);
  private readonly userCache = new Map<string, ITalkiveUserData>();

  private chatsUnsub: Unsubscribe | null = null;
  private messagesUnsub: Unsubscribe | null = null;
  private chatUserUnsub: Unsubscribe | null = null;
  private lastSeenInterval: ReturnType<typeof setInterval> | null = null;

  private readonly userDataSignal = signal<ITalkiveUserData | null>(null);
  private readonly chatDataSignal = signal<IChatWithUser[]>([]);
  private readonly messagesIdSignal = signal<string | null>(null);
  private readonly messagesSignal = signal<IMessage[]>([]);
  private readonly chatUserSignal = signal<ITalkiveUserData | null>(null);
  private readonly chatVisibleSignal = signal(false);

  readonly userData = this.userDataSignal.asReadonly();
  readonly chatData = this.chatDataSignal.asReadonly();
  readonly messagesId = this.messagesIdSignal.asReadonly();
  readonly messages = this.messagesSignal.asReadonly();
  readonly chatUser = this.chatUserSignal.asReadonly();
  readonly chatVisible = this.chatVisibleSignal.asReadonly();

  async loadUserData(uid: string): Promise<void> {
    const userData = await this.talkiveService.loadUserData(uid);
    this.userDataSignal.set(userData);
    this.subscribeToChats(uid);
    this.startLastSeenUpdater(uid);
    this.talkiveService.navigateAfterLogin(userData);
  }

  setChatUser(user: ITalkiveUserData | null): void {
    this.chatUserSignal.set(user);
    if (this.chatUserUnsub) {
      this.chatUserUnsub();
      this.chatUserUnsub = null;
    }

    if (user?.id) {
      this.chatUserUnsub = this.talkiveService.watchUser(user.id, (updated) => {
        this.userCache.set(user.id, updated);
        this.chatUserSignal.update((prev) =>
          prev?.id === user.id ? updated : prev
        );
      });
    }
  }

  setMessagesId(id: string | null): void {
    this.messagesIdSignal.set(id);
    if (this.messagesUnsub) {
      this.messagesUnsub();
      this.messagesUnsub = null;
    }

    if (id) {
      this.messagesUnsub = this.talkiveService.watchMessages(id, (messages) => {
        this.messagesSignal.set(messages);
      });
    } else {
      this.messagesSignal.set([]);
    }
  }

  setChatVisible(visible: boolean): void {
    this.chatVisibleSignal.set(visible);
  }

  clearSession(): void {
    this.userDataSignal.set(null);
    this.chatDataSignal.set([]);
    this.messagesIdSignal.set(null);
    this.messagesSignal.set([]);
    this.chatUserSignal.set(null);
    this.chatVisibleSignal.set(false);
    this.unsubscribeAll();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  private subscribeToChats(userId: string): void {
    if (this.chatsUnsub) this.chatsUnsub();

    this.chatsUnsub = this.talkiveService.watchChats(
      userId,
      this.userCache,
      (chats) => this.chatDataSignal.set(chats)
    );
  }

  private startLastSeenUpdater(uid: string): void {
    if (this.lastSeenInterval) clearInterval(this.lastSeenInterval);

    this.lastSeenInterval = setInterval(() => {
      if (this.talkiveService.auth.currentUser) {
        this.talkiveService.updateUserProfile(uid, { lastSeen: Date.now() }).catch(() => undefined);
      }
    }, 60000);
  }

  private unsubscribeAll(): void {
    if (this.chatsUnsub) this.chatsUnsub();
    if (this.messagesUnsub) this.messagesUnsub();
    if (this.chatUserUnsub) this.chatUserUnsub();
    if (this.lastSeenInterval) clearInterval(this.lastSeenInterval);
    this.chatsUnsub = null;
    this.messagesUnsub = null;
    this.chatUserUnsub = null;
    this.lastSeenInterval = null;
  }
}
