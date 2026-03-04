import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGetBackendUrl from "../../hooks/backend/useGetBackendUrl";
import { logoutAPI } from "../../api/logout";
import { sendVerifyOtp } from "../../api/verifyEmail";
import useNavigateSPA from "../../hooks/routes/useNavigateSPA";

import { AppContext } from "../../context/AppContext";

import { toast } from "react-toastify"

import icon from "../../assets/jpg/icon.jpg"
import arrow from "../../assets/svg/arrow.svg"
import Div from "../Html/Div/Div";
import Image from "../Html/Image/Image";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Navbar: React.FC = () => {

    const location = useLocation()
    const { t, i18n } = useTranslation()
    const navigate = useNavigateSPA()

    const isEn = i18n.language === 'en'
    const toggleLang = () => i18n.changeLanguage(isEn ? 'pt' : 'en')

    const { backendUrl } = useGetBackendUrl()

    const context = useContext(AppContext)

    if (!context) {
        throw new Error(t('auth.appContextError'))
    }

    const { userData, setUserData, setIsLoggedIn } = context

    const sendVerificationOtp = async () => {

        try {
            const data = await sendVerifyOtp(backendUrl, { email: userData!.email })

            if (data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }

    }

    const logout = async () => {

        try {
            const data = await logoutAPI(backendUrl)

            data.success && setIsLoggedIn(false)
            data.success && setUserData(null)
            navigate('/')
        } catch (error: any) {
            toast.error(error.message)
        }

    }

    return (
        <Div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
            <div className="pointer flex items-center gap-2" onClick={() => navigate('/')}>
                <Image src={icon} alt={t('common.logo')} className="w-28 sm:w-32 border border-gray-500 dark:border-gray-400 rounded-full h-32" />
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={toggleLang}
                    className="text-sm font-medium px-3 py-2 rounded-full px-3 py-2 transition duration-200 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[2.5rem] border border-gray-500 dark:border-gray-400"
                    title={isEn ? t('common.portugues') : t('common.ingles')}
                    aria-label={isEn ? t('common.portugues') : t('common.ingles')}
                >
                    {isEn ? 'PT' : 'EN'}
                </button>
                <ThemeToggle />
            {userData ? (
                <>
                    <Div className="w-10 h-10 flex justify-center items-center rounded-full bg-black dark:bg-gray-700 text-white relative group">
                        <Div>{userData.name[0].toUpperCase()}</Div>
                        <Div className="absolute hidden group-hover:block top-full right-0 z-10 mt-0.8 w-40 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden">
                            <ul className="py-1 list-none m-0">
                                {!userData.isAccountVerified ? (
                                    <li>
                                        <button type="button" onClick={sendVerificationOtp} className="w-full text-left py-2 px-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            {t('common.verifyEmail')}
                                        </button>
                                    </li>
                                ) : null}
                                <li>
                                    <button type="button" onClick={logout} className="w-full text-left py-2 px-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        {t('common.logout')}
                                    </button>
                                </li>
                            </ul>
                        </Div>
                    </Div>
                </>
            ) : (
                <>
                    {location.pathname === '/' &&  (
                        <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-500 dark:border-gray-400 rounded-full px-6 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            {t('common.login')} <img src={arrow} alt={t('common.iconAlt')} />
                        </button>
                    )}
                    {location.pathname.includes('login') && (
                        <button onClick={() => navigate('/signup')} className="flex items-center gap-2 border border-gray-500 dark:border-gray-400 rounded-full px-6 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            {t('common.signup')} <img src={arrow} alt={t('common.cadastroAlt')} />
                        </button>
                    )}
                    {!location.pathname.includes('login') && location.pathname !== '/' && (
                        <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-500 dark:border-gray-400 rounded-full px-6 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            {t('common.login')} <img src={arrow} alt={t('common.iconAlt')} />
                        </button>
                    )}
                </>
            )}
            </div>
        </Div>
    )

}

export default Navbar