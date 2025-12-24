import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../../UI/LoadingIndicator/LoadingIndicator";
import ErrorBlock from "../../../UI/ErrorBlock/ErrorBlock";
import EventItem from "../../Item/EventItem";
import { fetchEvents } from "../../../../../../utils/systems/queryClient/http";
import ConveneEvent from "../../../../../../models/convene/event";
import classes from "./NewEvents.module.css"

const NewEvents: React.FC = () => {
    const { data: events, isPending, isError, error } = useQuery<ConveneEvent[], Error>({
        queryKey: ['events', { max: 3 }],
        queryFn: ({ signal, queryKey }) => {
            const [, params] = queryKey as [string, { max?: number }]
            return fetchEvents({ signal, ...params })
        },
        staleTime: 5000
    })

    let content

    if (isPending) {
        content = <LoadingIndicator />
    }

    if (isError) {
        content = (
            <ErrorBlock title="Ocorreu um erro" message={(error as any).info?.message || "Falha ao carregar eventos"} />
        )
    }

    if (events && events.length === 0) {
        content = <p>Nenhum evento foi encontrado!</p>
    }

    if (events && events.length > 0) {
        content = (
            <ul className={classes.eventsList}>
                {events.map((event) => (
                    <li key={event.id}>
                        <EventItem event={event} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <section className="content-section" id="new-events-section">
            <header>
                <h2>Eventos mais próximos</h2>
            </header>
            {content}
        </section>
    )

}

export default NewEvents