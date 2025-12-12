import { useActionState, useContext } from "react";

import { OpinionsContext } from "../../../../context/Opinly/OpinlyContext";
import Submit from "../partials/Submit";
import Div from "../../../Html/Div/Div";
import classes from "./NewOpinion.module.css"
import type { IFormState } from "../../../../interfaces/systems/opinly";

const NewOpinion: React.FC = () => {

    const opinionsContext = useContext(OpinionsContext);

    if (!opinionsContext) {
        return null
    }

    const { addOpinion } = opinionsContext;

    async function shareOpinionsAction(prevState: IFormState, formData: FormData) {
        const title = String(formData.get('title') ?? '');
        const body = String(formData.get('body') ?? '');
        const userName = formData.get('userName')

        let errors = []

        if (title.trim().length < 5) {
            errors.push('O título precisa ter pelo menos 5 caracteres.')
        }

        if (body.trim().length < 10 || body.trim().length > 300) {
            errors.push('A opinião deve ter entre 10 e 300 caracteres.')
        }

        if (typeof userName !== "string" || !userName.trim()) {
            errors.push('Por favor, coloque um nome.')
        }

        if (errors.length > 0) {
            return {
                errors, enteredValues: {
                    title, body, userName
                }
            }
        }
        await addOpinion({
            id: "", 
            title,
            body,
            userName: String(userName ?? ''),
            votes: 0 
        });

        return { errors: null }
    }

    const [formState, formAction] = useActionState(
        shareOpinionsAction as (
            state: any,
            formData: FormData
        ) => Promise<any> | any, 
        {
            errors: null
        }
    );

    return (
        <Div className={classes['new-opinion']}>
            <form action={formAction} className={classes.form}>
                <Div className={classes['control-row']}>
                    <p className={classes.control}>
                        <label htmlFor="userName">Seu nome</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            defaultValue={
                                formState?.enteredValues?.userName != null
                                    ? String(formState.enteredValues.userName)
                                    : undefined
                            }
                        />
                    </p>
                    <p className={classes.control}>
                        <label htmlFor="title">Título</label>
                        <input type="text" id="title" name="title"
                            defaultValue={formState?.enteredValues?.title}
                        />
                    </p>
                </Div>
                <p className={`${classes.control} ${classes.top}`}>
                    <label htmlFor="body">Sua opinião</label>
                    <textarea name="body" id="body" rows={5}
                        defaultValue={formState?.enteredValues?.body}
                    ></textarea>
                </p>
                {formState?.errors && (
                    <ul className={classes.errors}>
                        {formState?.errors.map((error: any) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                )}
                <Submit />
            </form>
        </Div>
    )

}

export default NewOpinion