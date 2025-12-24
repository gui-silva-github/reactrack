import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth"
import { getFirestore, setDoc, doc, collection, query, getDocs, where } from "firebase/firestore"
import type { ISignupFirebase, ILoginFirebase, IResetPasswordFirebase } from "./interfaces"
import { toast } from "react-toastify"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const db = getFirestore(app)

const signup = async ({username, email, password}: ISignupFirebase) => {
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user

        try {
            await setDoc(doc(db, "users", user.uid), {
                id: user.uid,
                username: username.toLowerCase(),
                email,
                name: "",
                avatar: "",
                bio: "Olá, eu estou usando o Talkive!",
                lastSeen: Date.now()
            })

            await setDoc(doc(db, "chats", user.uid), {
                chatsData: []
            })
        } catch (firestoreError: any) {
            console.error('Erro ao criar documentos no Firestore:', firestoreError)
            toast.error('Erro ao criar perfil. Tente fazer login novamente.')
            await signOut(auth)
            throw firestoreError
        }
    } catch (error: any){
        const errorMessage = error.code ? error.code.split('/')[1].split('-').join(" ") : error.message
        toast.error(errorMessage)
        throw error
    }
}

const login = async ({email, password}: ILoginFirebase) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any){
        toast.error(error.code.split('/')[1].split('-').join(" "))
    } 
}

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error: any){
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const resetPass = async ({email}: IResetPasswordFirebase) => {
    if (!email){
        toast.error("Digite seu e-mail")
        return 
    }

    try {
        const userRef = collection(db, 'users')
        const q = query(userRef, where("email", "==", email))
        const querySnap = await getDocs(q)

        if (!querySnap.empty){
            await sendPasswordResetEmail(auth, email)
            toast.success("E-mail enviado!")
        } else {
            toast.error("E-mail não existe!")
        }
    } catch (error: any){
        toast.error(error)
    }
}

export { signup, login, logout, auth, db, resetPass}