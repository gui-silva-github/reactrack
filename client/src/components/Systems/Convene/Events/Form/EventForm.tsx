import { useState, type FC, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import ImagePicker from "../../Common/ImagePicker/ImagePicker";
import { fetchSelectableImages } from "../../../../../utils/systems/queryClient/http";
import ErrorBlock from "../../UI/ErrorBlock/ErrorBlock";
import ConveneEvent from "../../../../../models/convene/event";
import classes from './EventForm.module.css'

interface IEventFormProps {
    inputData?: ConveneEvent;
    onSubmit: (formData: ConveneEvent) => void;
    children: ReactNode
}

const EventForm: FC<IEventFormProps> = ({ inputData, onSubmit, children }) => {
    const [selectedImage, setSelectedImage] = useState(inputData?.image ?? '')

    const { data, isPending, isError } = useQuery({
        queryKey: ['events-images'],
        queryFn: fetchSelectableImages
    })

    function handleSelectImage(image: string) {
        setSelectedImage(image)
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) as Record<string, string>

        const normalizedData: any = {
            ...data, image: selectedImage
        }

        onSubmit(normalizedData)
    }

    return (
        <form id="event-form" onSubmit={handleSubmit}>
            <p className={`control ${classes.margin}`}>
                <label className={classes.label} htmlFor="title">Título</label>
                <input
                    className={classes.input}
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={inputData?.title ?? ''}
                />
            </p>

            {isPending && <p>Carregando images selecionáveis...</p>}
            {isError && <ErrorBlock title="Falha ao carregar imagens selecionáveis" message="Por favor tente novamente mais tarde." />}
            {data && (
                <div className={`control ${classes.margin}`}>
                    <ImagePicker
                        images={data}
                        onSelect={handleSelectImage}
                        selectedImage={selectedImage}
                    />
                </div>
            )}

            <p className={`control ${classes.margin}`}>
                <label className={classes.label} htmlFor="description">Descrição</label>
                <textarea
                    className={classes.textarea}
                    name="description"
                    id="description"
                    defaultValue={inputData?.description ?? ''}
                ></textarea>
            </p>

            <div className={classes.controlsRow}>
                <p className="control">
                    <label className={classes.label} htmlFor="date">Data</label>
                    <input
                        className={classes.input}
                        type="date"
                        id="date"
                        name="date"
                        defaultValue={inputData?.date ? new Date(inputData.date).toISOString().slice(0, 10) : ''}
                    />
                </p>

                <p className="control">
                    <label className={classes.label} htmlFor="time">Horário</label>
                    <input
                        className={classes.input}
                        type="time"
                        id="time"
                        name="time"
                        defaultValue={inputData?.time ?? ''}
                    />
                </p>
            </div>

            <p className={`control ${classes.margin}`}>
                <label className={classes.label} htmlFor="location">Local</label>
                <input
                    className={classes.input}
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={inputData?.location ?? ''}
                />
            </p>

            <div className="form-actions">{children}</div>
        </form>
    )
    
}

export default EventForm 