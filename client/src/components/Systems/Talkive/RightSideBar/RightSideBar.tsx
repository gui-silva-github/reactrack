import { useContext, useEffect, useState } from "react";
import assets from "../../../../assets/talkive/ts/assets";
import { logout } from "../../../../api/talkive/config/firebase";
import { TalkiveContext } from "../../../../context/Talkive/TalkiveContext";
import './RightSideBar.sass'

const RightSideBar: React.FC = () => {
    const talkiveContext = useContext(TalkiveContext)
    const chatUser = talkiveContext?.chatUser
    const messages = talkiveContext?.messages

    const [msgImages, setMsgImages] = useState<string[]>([])

    useEffect(() => {
        if (!messages || messages.length === 0) {
            setMsgImages([])
            return
        }

        const imageSet = new Set<string>()
        messages.forEach((msg) => {
            if (msg.image){
                imageSet.add(msg.image)
            }
        })
        setMsgImages(Array.from(imageSet))
    }, [messages])

    return chatUser ? (
        <div className="rs"> 
            <div className="rs-profile">
                <img src={chatUser.avatar} alt="Perfil" />
                <h3>{Date.now() - chatUser.lastSeen <= 70000 ? <img src={assets.green_dot} className="dot" alt="Online" /> : null} {chatUser.name}</h3>
                <p>{chatUser.bio}</p>
            </div>
            <hr />
            <div className="rs-media">
                <p>Media</p>
                <div>
                    {msgImages.map((url, index) => (
                        <img onClick={() => window.open(url)} key={index} src={url} alt={`Imagem ${index}`} />
                    ))}
                </div>
            </div>
            <button onClick={() => logout()}>Logout</button>
        </div>
    ) : (
        <div className="rs">
            <button onClick={() => logout()}>Logout</button>
        </div>
    )

}

export default RightSideBar