import { useTranslation } from "react-i18next"
import Header1 from "../../../Html/Header1/Header1"
import Paragraph from "../../../Html/Paragraph/Paragraph"
import classes from "./Header.module.css"

const Header: React.FC = () => {
    const { t } = useTranslation()

    return (
        <header className={classes['main-header']}>
            <Header1 text={t('opinly.title')} className={classes.h1} />
            <Paragraph className={classes.p} text={t('opinly.subtitle')} />
        </header>
    )

}

export default Header