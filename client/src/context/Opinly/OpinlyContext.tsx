import React, { createContext, useEffect, useState } from "react"
import { loadOpinionsUrl, opinionsUrl, saveOpinions, downvoteOpinionUrl, upvoteOpinionUrl } from "@/api/urls/opinly"
import { fetchData } from "@/utils/systems/fit"
import type { IOpinionData } from "@/interfaces/systems/opinly";
import { postData } from "@/utils/systems/opinly";

interface IOpinionContext {
    opinions: IOpinionData,
    addOpinion: (opinion: IOpinionData) => void,
    upvoteOpinion: (id: string) => void,
    downvoteOpinion: (id: string) => void,
}

export const OpinionsContext = createContext<IOpinionContext | null>(null)

interface IChildrenProp {
    children: React.ReactNode;
}

export const OpinionsContextProvider: React.FC<IChildrenProp> = ({ children }) => {
    const [opinions, setOpinions] = useState<IOpinionData[]>([])

    useEffect(() => {
        async function loadOpinions() {
            const data = await fetchData(loadOpinionsUrl)
            setOpinions(data)
        }

        loadOpinions()
    }, [])

    async function addOpinion(enteredOpinionData: IOpinionData) {
        const response = await postData(saveOpinions, enteredOpinionData)

        if (!response.ok) {
            return
        }

        const savedOpinion = await response.json()
        setOpinions((prevOpinions) => [savedOpinion, ...prevOpinions])
    }

    async function upvoteOpinion(id: string) {
        const response = await fetch(`${opinionsUrl}/opinions/${id}${upvoteOpinionUrl}`, {
            method: 'POST'
        })

        if (!response.ok) {
            return
        }

        setOpinions((prevOpinions) => {
            return prevOpinions.map((opinion: IOpinionData) => {
                if (opinion.id === id) {
                    return { ...opinion, votes: opinion.votes + 1 }
                }
                return opinion
            })
        })
    }

    async function downvoteOpinion(id: string) {
        let opinionVotes = 0

        setOpinions((prevOpinions) => {
            return prevOpinions.map((opinion) => {
                if (opinion.id === id) {
                    opinionVotes = opinion.votes
                    if (opinion.votes > 0) {
                        return { ...opinion, votes: opinion.votes - 1 }
                    }
                }
                return opinion
            })
        })

        if (opinionVotes > 0) {
            const response = await fetch(`${opinionsUrl}/opinions/${id}${downvoteOpinionUrl}`, {
                method: 'POST'
            })

            if (!response.ok) {
                return
            }
        }
    }

    const contextValue = {
        opinions,
        addOpinion,
        upvoteOpinion,
        downvoteOpinion,
    } as unknown as IOpinionContext;

    return <OpinionsContext.Provider value={contextValue}>{children}</OpinionsContext.Provider>
}