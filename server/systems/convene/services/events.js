import { readData, writeData } from "./jsonUtils.js" 

export async function getAll(){ 
    const storedData = await readData('./json/convene/events.json')
    
    if (!storedData.events){ 
        throw new Error({message: 'Não foi possível encontrar qualquer evento.', status: 404}) 
    } 
    
    return storedData 
} 

export async function get(id){ 
    const storedData = await readData('./json/convene/events.json') 
    
    if (!storedData){ 
        throw new Error({message: 'Não foi possível encontrar o evento.', status: 404}) 
    } 
    
    const event = storedData.events.find((ev) => ev.id === id) 
    
    if (!event){ 
        throw new Error({message: 'Não foi possível encontrar o evento.', status: 404}) 
    } 
    
    return event 
} 

export async function add(data){
    const storedData = await readData('./json/convene/events.json')

    storedData.events.unshift({ ...data, id: crypto.randomUUID() })
    await writeData(storedData, './json/convene/events.json')
}

export async function replace(id, data){
    const storedData = await readData('./json/convene/events.json') 
    
    if (!storedData.events || storedData.events.length === 0){
        throw new Error({message: 'Não foi possível encontrar o evento.', status: 404}) 
    } 
    
    const index = storedData.events.findIndex((ev) => ev.id === id) 
    
    if (index < 0){ 
        throw new Error({message: 'Não foi possível encontrar o evento.', status: 404}) 
    } 
    
    storedData.events[index] = { ...data, id } 
    
    await writeData(storedData, './json/convene/events.json') 
} 

export async function remove(id){ 
    const storedData = await readData('./json/convene/events.json')

    const updatedData = storedData.events.filter((ev) => ev.id !== id) 
    await writeData({ ...storedData, events: updatedData }, './json/convene/events.json') 
} 