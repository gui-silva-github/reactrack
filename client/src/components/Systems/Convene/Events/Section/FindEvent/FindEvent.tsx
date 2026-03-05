import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "../../../../../../utils/systems/queryClient/http"
import LoadingIndicator from "../../../UI/LoadingIndicator/LoadingIndicator"
import ErrorBlock from "../../../UI/ErrorBlock/ErrorBlock"
import EventItem from "../../Item/EventItem"
import classes from "./FindEvent.module.css"

const FindEvent: React.FC = () => {
    const { t } = useTranslation()
    const searchElement = useRef<HTMLInputElement>(null)
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['events', { searchTerm: searchTerm }],
        queryFn: ({ signal, queryKey }: { signal: AbortSignal, queryKey: [string, { searchTerm?: string }] }) => fetchEvents({ signal, ...queryKey[1] }),
        enabled: searchTerm !== undefined
    })

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (searchElement.current) {
            setSearchTerm(searchElement.current.value)
        }
    }

    let content = <p className={classes.p}>{t('convene.insertSearchTerm')}</p>

    if (isLoading) {
        content = <LoadingIndicator />
    }

    if (isError) {
        content = <ErrorBlock title={t('convene.errorOccurred')} message={(error as any).info?.message || t('convene.loadEventsError')} />
    }

    if (data && data.length === 0) {
        content = <p className={classes.p}>{t('convene.noEventsFound')}</p>
    }

    if (data && data.length > 0) {
        content = (
            <ul className="events-list">
                {data.map((event) => (
                    <li key={event.id}>
                        <EventItem event={event} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <section className={`content-section ${classes.find}`} id="all-events-section">
            <header className={classes.margin}>
                <h2 className={classes.h2}>{t('convene.findNextEvent')}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className={classes.input}
                        type="search"
                        placeholder={t('convene.searchPlaceholder')}
                        ref={searchElement}
                    />
                    <button className={classes.button}>{t('convene.search')}</button>
                </form>
            </header>
            {content}
        </section>
    )
}

export default FindEvent