import { useContext, useActionState, useOptimistic } from "react";
import { OpinionsContext } from "../../../../context/Opinly/OpinlyContext";

import classes from "./Opinion.module.css"
import type { IOpinionData } from "../../../../interfaces/systems/opinly";
import Paragraph from "../../../Html/Paragraph/Paragraph";

interface IOpinionProp {
    opinion: IOpinionData
}

const Opinion: React.FC<IOpinionProp> = ({opinion}) => {

    const votes = opinion.votes
    const id = opinion.id

    if (!OpinionsContext) {
        return null
    }

    const contextValue = useContext(OpinionsContext);

    if (!contextValue) {
        return null
    }

    const { upvoteOpinion, downvoteOpinion } = contextValue;

    const [optimisticVotes, setVotesOptimistically] =
        useOptimistic(votes, (prevVotes, mode: 'up' | 'down') => mode === 'up' ? prevVotes + 1 : prevVotes - 1)

    async function upvoteAction() {
        setVotesOptimistically('up')
        upvoteOpinion(id)
    }

    async function downvoteAction() {
        setVotesOptimistically('down')
        downvoteOpinion(id)
    }

    const [upvoteFormState, upvoteFormAction, upvotePending] = useActionState(upvoteAction, undefined);

    const [downvoteFormState, downvoteFormAction, downvotePending] = useActionState(downvoteAction, undefined);

    return (
        <article>
            <header>
                <h3>{opinion.title}</h3>
                <Paragraph text={`Compartilhado por ${opinion.userName}`} />
            </header>
            <Paragraph text={opinion.body} />
            <form className={classes.votes}>
                <button formAction={upvoteFormAction} disabled={upvotePending || downvotePending}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="m16 12-4-4-4 4" />
                        <path d="M12 16V8" />
                    </svg>
                </button>
                <span>
                    {optimisticVotes}
                </span>
                <button formAction={downvoteFormAction} disabled={upvotePending || downvotePending}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M12 8v8" />
                        <path d="m8 12 4 4 4-4" />
                    </svg>
                </button>
            </form>
        </article>
    )
}

export default Opinion