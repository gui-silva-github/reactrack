import fs from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { v4 as uuidv4 } from "uuid"

const serverRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..")
const dbPath = join(serverRoot, "json", "opinly", "db.json")

export async function loadOpinions(){
    try{
        const dbFileData = await fs.readFile(dbPath, "utf8")
        const parsedData = JSON.parse(dbFileData)

        return parsedData.opinions || []
    } catch (error){
        if (error && error.code === "ENOENT"){
            return []
        }
        console.error("Opinly loadOpinions:", error)
        return []
    }
}

export async function saveOpinion(opinion) {
    const opinions = await loadOpinions()

    const newOpinion = { id: uuidv4(), votes: 0, ...opinion }
    opinions.unshift(newOpinion)

    const dataToSave = { opinions }
    await fs.writeFile(dbPath, JSON.stringify(dataToSave, null, 2))
    return newOpinion
}

export async function upvoteOpinion(id) {
    const opinions = await loadOpinions()
    const opinion = opinions.find((o) => o.id === id)
    if (!opinion){
        return null
    }
    opinion.votes++

    await fs.writeFile(dbPath, JSON.stringify({ opinions }, null, 2))
    return opinion
}

export async function downvoteOpinion(id) {
    const opinions = await loadOpinions()
    const opinion = opinions.find((o) => o.id === id)
    if (!opinion){
        return null
    }
    opinion.votes--

    await fs.writeFile(dbPath, JSON.stringify({opinions}, null, 2))
    return opinion
}
