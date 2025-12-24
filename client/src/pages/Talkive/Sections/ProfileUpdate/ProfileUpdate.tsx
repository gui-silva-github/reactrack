import { useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../../api/talkive/config/firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from '../../../../api/talkive/config/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../../../api/talkive/lib/upload'
import assets from '../../../../assets/talkive/ts/assets'
import { TalkiveContext } from '../../../../context/Talkive/TalkiveContext'
import { redirectTalkiveUrl } from '../../../../api/urls/talkive'
import './ProfileUpdate.sass'
import { FaArrowLeft } from 'react-icons/fa'

const ProfileUpdateTalkive: React.FC = () => {
    const navigate = useNavigate()

    const [image, setImage] = useState<File | null>(null)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [uid, setUid] = useState('')
    const [prevImage, setPrevImage] = useState('')

    const talkiveContext = useContext(TalkiveContext)
    const setUserData = talkiveContext?.setUserData

    const profileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            if (!prevImage && !image) {
                toast.error("Atualize a foto de perfil")
            }

            const docRef = doc(db, "users", uid)

            if (image) {
                const imgUrl = await upload(image)
                setPrevImage(imgUrl as string)

                await updateDoc(docRef, {
                    bio: bio,
                    name: name,
                    avatar: imgUrl as string
                })
            } else {
                await updateDoc(docRef, {
                    bio: bio,
                    name: name
                })
            }

            const snap = await getDoc(docRef)
            const data = snap.data();
            if (data) {
                const updatedUserData = {
                    id: uid,
                    name: data.name || '',
                    bio: data.bio || '',
                    email: data.email || '',
                    avatar: data.avatar || '',
                    username: data.username || '',
                    lastSeen: data.lastSeen ?? null
                };
                setUserData && setUserData(updatedUserData);

                navigate(`${redirectTalkiveUrl}/chat`);
            } else {
                toast.error('Erro ao obter dados do usuário atualizados.');
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid)
                const docRef = doc(db, "users", user.uid)
                const docSnap = await getDoc(docRef)
                const data = docSnap.data();
                if (data?.name) {
                    setName(data.name)
                }
                if (data?.bio) {
                    setBio(data.bio)
                }
                if (data?.avatar) {
                    setPrevImage(data.avatar)
                }
            } else {
                navigate('/')
            }
        })

        return () => unsubscribe()
    }, [navigate])

    return (
        <div className='profile'>
            <div className='profile-container'>
                <form onSubmit={profileUpdate}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Detalhes do perfil</h3>
                        <FaArrowLeft size={30} style={{ cursor: 'pointer' }} color='#077eff' onClick={() => navigate(`${redirectTalkiveUrl}/chat`)} />
                    </div>
                    <label htmlFor="avatar">
                        <input
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                            type='file'
                            id='avatar'
                            accept='.png, .jpg, .jpeg'
                            hidden
                        />
                        <img
                            src={image && image instanceof Blob
                                ? URL.createObjectURL(image)
                                : assets.avatar_icon
                            }
                            alt='Avatar'
                        />
                        Upload da imagem
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type='text'
                        placeholder="Seu nome"
                        required
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder='Escreva sua bio'
                        required
                        maxLength={300}
                    ></textarea>
                    <button type='submit'>Salvar</button>
                </form>
                <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt='Logo' />
            </div>
        </div>
    )
}

export default ProfileUpdateTalkive