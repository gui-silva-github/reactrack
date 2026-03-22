import { registerController } from "./auth/register"
import { loginController } from "./auth/login"
import { logoutController } from "./auth/logout"
import { sendVerifyOtpController } from "./auth/verifyOtp"
import { verifyEmailController } from "./auth/verifyEmail"
import { isAuthController } from "./auth/isAuth"
import { resetOtpController } from "./auth/resetOtp"
import { validateResetOtpController } from "./auth/validateResetOtp"
import { resetPasswordController } from "./auth/resetPassword"

export const register = registerController

export const login = loginController

export const logout = logoutController

export const sendVerifyOtp = sendVerifyOtpController

export const verifyEmail = verifyEmailController

export const isAuthenticated = isAuthController

export const sendResetOtp = resetOtpController

export const validateResetOtp = validateResetOtpController

export const resetPassword = resetPasswordController