import { useEffect, useContext, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../api/talkive/config/firebase";
import TalkiveContextProvider, { TalkiveContext } from "../../../context/Talkive/TalkiveContext";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { redirectTalkiveUrl } from "../../../api/urls/talkive";
import './index.sass'

const TalkiveProvider: React.FC = () => {
    return (
        <TalkiveContextProvider>
            <TalkiveProviderContent />
        </TalkiveContextProvider>
    )
}

const TalkiveProviderContent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const talkiveContext = useContext(TalkiveContext);
    const loadUserData = talkiveContext?.loadUserData;
    const userData = talkiveContext?.userData;
    const dataLoadedRef = useRef(false);
    const isLoadingRef = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
            if (user) {
                // Evitar múltiplas chamadas simultâneas
                if (!dataLoadedRef.current && !isLoadingRef.current && loadUserData) {
                    isLoadingRef.current = true;
                    dataLoadedRef.current = true;
                    try {
                        await loadUserData(user.uid);
                    } finally {
                        isLoadingRef.current = false;
                    }
                }
            } else {
                dataLoadedRef.current = false;
                isLoadingRef.current = false;
                // Só navegar se não estiver já na página de login
                if (location.pathname !== redirectTalkiveUrl) {
                    navigate(redirectTalkiveUrl);
                }
            }
        })
        
        return () => unsubscribe();
    }, [loadUserData, navigate, location.pathname])  

    useEffect(() => {
        if (!userData) {
            dataLoadedRef.current = false;
            isLoadingRef.current = false;
        }
    }, [userData])

    return (
        <>
            <ToastContainer />
            <Outlet />
        </>
    )
}

export default TalkiveProvider