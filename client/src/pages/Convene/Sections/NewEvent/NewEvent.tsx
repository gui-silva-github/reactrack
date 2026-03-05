import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import Modal from '../../../../components/Systems/Convene/UI/Modal/Modal'
import EventForm from "../../../../components/Systems/Convene/Events/Form/EventForm"
import { createNewEvent } from '../../../../utils/systems/queryClient/http'
import ErrorBlock from '../../../../components/Systems/Convene/UI/ErrorBlock/ErrorBlock'
import { queryClient } from '../../../../utils/systems/queryClient/http'
import ConveneEvent from '../../../../models/convene/event'
import { redirectEvents } from '../../../../api/urls/convene'

const NewEvent: React.FC = () => {
    const { t } = useTranslation()
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
                {isPending && t('convene.sending')}
                {!isPending && (
                    <>
                        <Link to="../" className="button-text">
                            {t('convene.cancel')}
                        </Link>
                        <button type="submit" className="button">
                            {t('convene.create')}
                        </button>
                    </>
                )}
            </EventForm>
            {isError && (
                <ErrorBlock
                    title={t('convene.createError')}
                    message={(error as any).info?.message || ""}
                    errors={(error as any).info?.errors || []}
                />
            )}
        </Modal>
    )
}

export default NewEvent