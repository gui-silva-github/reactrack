import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { IVerifyAccountRequest } from "@/api/interfaces/requests/post/verify"
import type { IPostResponse } from "@/api/interfaces/responses/post"

export const verifyAccount = async (backendUrl: string, payload: IVerifyAccountRequest): Promise<IPostResponse> => {
    commonAxiosConfig()

    const { data } = await axios.post(backendUrl + '/auth/verify-account', {
        otp: payload.otp,
    })

    return data
}