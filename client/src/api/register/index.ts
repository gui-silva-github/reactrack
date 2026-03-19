import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { IRegisterUserRequest } from "@/api/interfaces/requests/post/register"
import type { IPostResponse } from "@/api/interfaces/responses/post"

export const registerUser = async (backendUrl: string, payload: IRegisterUserRequest): Promise<IPostResponse> => {
    commonAxiosConfig()
    
    const { data } = await axios.post(backendUrl + '/auth/register', {
        name: payload.name, email: payload.email, password: payload.password
    })

    return data
}