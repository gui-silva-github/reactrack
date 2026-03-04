import type { IUserData } from "../../interfaces/userData"

export type ThemeMode = 'light' | 'dark'

export interface IAppContext {
    backendUrl: string;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userData: IUserData | null;
    setUserData: React.Dispatch<React.SetStateAction<IUserData | null>>;
    getUserData: () => Promise<void>;
    theme: ThemeMode;
    setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
}