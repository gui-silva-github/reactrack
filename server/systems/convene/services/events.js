import crypto from "node:crypto"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { readData, writeData } from "./jsonUtils.js"

const serverRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..")
const eventsPath = join(serverRoot, "json", "convene", "events.json")

function httpError(message, status = 500) {
    const err = new Error(message)
    err.status = status
    return err
}

export async function getAll(){
    const storedData = await readData(eventsPath)

    if (!storedData || !storedData.events){
        throw httpError("Não foi possível encontrar qualquer evento.", 404)
    }

    return storedData
}

export async function get(id){
    const storedData = await readData(eventsPath)

    if (!storedData?.events){
        throw httpError("Não foi possível encontrar o evento.", 404)
    }

    const event = storedData.events.find((ev) => ev.id === id)

    if (!event){
        throw httpError("Não foi possível encontrar o evento.", 404)
    }

    return event
}

export async function add(data){
    const storedData = await readData(eventsPath) || { events: [] }
    if (!storedData.events) {
        storedData.events = []
    }

    storedData.events.unshift({ ...data, id: crypto.randomUUID() });
    await writeData(storedData, eventsPath)
}

export async function replace(id, data){
    const storedData = await readData(eventsPath) || { events: [] }

    if (!storedData.events || storedData.events.length === 0){
        throw httpError("Não foi possível encontrar o evento.", 404)
    }

    const index = storedData.events.findIndex((ev) => ev.id === id)

    if (index < 0){
        throw httpError("Não foi possível encontrar o evento.", 404)
    }

    storedData.events[index] = { ...data, id }

    await writeData(storedData, eventsPath)
}

export async function remove(id){
    const storedData = await readData(eventsPath) || { events: [] }
    if (!storedData.events) {
        storedData.events = []
    }

    const updatedData = storedData.events.filter((ev) => ev.id !== id)
    await writeData({ ...storedData, events: updatedData }, eventsPath)
}
