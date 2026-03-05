import { useContext, useEffect, useState } from "react";
import assets from "../../../../assets/talkive/ts/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, getDocs, query, serverTimestamp, setDoc, updateDoc, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../api/talkive/config/firebase";
import { logout } from "../../../../api/talkive/config/firebase";
import { redirectTalkiveUrl } from "../../../../api/urls/talkive";
import { TalkiveContext } from "../../../../context/Talkive/TalkiveContext";
import type { IUserData, IChatsData } from "../../../../context/Talkive/interfaces";
import { toast } from "react-toastify";
import i18n from "../../../../i18n";
import './LeftSideBar.sass'

type ChatItem = IChatsData & { userData?: IUserData };

const LeftSideBar: React.FC = () => {
    const navigate = useNavigate();

    const context = useContext(TalkiveContext);
    const userData = context?.userData;
    const chatData = context?.chatData;
    const chatUser = context?.chatUser;
    const setChatUser = context?.setChatUser;
    const setMessagesId = context?.setMessagesId;
    const messagesId = context?.messagesId;
    const chatVisible = context?.chatVisible;
    const setChatVisible = context?.setChatVisible;

    const [user, setUser] = useState<IUserData | null>(null);
    const [showSearch, setShowSearch] = useState(false);

    const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const input = e.target.value

            if (input) {
                setShowSearch(true)

                const userRef = collection(db, 'users')

                const q = query(userRef, where("username", '==', input.toLowerCase()))
                const querySnap = await getDocs(q)
 
                if (
                    !querySnap.empty &&
                    querySnap.docs[0].data().id !== userData?.id
                ) {
                    let userExist = false;

                    chatData?.forEach((user) => {
                        if (user.rId === querySnap.docs[0].data().id) {
                            userExist = true
                        }
                    })

                    if (!userExist) {
                        setUser(querySnap.docs[0].data() as any);
                    } else {
                        setUser(null);
                    }
                }
            } else {
                setShowSearch(false)
            }
        } catch (error) {
            console.error(error)
        }

    }

    const addChat = async () => {
        if (!user || !userData) {
            toast.error(i18n.t('talkive.errors.userDataNotAvailable'));
            return;
        }

        const messagesRef = collection(db, 'messages')
        const chatsRef = collection(db, 'chats')

        try {
            const newMessageRef = doc(messagesRef)

            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(chatsRef, user.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updateAt: Date.now(),
                    messageSeen: true,
                })
            })

            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: user.id,
                    updateAt: Date.now(),
                    messageSeen: true,
                })
            })

            const chatItem: ChatItem = {
                messageId: newMessageRef.id,
                lastMessage: "",
                rId: user.id,
                updateAt: Date.now(),
                messageSeen: true,
                userData: user as IUserData
            };
            
            setChat(chatItem);
            setShowSearch(false)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const setChat = async (item: ChatItem) => {
        if (!userData) {
            toast.error(i18n.t('talkive.errors.userDataNotAvailable'));
            return;
        }

        if (setMessagesId) {
            setMessagesId(item.messageId);
        }
        
        if (setChatUser && item.userData) {
            setChatUser(item.userData);
        }

        if (setChatVisible) {
            setChatVisible(true);
        }

        try {
            const userChatsRef = doc(db, 'chats', userData.id)
            const userChatsSnapshot = await getDoc(userChatsRef)
            const userChatsData = userChatsSnapshot.data()

            if (userChatsData && userChatsData.chatsData) {
                const chatIndex = userChatsData.chatsData.findIndex((c: any) => c.messageId === item.messageId)
                if (chatIndex !== -1 && !userChatsData.chatsData[chatIndex].messageSeen) {
                    userChatsData.chatsData[chatIndex].messageSeen = true
                    await updateDoc(userChatsRef, {
                        chatsData: userChatsData.chatsData
                    })
                }
            }
        } catch (error: any) {
            console.error('Erro ao atualizar messageSeen:', error)
        }
    }

    useEffect(() => {
        const updateChatUserData = async () => {
            if (chatUser && setChatUser && chatData) {
                const chatExists = chatData.some(chat => chat.rId === chatUser.id)
                
                if (chatExists) {
                    const userRef = doc(db, 'users', chatUser.id)
                    const userSnap = await getDoc(userRef)
                    const updatedUserData = userSnap.data() as IUserData | undefined
                    
                    if (updatedUserData) {
                        if (updatedUserData.avatar !== chatUser.avatar || 
                            updatedUserData.name !== chatUser.name ||
                            updatedUserData.bio !== chatUser.bio) {
                            setChatUser(updatedUserData)
                        }
                    }
                }
            }
        }

        const timeoutId = setTimeout(() => {
            updateChatUserData()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [chatData, chatUser, setChatUser])

    return (
        <div className='ls' style={{ display: `${chatVisible ? 'hidden' : ''}` }}>
            <div className="ls-top">
                <div className="ls-nav">
                    <img src={assets.logoT} alt={i18n.t('common.logo')} className="logo" />
                    <div className="menu">
                        <img src={assets.menu_icon} alt={i18n.t('common.iconAlt')} />
                        <div className="sub-menu">
                            <p onClick={() => navigate(`${redirectTalkiveUrl}/profile`)}>{i18n.t('talkive.chat.editProfile')}</p>
                            <hr />
                            <p onClick={() => logout()}>{i18n.t('common.logout')}</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt={i18n.t('talkive.chat.search')} />
                    <input onChange={inputHandler} type="text" placeholder={i18n.t('talkive.chat.search')} />
                </div>
            </div>
            <div className="ls-list">
                {showSearch && user ?
                    <div onClick={addChat} className="friends add-user">
                        <img src={user.avatar} alt={i18n.t('talkive.userAlt')} />
                        <p>{user.name}</p>
                    </div>
                    :
                    chatData && chatData.length > 0 ? chatData.map((item, index) => {
                        const chatItem = item as ChatItem;
                        return (
                            <div onClick={() => setChat(chatItem)} key={index} className={`friends ${chatItem.messageSeen || chatItem.messageId === messagesId ? "" : "border"}`}>
                                <img src={chatItem.userData?.avatar || ""} alt={i18n.t('talkive.profileAlt')} />
                                <div>
                                    <p>{chatItem.userData?.name || ""}</p>
                                    <span>{chatItem.lastMessage}</span>
                                </div>
                            </div>
                        )
                    }                    ) : (
                        <div className="no-chats">
                            <p>{i18n.t('talkive.chat.noMessageFound')}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )

}

export default LeftSideBar