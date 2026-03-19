import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "@/components/Systems/Convene/UI/LoadingIndicator/LoadingIndicator";
import ErrorBlock from "@/components/Systems/Convene/UI/ErrorBlock/ErrorBlock";
import EventItem from "@/components/Systems/Convene/Events/Item/EventItem";
import { fetchEvents } from "@/utils/systems/queryClient/http";
import ConveneEvent from "@/models/convene/event";
import classes from "./NewEvents.module.css"

const NewEvents: React.FC = () => {
    const { t } = useTranslation()
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
            <ErrorBlock title={t('convene.errorOccurred')} message={(error as any).info?.message || t('convene.loadEventsError')} />
        )
    }

    if (events && events.length === 0) {
        content = <p>{t('convene.noEventsFound')}</p>
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
                <h2>{t('convene.upcomingEvents')}</h2>
            </header>
            {content}
        </section>
    )

}

export default NewEvents