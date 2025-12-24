import { cloudinaryConfig, CLOUDINARY_UPLOAD_URL } from "../config/cloudinary"

const upload = async (file: File): Promise<string> => {
    try {
        if (!file) {
            throw new Error('Nenhum arquivo fornecido')
        }

        if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
            throw new Error('Configuração do Cloudinary não encontrada. Verifique as variáveis de ambiente.')
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', cloudinaryConfig.uploadPreset)
        formData.append('folder', 'talkive/images') 
        formData.append('timestamp', Date.now().toString())

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `Erro no upload: ${response.statusText}`)
        }

        const data = await response.json()
        
        return data.secure_url || data.url
    } catch (error: any) {
        console.error('Erro no upload da imagem:', error)
        throw error
    }
}

export default upload