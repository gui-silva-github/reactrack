import { useContext, useEffect, useState } from "react"
import LeftSideBar from "../../../../components/Systems/Talkive/LeftSideBar/LeftSideBar"
import ChatBox from "../../../../components/Systems/Talkive/ChatBox/ChatBox"
import RightSideBar from "../../../../components/Systems/Talkive/RightSideBar/RightSideBar"
import { TalkiveContext } from "../../../../context/Talkive/TalkiveContext"
import './Chat.sass'

const ChatTalkive: React.FC = () => {
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
                loading ? <p className="loading">Carregando...</p> :
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