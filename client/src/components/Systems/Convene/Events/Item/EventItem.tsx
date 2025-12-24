import { Link } from "react-router-dom"
import ConveneEvent from "../../../../../models/convene/event"
import addDay from "../../../../../utils/systems/convene"
import classes from "./EventItem.module.css"
import { conveneImagesEndpoint } from "../../../../../api/urls/convene"

const EventItem: React.FC<{ event: ConveneEvent }> = ({ event }) => {
    const date = addDay(event.date)

    return (
        <article className={classes.eventItem}>
            <img className={classes.img} src={`${conveneImagesEndpoint}${event.image}`} alt={event.title} />
            <div className={classes.content}>
                <div>
                    <h2 className={classes.h2}>{event.title}</h2>
                    <p className={classes.date}>{date}</p>
                    <p className={classes.location}>{event.location}</p>
                </div>
                <p className={classes.button}>
                    <Link to={`/systems/convene/events/${event.id}`} className="button">
                        Ver detalhes
                    </Link>
                </p>
            </div>
        </article>
    )
}

export default EventItem