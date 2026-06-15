export interface ITalkiveUserData {
  avatar: string;
  bio: string;
  email: string;
  id: string;
  lastSeen: number;
  name: string;
  username: string;
}

export interface IChatsData {
  lastMessage: string;
  messageId: string;
  messageSeen: boolean;
  rId: string;
  updateAt: number;
}

export interface IChatWithUser extends IChatsData {
  userData?: ITalkiveUserData;
}

export interface IMessage {
  sId: string;
  text?: string;
  image?: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

export interface ISignupFirebase {
  username: string;
  email: string;
  password: string;
}

export interface ILoginFirebase {
  email: string;
  password: string;
}

export interface IResetPasswordFirebase {
  email: string;
}
