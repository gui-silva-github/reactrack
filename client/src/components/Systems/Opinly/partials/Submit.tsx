import { useFormStatus } from "react-dom"
import classes from "./Submit.module.css"

const Submit: React.FC = () => {

    const { pending } = useFormStatus()

    return (
        <p className={classes.actions}>
            <button type="submit" disabled={pending}>
                {pending ? 'Enviando...' : 'Enviar'}
            </button>
        </p>
    )

}

export default Submit