import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { IAppContext, ThemeMode } from "../interfaces/context"
import type { IUserData } from "../interfaces/userData"
import { getUserDataAPI } from "../api/userData"
import { getAuthStateAPI } from "../api/authState"

const THEME_STORAGE_KEY = 'reactrack-theme'

function getStoredTheme(): ThemeMode {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
        return stored === 'dark' || stored === 'light' ? stored : 'light'
    } catch {
        return 'light'
    }
}

export const AppContext = createContext<IAppContext | null>(null)

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [userData, setUserData] = useState<IUserData | null>(null)

    const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme)

    const setTheme = (value: React.SetStateAction<ThemeMode>) => {
        setThemeState((prev) => {
            const next = typeof value === 'function' ? value(prev) : value
            try {
                localStorage.setItem(THEME_STORAGE_KEY, next)
                document.documentElement.classList.toggle('dark', next === 'dark')
            } catch (_) {}
            return next
        })
    }

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    const getAuthState = async () => {
        try {
            const data = await getAuthStateAPI(backendUrl)

            if (data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const data = await getUserDataAPI(backendUrl)

            if (data.success) {
                const userDataToSet = data.userData ?? null
                setUserData(userDataToSet)
            } else {
                toast.error(data.message)
                setUserData(null);
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        theme,
        setTheme
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}