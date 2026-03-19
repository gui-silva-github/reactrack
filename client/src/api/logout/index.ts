import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { IPostResponse } from "@/api/interfaces/responses/post"

export const logoutAPI = async (backendUrl: string): Promise<IPostResponse> => {
    commonAxiosConfig()

    const { data } = await axios.post(backendUrl + '/auth/logout')

    return data
}