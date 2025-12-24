import { useContext, useEffect, useState } from "react";
import assets from "../../../../assets/talkive/ts/assets";
import { TalkiveContext } from "../../../../context/Talkive/TalkiveContext";
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../../api/talkive/config/firebase";
import { toast } from "react-toastify";
import upload from "../../../../api/talkive/lib/upload";
import type { IMessage } from "../../../../context/Talkive/interfaces";
import './ChatBox.sass'

const ChatBox: React.FC = () => {

    const talkiveContext = useContext(TalkiveContext)
    const userData = talkiveContext?.userData;
    const messagesId = talkiveContext?.messagesId;
    const chatUser = talkiveContext?.chatUser;
    const messages = talkiveContext?.messages;
    const setMessages = talkiveContext?.setMessages;
    const chatVisible = talkiveContext?.chatVisible;
    const setChatVisible = talkiveContext?.setChatVisible;

    const [input, setInput] = useState("")

    const sendMessage = async () => {
        try {
            if (input && messagesId && userData && chatUser) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.id, userData.id]

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id)
                    const userChatsSnapshot = await getDoc(userChatsRef)

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data()
                        const chatIndex = userChatData.chatsData.findIndex((c: any) => c.messageId === messagesId)
                        if (chatIndex !== -1) {
                            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
                            userChatData.chatsData[chatIndex].updateAt = Date.now()

                            if (userChatData.chatsData[chatIndex].rId === userData.id) {
                                userChatData.chatsData[chatIndex].messageSeen = false
                            }

                            await updateDoc(userChatsRef, {
                                chatsData: userChatData.chatsData
                            })
                        }
                    }
                })
            }
        } catch (error: any) {
            toast.error(error.message)
        }

        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || !e.target.files[0] || !userData || !chatUser) {
                return;
            }

            const fileUrl = await upload(e.target.files[0])

            if (fileUrl && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date()
                    })
                })
            }

            const userIDs = [chatUser.id, userData.id]

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, 'chats', id)
                const userChatsSnapshot = await getDoc(userChatsRef)

                if (userChatsSnapshot.exists()) {
                    const userChatData = userChatsSnapshot.data()
                    const chatIndex = userChatData.chatsData.findIndex((c: any) => c.messageId === messagesId)
                    if (chatIndex !== -1) {
                        userChatData.chatsData[chatIndex].lastMessage = "Imagem"
                        userChatData.chatsData[chatIndex].updateAt = Date.now()

                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                }
            })
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const convertTimestamp = (timestamp: Timestamp | Date) => {
        let date: Date;
        if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            date = timestamp.toDate();
        }

        const hour = date.getHours();
        const minute = date.getMinutes();
        const displayMinute = minute.toString().padStart(2, '0');

        const day = date.getDate();
        const month = date.getMonth() + 1;

        return `(${day}/${month}) ${hour}:${displayMinute}`;
    }

    useEffect(() => {
        if (messagesId && setMessages) {
            setMessages([])
            
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                const data = res.data();
                if (data && data.messages) {
                    setMessages((data.messages as IMessage[]).reverse())
                }
            })

            return () => {
                unSub()
            }
        } else {
            if (setMessages) {
                setMessages([])
            }
        }
    }, [messagesId, setMessages])

    return chatUser && userData ? (
        <div className='chat-box' style={{ display: `${chatVisible ? '' : ''}`}}>
            <div className="chat-user">
                <img src={chatUser.avatar} alt="Usuário" />
                <p>{chatUser.name} {Date.now() - chatUser.lastSeen <= 70000 ? <img src={assets.green_dot} alt="Nome" className="dot" /> : null}</p>
                <img src={assets.help_icon} className="help" alt="Ajuda" />
                <img onClick={() => setChatVisible && setChatVisible(false)} src={assets.arrow_icon} className="arrow" alt="Seta" />
            </div>

            <div className="chat-msg">
                {messages?.map((msg, index) => (
                    <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
                        {msg.image ?
                            <img className="msg-img" src={msg.image} alt="Imagem" /> : <p className="msg">{msg.text}</p>}
                        <div>
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.avatar} alt="Imagem" />
                            <p>{convertTimestamp(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Enviar mensagem" onKeyDown={handleKeyDown} />
                <input onChange={sendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="Galeria" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt="Enviar" />
            </div>
        </div>
    ) : (
        <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
            <img src={assets.logo_icon} alt="Logo" />
            <p>Converse qualquer hora, em qualquer lugar!</p>
        </div>
    )

}

export default ChatBox