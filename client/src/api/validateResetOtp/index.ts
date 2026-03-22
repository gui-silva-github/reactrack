import axios from "axios"
import { commonAxiosConfig } from "@/utils/commonAxios"
import type { IValidateResetOtpRequest } from "@/api/interfaces/requests/post/validateResetOtp"
import type { IPostResponse } from "@/api/interfaces/responses/post"

export const validateResetOtp = async (backendUrl: string, payload: IValidateResetOtpRequest): Promise<IPostResponse> => {
    commonAxiosConfig()

    const { data } = await axios.post(backendUrl + '/auth/validate-reset-otp', {
        email: payload.email,
        otp: payload.otp
    })

    return data
}
