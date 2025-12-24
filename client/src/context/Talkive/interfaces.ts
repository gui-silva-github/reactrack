import type { ReactNode } from "react";
import type { Timestamp } from "firebase/firestore";

export interface IUserData {
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

export interface IMessage {
    sId: string;
    text?: string;
    image?: string;
    createdAt: Timestamp | Date;
}

export interface TalkiveContextType {
    userData: IUserData | null;
    setUserData: React.Dispatch<React.SetStateAction<IUserData | null>>;
    chatData: IChatsData[] | null;
    setChatData: React.Dispatch<React.SetStateAction<IChatsData[] | null>>;
    messagesId: string | null;
    setMessagesId: React.Dispatch<React.SetStateAction<string | null>>;
    messages: IMessage[] | null;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[] | null>>;
    chatUser: IUserData | null;
    setChatUser: React.Dispatch<React.SetStateAction<IUserData | null>>;
    chatVisible: boolean;
    setChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
    loadUserData: (uid: string) => void;
}

export interface TalkiveContextProviderProps {
    children: ReactNode;
}