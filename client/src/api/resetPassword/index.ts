import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { ISendResetPasswordRequest } from "@/api/interfaces/requests/post/resetPassword"
import type { IPostResponse } from "@/api/interfaces/responses/post"

export const sendResetPassword = async (backendUrl: string, payload: ISendResetPasswordRequest): Promise<IPostResponse> => {
    commonAxiosConfig()

    const { data } = await axios.post(backendUrl + '/auth/reset-password', {
        email: payload.email, otp: payload.otp, newPassword: payload.newPassword
    })

    return data
}