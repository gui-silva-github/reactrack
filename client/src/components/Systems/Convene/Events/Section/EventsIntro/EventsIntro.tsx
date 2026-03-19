import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"
import classes from "./EventsIntro.module.css"

const EventsIntro: React.FC = () => {
    const { t } = useTranslation()

    return (
        <section className={`${classes.overviewSection} content-section`}>
            <h2 className={classes.overh2}>
                {t('convene.introConnect')} <br /> {t('convene.introOr')}{' '}
                <strong className={classes.overStrong}> {t('convene.introDiscover')}</strong>
            </h2>
            <p className={classes.overP}>{t('convene.introDescription')}</p>
            <p className={classes.overP}>
                <Link to="/systems/convene/events/new" className="button">
                    {t('convene.createFirstEvent')}
                </Link>
            </p>
        </section>
    )

}

export default EventsIntro