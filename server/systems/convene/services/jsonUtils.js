import fs from "fs"

export async function readData(url){
    const data = await fs.promises.readFile(url, 'utf8')
    return data ? JSON.parse(data) : { events: [] }
}

export async function writeData(data, url){
    await fs.promises.writeFile(url, JSON.stringify(data))
}