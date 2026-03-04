import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { AppContext } from "../../context/AppContext";

import useNavigateSPA from "../../hooks/routes/useNavigateSPA";

import Image from "../Html/Image/Image"
import Header2 from "../Html/Header2/Header2";
import Div from "../Html/Div/Div";
import Button from "../Html/Button/Button"
import Paragraph from "../Html/Paragraph/Paragraph";
import HeaderImg from "../Html/HeaderImg/HeaderImg";

import header from "../../assets/png/header.png"
import hand from "../../assets/png/hand.png"

const HeaderSystems: React.FC = () => {

    const { t } = useTranslation()
    const navigate = useNavigateSPA()

    const context = useContext(AppContext)

    if (!context) {
        throw new Error(t('auth.appContextError'))
    }

    const { userData } = context
    const name = userData ? userData.name : t('home.user')

   return (
        <Div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
            <Image src={header} alt={t('common.headerAlt')} className="w-36 h-36 rounded-full mb-6" />
            <HeaderImg className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-gray-800" text={t('home.hello', { name })}>
                <Image src={hand} className="w-8 aspect-square" alt={t('common.robotAlt')} />
            </HeaderImg>
            <Header2 className="text-3xl sm:text-5xl font-semibold mb-4 text-gray-800" text={t('home.welcome')} />
            <Paragraph className="mb-8 max-w-md text-gray-700" text={t('home.startUsing')} />
            {
                !userData?.isAccountVerified ?
                    <div onClick={() => navigate('/login')}>
                        <Button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all" text={t('home.letsGo')} />
                    </div>
                    : <div onClick={() => navigate('/systems')}>
                        <Button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all" text={t('home.systemsButton')} />
                    </div>
            }
        </Div>
   )
}

export default HeaderSystems