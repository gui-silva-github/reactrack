import React, { createContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { TalkiveContextProviderProps, TalkiveContextType } from "./interfaces";
import type { IUserData, IChatsData, IMessage } from "./interfaces";
import { doc, getDoc, onSnapshot, updateDoc, setDoc } from "firebase/firestore"
import { redirectTalkiveUrl } from "../../api/urls/talkive";
import { auth, db } from "../../api/talkive/config/firebase";
import { useNavigate } from "react-router-dom";

export const TalkiveContext = createContext<TalkiveContextType | null>(null);

const TalkiveContextProvider: React.FC<TalkiveContextProviderProps> = ({ children }) => {

    const navigate = useNavigate()

    const [userData, setUserData] = useState<null | IUserData>(null)
    const [chatData, setChatData] = useState<null | IChatsData[]>(null)
    const [messagesId, setMessagesId] = useState<null | string>(null)
    const [messages, setMessages] = useState<null | IMessage[]>(null)
    const [chatUser, setChatUser] = useState<null | IUserData>(null)

    const [chatVisible, setChatVisible] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const userCacheRef = useRef<Map<string, IUserData>>(new Map())

    const loadUserData = useCallback(async (uid: string) => {
        try{
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef)
            
            let userData: IUserData | null = null

            if (!userSnap.exists()) {
                await setDoc(doc(db, 'users', uid), {
                    id: uid,
                    username: '',
                    email: auth.currentUser?.email || '',
                    name: '',
                    avatar: '',
                    bio: 'Olá, eu estou usando o Talkive!',
                    lastSeen: Date.now()
                })

                await setDoc(doc(db, 'chats', uid), {
                    chatsData: []
                })

                const newUserSnap = await getDoc(userRef)
                userData = newUserSnap.data() as IUserData
            } else {
                userData = userSnap.data() as IUserData
            }

            if (!userData) {
                console.error('Erro: Não foi possível obter dados do usuário')
                return
            }

            setUserData(userData)

            const chatRef = doc(db, 'chats', uid)
            const chatSnap = await getDoc(chatRef)
            if (!chatSnap.exists()) {
                await setDoc(chatRef, {
                    chatsData: []
                })
            }
            
            if (userData.avatar && userData.name){
                navigate(`${redirectTalkiveUrl}/chat`)
            } else {
                navigate(`${redirectTalkiveUrl}/profile`)
            }

            await updateDoc(userRef, {
                lastSeen: Date.now()
            })

            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            intervalRef.current = setInterval(async () => {
                if (auth.currentUser){
                    try {
                        await updateDoc(userRef, {
                            lastSeen: Date.now()
                        })
                    } catch (error) {
                        console.error('Erro ao atualizar lastSeen:', error)
                    }
                }
            }, 60000)
        } catch (error){
            console.error('Erro ao carregar dados do usuário:', error)
        }
    }, [navigate])

    useEffect(() => {
        if (userData){
            const chatRef = doc(db, 'chats', userData.id)

            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res?.data()?.chatsData
                const tempData: (IChatsData & { userData?: any })[] = []

                if (chatItems && Array.isArray(chatItems)) {
                    const userIds = chatItems.map(item => item.rId)
                    const uniqueUserIds = [...new Set(userIds)]                    

                    const usersToFetch = uniqueUserIds.filter(id => !userCacheRef.current.has(id))
                    
                    const fetchPromises = usersToFetch.map(async (userId) => {
                        try {
                            const userRef = doc(db, 'users', userId)
                            const userSnap = await getDoc(userRef)
                            const userData = userSnap.data() as IUserData | undefined
                            if (userData) {
                                userCacheRef.current.set(userId, userData)
                            }
                        } catch (error) {
                            console.error('Erro ao buscar dados do usuário no chat:', error)
                        }
                    })
                    
                    await Promise.all(fetchPromises)

                    for (const item of chatItems){
                        const cachedUserData = userCacheRef.current.get(item.rId)
                        if (cachedUserData) {
                            tempData.push({...item, userData: cachedUserData})
                        }
                    }
                }

                setChatData(tempData.sort((a, b) => b.updateAt - a.updateAt) as IChatsData[])
            })

            return () => {
                unSub()
            }
        }
    }, [userData])

    useEffect(() => {
        if (!chatUser?.id || !setChatUser) return

        const userId = chatUser.id
        const userRef = doc(db, 'users', userId)
        
        const unSub = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const updatedUserData = snapshot.data() as IUserData
                setChatUser(prev => {
                    if (!prev || prev.id !== userId) return prev   
                    if (updatedUserData.lastSeen !== prev.lastSeen || 
                        updatedUserData.avatar !== prev.avatar ||
                        updatedUserData.name !== prev.name ||
                        updatedUserData.bio !== prev.bio) {
                        userCacheRef.current.set(userId, updatedUserData)
                        return updatedUserData
                    }
                    return prev
                })
            }
        })

        return () => {
            unSub()
        }
    }, [chatUser?.id, setChatUser])

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const value = useMemo(() => ({
        userData, setUserData,
        chatData, setChatData, 
        loadUserData, messages, 
        setMessages, messagesId,
        setMessagesId, chatUser,
        setChatUser, chatVisible, setChatVisible
    }), [userData, chatData, loadUserData, messages, messagesId, chatUser, chatVisible])

    return (
        <TalkiveContext.Provider value={value}>
            {children}
        </TalkiveContext.Provider>
    );
};

export default TalkiveContextProvider;