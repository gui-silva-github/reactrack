import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { readData } from "./jsonUtils.js"

const serverRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..")
const imagesPath = join(serverRoot, "json", "convene", "images.json")

export async function getAllImages(){
    const storedImages = await readData(imagesPath)

    if (storedImages == null){
        throw Object.assign(new Error("Não foi possível carregar imagens."), { status: 404 })
    }

    return storedImages
}
