import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  Firestore,
  Unsubscribe,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { TALKIVE_REDIRECT_URL } from '../../constants/api-urls';
import {
  IChatWithUser,
  IChatsData,
  ILoginFirebase,
  IMessage,
  IResetPasswordFirebase,
  ISignupFirebase,
  ITalkiveUserData,
} from '../../models/systems/talkive/talkive.model';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class TalkiveService {
  private readonly config = inject(ConfigService);
  private readonly router = inject(Router);

  private readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly db: Firestore;

  constructor() {
    this.app = initializeApp(this.config.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  authStateChanges(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      return () => unsubscribe();
    });
  }

  async signup({ username, email, password }: ISignupFirebase): Promise<void> {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = res.user;

    await setDoc(doc(this.db, 'users', user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: '',
      avatar: '',
      bio: 'Olá, eu estou usando o Talkive!',
      lastSeen: Date.now(),
    });

    await setDoc(doc(this.db, 'chats', user.uid), { chatsData: [] });
  }

  async login({ email, password }: ILoginFirebase): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate([TALKIVE_REDIRECT_URL]);
  }

  async resetPassword({ email }: IResetPasswordFirebase): Promise<boolean> {
    if (!email) return false;

    const userRef = collection(this.db, 'users');
    const q = query(userRef, where('email', '==', email));
    const querySnap = await getDocs(q);

    if (querySnap.empty) return false;

    await sendPasswordResetEmail(this.auth, email);
    return true;
  }

  async loadUserData(uid: string): Promise<ITalkiveUserData> {
    const userRef = doc(this.db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: uid,
        username: '',
        email: this.auth.currentUser?.email || '',
        name: '',
        avatar: '',
        bio: 'Olá, eu estou usando o Talkive!',
        lastSeen: Date.now(),
      });

      await setDoc(doc(this.db, 'chats', uid), { chatsData: [] });
      const newUserSnap = await getDoc(userRef);
      return newUserSnap.data() as ITalkiveUserData;
    }

    const chatRef = doc(this.db, 'chats', uid);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, { chatsData: [] });
    }

    await updateDoc(userRef, { lastSeen: Date.now() });
    return userSnap.data() as ITalkiveUserData;
  }

  watchChats(
    userId: string,
    userCache: Map<string, ITalkiveUserData>,
    callback: (chats: IChatWithUser[]) => void
  ): Unsubscribe {
    const chatRef = doc(this.db, 'chats', userId);

    return onSnapshot(chatRef, async (snapshot) => {
      const chatItems = snapshot.data()?.['chatsData'] as IChatsData[] | undefined;
      const tempData: IChatWithUser[] = [];

      if (chatItems && Array.isArray(chatItems)) {
        const uniqueUserIds = [...new Set(chatItems.map((item) => item.rId))];
        const usersToFetch = uniqueUserIds.filter((id) => !userCache.has(id));

        await Promise.all(
          usersToFetch.map(async (id) => {
            const userSnap = await getDoc(doc(this.db, 'users', id));
            const data = userSnap.data() as ITalkiveUserData | undefined;
            if (data) userCache.set(id, data);
          })
        );

        for (const item of chatItems) {
          const cachedUser = userCache.get(item.rId);
          if (cachedUser) {
            tempData.push({ ...item, userData: cachedUser });
          }
        }
      }

      callback(tempData.sort((a, b) => b.updateAt - a.updateAt));
    });
  }

  watchUser(userId: string, callback: (user: ITalkiveUserData) => void): Unsubscribe {
    const userRef = doc(this.db, 'users', userId);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as ITalkiveUserData);
      }
    });
  }

  watchMessages(messageId: string, callback: (messages: IMessage[]) => void): Unsubscribe {
    const messageRef = doc(this.db, 'messages', messageId);
    return onSnapshot(messageRef, (snapshot) => {
      const messages = snapshot.data()?.['messages'] as IMessage[] | undefined;
      callback([...(messages ?? [])].reverse());
    });
  }

  async createChat(
    currentUser: ITalkiveUserData,
    targetUser: ITalkiveUserData
  ): Promise<string> {
    const messagesRef = doc(collection(this.db, 'messages'));

    await setDoc(messagesRef, {
      createAt: serverTimestamp(),
      messages: [],
    });

    const chatEntry = {
      messageId: messagesRef.id,
      lastMessage: '',
      updateAt: Date.now(),
      messageSeen: true,
    };

    await updateDoc(doc(this.db, 'chats', currentUser.id), {
      chatsData: arrayUnion({ ...chatEntry, rId: targetUser.id }),
    });

    await updateDoc(doc(this.db, 'chats', targetUser.id), {
      chatsData: arrayUnion({ ...chatEntry, rId: currentUser.id }),
    });

    return messagesRef.id;
  }

  async markChatSeen(userId: string, messageId: string): Promise<void> {
    const userChatsRef = doc(this.db, 'chats', userId);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();

    if (!userChatsData?.['chatsData']) return;

    const chatsData = [...(userChatsData['chatsData'] as IChatsData[])];
    const chatIndex = chatsData.findIndex((chat) => chat.messageId === messageId);

    if (chatIndex !== -1 && !chatsData[chatIndex].messageSeen) {
      chatsData[chatIndex] = { ...chatsData[chatIndex], messageSeen: true };
      await updateDoc(userChatsRef, { chatsData });
    }
  }

  chatAlreadyExists(chatData: IChatWithUser[], targetUserId: string): boolean {
    return chatData.some((chat) => chat.rId === targetUserId);
  }

  async updateUserProfile(uid: string, data: Partial<ITalkiveUserData>): Promise<void> {
    await updateDoc(doc(this.db, 'users', uid), data);
  }

  async searchUserByUsername(username: string, currentUserId: string): Promise<ITalkiveUserData | null> {
    const userRef = collection(this.db, 'users');
    const q = query(userRef, where('username', '==', username.toLowerCase()));
    const querySnap = await getDocs(q);

    if (querySnap.empty) return null;

    const user = querySnap.docs[0].data() as ITalkiveUserData;
    return user.id !== currentUserId ? user : null;
  }

  async sendMessage(
    messagesId: string,
    senderId: string,
    chatUserId: string,
    text: string
  ): Promise<void> {
    await updateDoc(doc(this.db, 'messages', messagesId), {
      messages: arrayUnion({ sId: senderId, text, createdAt: new Date() }),
    });

    await this.updateChatPreview(messagesId, senderId, chatUserId, text.slice(0, 30));
  }

  async sendImageMessage(
    messagesId: string,
    senderId: string,
    chatUserId: string,
    imageUrl: string
  ): Promise<void> {
    await updateDoc(doc(this.db, 'messages', messagesId), {
      messages: arrayUnion({ sId: senderId, image: imageUrl, createdAt: new Date() }),
    });

    await this.updateChatPreview(messagesId, senderId, chatUserId, 'Imagem');
  }

  private async updateChatPreview(
    messagesId: string,
    senderId: string,
    chatUserId: string,
    lastMessage: string
  ): Promise<void> {
    for (const id of [chatUserId, senderId]) {
      const userChatsRef = doc(this.db, 'chats', id);
      const userChatsSnapshot = await getDoc(userChatsRef);

      if (!userChatsSnapshot.exists()) continue;

      const userChatData = userChatsSnapshot.data();
      const chatsData = [...(userChatData['chatsData'] as IChatsData[])];
      const chatIndex = chatsData.findIndex((chat) => chat.messageId === messagesId);

      if (chatIndex === -1) continue;

      chatsData[chatIndex] = {
        ...chatsData[chatIndex],
        lastMessage,
        updateAt: Date.now(),
        messageSeen: chatsData[chatIndex].rId !== senderId ? false : chatsData[chatIndex].messageSeen,
      };

      await updateDoc(userChatsRef, { chatsData });
    }
  }

  navigateAfterLogin(userData: ITalkiveUserData): void {
    if (userData.avatar && userData.name) {
      this.router.navigate([`${TALKIVE_REDIRECT_URL}/chat`]);
    } else {
      this.router.navigate([`${TALKIVE_REDIRECT_URL}/profile`]);
    }
  }
}
