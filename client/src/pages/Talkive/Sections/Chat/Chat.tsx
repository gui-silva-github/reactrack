import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import LeftSideBar from "@/components/Systems/Talkive/LeftSideBar/LeftSideBar"
import ChatBox from "@/components/Systems/Talkive/ChatBox/ChatBox"
import RightSideBar from "@/components/Systems/Talkive/RightSideBar/RightSideBar"
import { TalkiveContext } from "@/context/Talkive/TalkiveContext"
import './Chat.sass'

const ChatTalkive: React.FC = () => {
    const { t } = useTranslation()
    const talkiveContext = useContext(TalkiveContext)
    const chatData = talkiveContext?.chatData
    const userData = talkiveContext?.userData

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (chatData && userData){
            setLoading(false)
        }
    }, [chatData, userData])

    return (
        <div className="chat">
            {
                loading ? <p className="loading">{t('talkive.chat.loading')}</p> :
                <div className="chat-container">
                    <LeftSideBar />
                    <ChatBox />
                    <RightSideBar />
                </div>
            }
        </div>
    )
}

export default ChatTalkive