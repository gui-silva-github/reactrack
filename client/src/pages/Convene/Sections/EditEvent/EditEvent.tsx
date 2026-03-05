import { Link, useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18n from "../../../../i18n"
import { useQuery, useMutation } from "@tanstack/react-query"
import Modal from "../../../../components/Systems/Convene/UI/Modal/Modal"
import EventForm from "../../../../components/Systems/Convene/Events/Form/EventForm"
import { fetchEvent, updateEvent, queryClient } from "../../../../utils/systems/queryClient/http"
import ErrorBlock from "../../../../components/Systems/Convene/UI/ErrorBlock/ErrorBlock"
import type { FC } from "react"
import type { LoaderFunctionArgs } from "react-router-dom"
import ConveneEvent from "../../../../models/convene/event"

const EditEvent: FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { t } = useTranslation()

    const { data, isError, error } = useQuery({
        queryKey: ['events', params.id],
        queryFn: ({signal}) => {
            if (!params.id) throw new Error(i18n.t('convene.invalidEvent'))
            return fetchEvent({signal, id: params.id})
        },
        staleTime: 10000
    })

    const { mutate, isPending, isError: isErrorUpdating, error: errorUpdating } = useMutation({
        mutationFn: async (eventData: ConveneEvent) => {
            if (!params.id) throw new Error(i18n.t('convene.invalidEvent'))
            const response = await updateEvent({ id: params.id, event: eventData })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || '', { cause: data.errors })
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
            navigate("../")
        }
    })

    function handleSubmit(formData: ConveneEvent){
        mutate(formData)
    }

    function handleClose(){
        navigate("../")
    }

    let content

    if (isError){
        content = <>
            <ErrorBlock 
                title={t('convene.loadError')}
                message={(error as any).info?.message || t('convene.loadErrorMsg')}
            />
            <div className="form-actions">
                <Link to="../" className="button">
                    {t('convene.ok')}
                </Link>
            </div>
        </>
    }

    if (data){
        content = (
            <>
            <EventForm inputData={data} onSubmit={handleSubmit}>
                {isPending ? (
                    <p>{t('convene.sendingData')}</p>
                ) : (
                    <>
                        <Link to="../" className="button-text">
                            {t('convene.cancel')}
                        </Link>
                        <button type="submit" className="button">
                            {t('convene.update')}
                        </button>
                    </>
                )}
            </EventForm>
            {isErrorUpdating && (
                <ErrorBlock
                    title={t('convene.updateError')}
                    message={(errorUpdating as any)?.message || ""}
                    errors={(errorUpdating as any)?.cause}
                />
            )}
            </>
        )
    }

    return (
        <Modal onClose={handleClose}>
            {content}
        </Modal>
    )
}

export default EditEvent

export function loader({params}: LoaderFunctionArgs){
    return queryClient.fetchQuery({
        queryKey: ['events', params.id],
        queryFn: ({signal}) => {
            if (!params.id) throw new Response(i18n.t('convene.eventNotFound'), {status: 404})
            return fetchEvent({signal, id: params.id})     
        }    
    })
}


