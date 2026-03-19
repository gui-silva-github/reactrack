import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { ILoginUserRequest } from "@/api/interfaces/requests/post/login"
import type { IPostResponse } from "@/api/interfaces/responses/post"

export const loginUser = async (backendUrl: string, payload: ILoginUserRequest): Promise<IPostResponse> => {
    commonAxiosConfig()

    const { data } = await axios.post(backendUrl + '/auth/login', {
        email: payload.email, password: payload.password
    })

    return data
}