import fs from "node:fs/promises"
import { v4 as uuidv4 } from "uuid"

export async function loadOpinions(){
    try{
        const dbFileData = await fs.readFile('./json/opinly/db.json')
        const parsedData = JSON.parse(dbFileData)
        
        return parsedData.opinions
    } catch (error){
        return []
    }
}

export async function saveOpinion(opinion) {
    const opinions = await loadOpinions()

    const newOpinion = { id: uuidv4(), votes: 0, ...opinion }
    opinions.unshift(newOpinion)

    const dataToSave = { opinions }
    await fs.writeFile('./json/opinly/db.json', JSON.stringify(dataToSave, null, 2))
    return newOpinion
}

export async function upvoteOpinion(id) {
    const opinions = await loadOpinions()
    const opinion = opinions.find((o) => o.id === id)
    if (!opinion){
        return null
    }
    opinion.votes++

    await fs.writeFile('./json/opinly/db.json', JSON.stringify({ opinions }, null, 2))
    return opinion
}

export async function downvoteOpinion(id) {
    const opinions = await loadOpinions()
    const opinion = opinions.find((o) => o.id === id)
    if (!opinion){
        return null
    }
    opinion.votes--

    await fs.writeFile('./json/opinly/db.json', JSON.stringify({opinions}, null, 2))
    return opinion
}