import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useNavigateSPA from "@/hooks/routes/useNavigateSPA";
import { AppContext } from "@/context/AppContext";
import icon from "@/assets/jpg/icon.jpg"
import Div from "@/components/Html/Div/Div";
import Image from "@/components/Html/Image/Image";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

const navLinkKeys: { key: string; path: string }[] = [
    { key: "talkive", path: "/systems/talkive" },
    { key: "opinions", path: "/systems/opinly" },
    { key: "events", path: "/systems/convene" },
    { key: "movies", path: "/systems/movies" },
    { key: "investments", path: "/systems/investments" },
    { key: "projects", path: "/systems/projects" },
    { key: "gym", path: "/systems/fit" },
    { key: "crypto", path: "/systems/crypto" },
];

const NavbarSystems: React.FC = () => {

    const location = useLocation()
    const { t, i18n } = useTranslation()
    const navigate = useNavigateSPA()

    const isEn = i18n.language === 'en'
    const toggleLang = () => i18n.changeLanguage(isEn ? 'pt' : 'en')

    const context = useContext(AppContext)

    if (!context) {
        throw new Error(t('auth.appContextError'))
    }

    const { userData } = context

    const linkClasses = (path: string) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
        return `text-sm font-medium px-3 py-2 rounded-md transition duration-200 
         ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`;
    }; 
    
    const filteredNavLinks = navLinkKeys.filter(link => {
        if (!userData && link.path === '/systems') {
            return false;
        }
        return true;
    });

    return (
        <Div className="w-full flex justify-between items-center px-4 sm:px-12 py-3 bg-white dark:bg-gray-900 shadow-lg fixed top-0 z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
                <Image src={icon} alt={t('common.logoReactRack')} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600" />
                <span className="text-xl font-bold text-gray-800 dark:text-gray-50 hidden sm:block">{t('common.reactRack')}</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
                <button
                    type="button"
                    onClick={toggleLang}
                    className="text-sm font-medium px-3 py-2 rounded-md transition duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[2.5rem]"
                    title={isEn ? t('common.portugues') : t('common.ingles')}
                    aria-label={isEn ? t('common.portugues') : t('common.ingles')}
                >
                    {isEn ? 'PT' : 'EN'}
                </button>
                <ThemeToggle />
                {filteredNavLinks.map((link) => (
                    <a
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={linkClasses(link.path)}
                    >
                        {t(`nav.${link.key}`)}
                    </a>
                ))}
            </div>
        </Div>
    )

}

export default NavbarSystems