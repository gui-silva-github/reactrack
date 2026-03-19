import { Link, Outlet, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useQuery, useMutation } from "@tanstack/react-query"
import Header from '@/components/Systems/Convene/Common/Header/Header'
import { fetchEvent, deleteEvent, queryClient } from "@/utils/systems/queryClient/http"
import ErrorBlock from "@/components/Systems/Convene/UI/ErrorBlock/ErrorBlock"
import { useState } from "react"
import Modal from "@/components/Systems/Convene/UI/Modal/Modal"
import addDay from "@/utils/systems/convene"
import { conveneImagesEndpoint, redirectEvents } from "@/api/urls/convene"
import Div from "@/components/Html/Div/Div"
import classes from "./EventDetails.module.css"

const EventDetails: React.FC = () => {
    const [isDeleting, setIsDeleting] = useState(false)
    const { t } = useTranslation()

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
            <p>{t('convene.loadingEvent')}</p>
        </div>
    }

    if (isError) {
        content = <div className={`${classes.eventDetailsContent} center`}>
            <ErrorBlock
                title={t('convene.loadError')}
                message={(error as any).info?.message || t('convene.loadErrorMsg')}
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
                        {t('convene.delete')}
                    </button>
                    <Link to={`${redirectEvents}/${data.id}/edit`} className={classes.a}>{t('convene.edit')}</Link>
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
                    <h2 className={classes.h2}>{t('convene.deleteConfirm')}</h2>
                    <p className={classes.h2}>{t('convene.deleteConfirmMsg')}</p>
                    <div className="form-actions">
                        {isPendingDeletion && <p>{t('convene.deleting')}</p>}
                        {!isPendingDeletion && (
                            <>
                                <button onClick={handleStopDelete} className="button-text">
                                    {t('convene.cancel')}
                                </button>
                                <button onClick={handleDelete} className="button">
                                    {t('convene.exclude')}
                                </button>
                            </>
                        )}
                    </div>
                    {isErrorDeleting && (
                        <ErrorBlock
                            title={t('convene.deleteError')}
                            message={(deleteError as any).info?.message || t('convene.deleteErrorMsg')}
                        />
                    )}
                </Modal>
            )}
            <Outlet />
            <Header>
                <Link to={redirectEvents} className={`${classes.allEvents} nav-item`}>
                    {t('convene.allEvents')}
                </Link>
            </Header>
            <article id="event-details" className={classes.marginDetails}>
                {content}
            </article>
        </Div>
    )

}

export default EventDetails