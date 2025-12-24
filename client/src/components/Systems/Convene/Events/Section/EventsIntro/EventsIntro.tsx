import { Link } from "react-router-dom"
import classes from "./EventsIntro.module.css"

const EventsIntro: React.FC = () => {

    return (
        <section className={`${classes.overviewSection} content-section`}>
            <h2 className={classes.overh2}>
                Conecte-se com pessoas incríveis <br /> ou
                <strong className={classes.overStrong}> descubra uma nova paixão</strong>
            </h2>
            <p className={classes.overP}>Qualquer um pode organizar e gerenciar eventos no Convene</p>
            <p className={classes.overP}>
                <Link to="/systems/convene/events/new" className="button">
                    Crie seu primeiro evento
                </Link>
            </p>
        </section>
    )

}

export default EventsIntro