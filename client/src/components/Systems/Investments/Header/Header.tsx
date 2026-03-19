import { useTranslation } from "react-i18next"
import logo from "@/assets/investments/investment-calculator-logo.png"
import Image from "@/components/Html/Image/Image"

const HeaderInvestments: React.FC = () => {
    const { t } = useTranslation()
    return (
        <header id="header">
            <Image src={logo} alt={t('common.logo')} />
        </header>
    )
}

export default HeaderInvestments