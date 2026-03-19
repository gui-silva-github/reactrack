import { useFormStatus } from "react-dom"
import i18n from "@/i18n"
import classes from "./Submit.module.css"

const Submit: React.FC = () => {
    const { pending } = useFormStatus()

    return (
        <p className={classes.actions}>
            <button type="submit" disabled={pending}>
                {pending ? i18n.t('opinly.sending') : i18n.t('opinly.submit')}
            </button>
        </p>
    )

}

export default Submit