import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { IGetResponse } from "@/api/interfaces/responses/get"

export const getAuthStateAPI = async (backendUrl: string): Promise<IGetResponse> => {
    commonAxiosConfig()

    const { data } = await axios.get(backendUrl + '/auth/is-auth')

    return data
}