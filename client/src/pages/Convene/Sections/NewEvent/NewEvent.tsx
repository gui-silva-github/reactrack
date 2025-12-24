import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Modal from '../../../../components/Systems/Convene/UI/Modal/Modal'
import EventForm from "../../../../components/Systems/Convene/Events/Form/EventForm"
import { createNewEvent } from '../../../../utils/systems/queryClient/http'
import ErrorBlock from '../../../../components/Systems/Convene/UI/ErrorBlock/ErrorBlock'
import { queryClient } from '../../../../utils/systems/queryClient/http'
import ConveneEvent from '../../../../models/convene/event'
import { redirectEvents } from '../../../../api/urls/convene'

const NewEvent: React.FC = () => {
    const navigate = useNavigate()

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: createNewEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
            navigate(`${redirectEvents}`)
        }
    })

    function handleSubmit(formData: ConveneEvent) {
        mutate(formData)
    }

    return (
        <Modal onClose={() => navigate("../")}>
            <EventForm onSubmit={handleSubmit}>
                {isPending && 'Enviando...'}
                {!isPending && (
                    <>
                        <Link to="../" className="button-text">
                            Cancelar
                        </Link>
                        <button type="submit" className="button">
                            Criar
                        </button>
                    </>
                )}
            </EventForm>
            {isError && (
                <ErrorBlock
                    title="Falha ao criar evento"
                    message={(error as any).info?.message || ""}
                    errors={(error as any).info?.errors || []}
                />
            )}
        </Modal>
    )
}

export default NewEvent