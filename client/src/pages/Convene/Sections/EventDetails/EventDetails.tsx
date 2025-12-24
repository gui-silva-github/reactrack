import { Link, Outlet, useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import Header from "../../../../components/Systems/Convene/Common/Header/Header"
import { fetchEvent, deleteEvent, queryClient } from "../../../../utils/systems/queryClient/http"
import ErrorBlock from "../../../../components/Systems/Convene/UI/ErrorBlock/ErrorBlock"
import { useState } from "react"
import Modal from "../../../../components/Systems/Convene/UI/Modal/Modal"
import addDay from "../../../../utils/systems/convene"
import { conveneImagesEndpoint, redirectEvents } from "../../../../api/urls/convene"
import Div from "../../../../components/Html/Div/Div"
import classes from "./EventDetails.module.css"

const EventDetails: React.FC = () => {
    const [isDeleting, setIsDeleting] = useState(false)

    const params = useParams()
    const navigate = useNavigate()

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['events', params.id],
        queryFn: ({ signal }) => fetchEvent({ signal, id: params.id || '' })
    })

    const { mutate, isPending: isPendingDeletion, isError: isErrorDeleting, error: deleteError } = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none' })
            navigate(`${redirectEvents}`)
        }
    })

    function handleStartDelete() {
        setIsDeleting(true)
    }

    function handleStopDelete() {
        setIsDeleting(false)
    }

    function handleDelete() {
        mutate({ id: params.id || '' })
    }

    let content

    if (isPending) {
        content = <div className={`${classes.eventDetailsContent} center`}>
            <p>Carregando dados de evento...</p>
        </div>
    }

    if (isError) {
        content = <div className={`${classes.eventDetailsContent} center`}>
            <ErrorBlock
                title="Falha ao carregar evento."
                message={(error as any).info?.message || 'Falha ao carregar dados de evento, tente novamente!'}
            />
        </div>
    }

    if (data) {
        const date = addDay(data.date)

        content = <>
            <header className={classes.header}>
                <h1>{data.title}</h1>
                <nav className={classes.nav}>
                    <button className={classes.button} onClick={handleStartDelete}>
                        Deletar
                    </button>
                    <Link to={`${redirectEvents}/${data.id}/edit`} className={classes.a}>Editar</Link>
                </nav>
            </header>
            <Div className={classes.eventDetailsContent}>
                <img className={classes.img} src={`${conveneImagesEndpoint}${data.image}`} alt={data.title} />
                <Div className={classes.info}>
                    <div>
                        <p className={classes.location}>{data.location}</p>
                        <time className={classes.time} dateTime={`Todo-DataT$Todo-Time`}>{date} | {data.time}</time>
                    </div>
                    <p className={classes.description}>{data.description}</p>
                </Div>
            </Div>
        </>
    }

    return (
        <Div className={classes.margin}>
            {isDeleting && (
                <Modal onClose={handleStopDelete}>
                    <h2 className={classes.h2}>Você tem certeza?</h2>
                    <p className={classes.h2}>Você realmente quer excluir este evento. <span style={{ color: 'red' }}>Essa ação não pode ser desfeita.</span></p>
                    <div className="form-actions">
                        {isPendingDeletion && <p>Excluindo, por favor espere...</p>}
                        {!isPendingDeletion && (
                            <>
                                <button onClick={handleStopDelete} className="button-text">
                                    Cancelar
                                </button>
                                <button onClick={handleDelete} className="button">
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>
                    {isErrorDeleting && (
                        <ErrorBlock
                            title="Falha ao excluir evento"
                            message={(deleteError as any).info?.message || 'Falha ao excluir evento, por favor tente novamente mais tarde.'}
                        />
                    )}
                </Modal>
            )}
            <Outlet />
            <Header>
                <Link to={redirectEvents} className={`${classes.allEvents} nav-item`}>
                    Ver todos eventos
                </Link>
            </Header>
            <article id="event-details" className={classes.marginDetails}>
                {content}
            </article>
        </Div>
    )

}

export default EventDetails