import express from "express"
import {
    isAuthenticated, login, logout,
    register, resetPassword, sendResetOtp,
    sendVerifyOtp, validateResetOtp, verifyEmail
} from "../controllers/auth"
import userAuth from "../middleware/userAuth"

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)

authRouter.get('/is-auth', userAuth, isAuthenticated)

authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/validate-reset-otp', validateResetOtp)
authRouter.post('/reset-password', resetPassword)

// GET handlers for browser navigation (User Experience fix)
const methodNotAllowedInfoHandler = (action: string) => (req: express.Request, res: express.Response) => {
    res.melt(200, {
        message: `Endpoint '${action}' exists. Please use POST method to interact with it.`,
        method: 'GET received, expected POST'
    })
}

authRouter.get('/register', methodNotAllowedInfoHandler('register'))
authRouter.get('/login', methodNotAllowedInfoHandler('login'))
authRouter.get('/logout', methodNotAllowedInfoHandler('logout'))
authRouter.get('/send-verify-otp', methodNotAllowedInfoHandler('send-verify-otp'))
authRouter.get('/verify-account', methodNotAllowedInfoHandler('verify-account'))
authRouter.get('/send-reset-otp', methodNotAllowedInfoHandler('send-reset-otp'))
authRouter.get('/validate-reset-otp', methodNotAllowedInfoHandler('validate-reset-otp'))
authRouter.get('/reset-password', methodNotAllowedInfoHandler('reset-password'))

export default authRouter