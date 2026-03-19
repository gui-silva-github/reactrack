import { useTranslation } from "react-i18next"
import classes from './Footer.module.css'

const Footer: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className={classes.footer}>
            <p>{t('common.footerCopyright')}</p>
        </div>
    )

}

export default Footer