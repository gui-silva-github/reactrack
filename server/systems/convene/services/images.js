import { readData } from "./jsonUtils.js";

export async function getAllImages(){
    const storedImages = await readData('./json/convene/images.json')

    if (!storedImages){
        throw new Error({message: 'Não foi possível encontrar qualquer imagem.', status: 404})
    }

    return storedImages
}
