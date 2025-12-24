import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "../../../../../../utils/systems/queryClient/http"
import LoadingIndicator from "../../../UI/LoadingIndicator/LoadingIndicator"
import ErrorBlock from "../../../UI/ErrorBlock/ErrorBlock"
import EventItem from "../../Item/EventItem"
import classes from "./FindEvent.module.css"

const FindEvent: React.FC = () => {
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

    let content = <p className={classes.p}>Por favor insira um termo de busca para encontrar eventos.</p>

    if (isLoading) {
        content = <LoadingIndicator />
    }

    if (isError) {
        content = <ErrorBlock title="Ocorreu um erro" message={(error as any).info?.message || "Falha ao carregar eventos."} />
    }

    if (data && data.length === 0) {
        content = <p className={classes.p}>Nenhum evento foi encontrado!</p>
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
                <h2 className={classes.h2}>Encontre seu próximo evento!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className={classes.input}
                        type="search"
                        placeholder="Procurar eventos"
                        ref={searchElement}
                    />
                    <button className={classes.button}>Procurar</button>
                </form>
            </header>
            {content}
        </section>
    )
}

export default FindEvent