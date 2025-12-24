import { Link, useNavigate, useParams } from "react-router-dom"
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

    const { data, isError, error } = useQuery({
        queryKey: ['events', params.id],
        queryFn: ({signal}) => {
            if (!params.id) throw new Error("Evento inválido")
            return fetchEvent({signal, id: params.id})
        },
        staleTime: 10000
    })

    const { mutate, isPending, isError: isErrorUpdating, error: errorUpdating } = useMutation({
        mutationFn: async (eventData: ConveneEvent) => {
            if (!params.id) throw new Error("Evento inválido")
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
                title="Falha ao carregar evento"
                message={(error as any).info?.message || "Falha ao carregar evento. Por favor, confira seus inputs e tente novamente mais tarde."}
            />
            <div className="form-actions">
                <Link to="../" className="button">
                    Ok
                </Link>
            </div>
        </>
    }

    if (data){
        content = (
            <>
            <EventForm inputData={data} onSubmit={handleSubmit}>
                {isPending ? (
                    <p>Enviando dados...</p>
                ) : (
                    <>
                        <Link to="../" className="button-text">
                            Cancelar
                        </Link>
                        <button type="submit" className="button">
                            Atualizar
                        </button>
                    </>
                )}
            </EventForm>
            {isErrorUpdating && (
                <ErrorBlock
                    title="Erro ao atualizar evento"
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
            if (!params.id) throw new Response("Evento não encontrado", {status: 404})
            return fetchEvent({signal, id: params.id})     
        }    
    })
}


