import { loadOpinions, saveOpinion, upvoteOpinion, downvoteOpinion } from "../utils/index.js"

export const getAllOpinions = async (req, res) => {
    try{
        const opinions = await loadOpinions()
        res.json(opinions)
    } catch (error){
        res.status(500).json({ error: 'Erro ao carregar opiniões.' })
    }
}

export const postOpinion = async (req, res) => {
    const { userName, title, body } = req.body

    if (!userName || !title || !body){
        return res
        .status(400)
        .json({error: 'Nome de usuário, título e opinião são requeridos.'})
    }

    try{
        const newOpinion = await saveOpinion({ userName, title, body })
        res.status(201).json(newOpinion)
    } catch (error){
        res.status(500).json({ error: 'Erro ao salvar opinião.' })
    }
}

export const upvoteOpinionController = async (req, res) => {
    const { id } = req.params

    try {
        const opinion = await upvoteOpinion(id)
        if (!opinion){
            return res.status(404).json({ error: 'Opinião não encontrada.' })
        }
        res.json(opinion)
    } catch (error){
        res.status(500).json({ error: 'Erro ao dar voto na opinião.' })
    }
}

export const downvoteOpinionController = async (req, res) => {
    const { id } = req.params

    try {
        const opinion = await downvoteOpinion(id)
        if (!opinion){
            return res.status(404).json({ error: 'Opinião não encontrada.' })
        }
        res.json(opinion)
    } catch (error){
        res.status(500).json({ error: 'Erro ao tirar voto na opinião. '})
    }
}

