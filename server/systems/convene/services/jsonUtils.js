import fs from "fs"

export async function readData(url){
    try {
        const data = await fs.promises.readFile(url, "utf8")
        if (!data?.trim()) {
            return null
        }
        return JSON.parse(data)
    } catch (err) {
        if (err && err.code === "ENOENT") {
            return null
        }
        throw err
    }
}

export async function writeData(data, url){
    await fs.promises.writeFile(url, JSON.stringify(data))
}