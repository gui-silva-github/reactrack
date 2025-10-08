import userModel from "../../models/user.js";
export const verifyEmailController = async (req, res) => {
    const { userId } = res.locals;
    const { otp } = req.body;
    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: 'Faltam detalhes...' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado!' });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(401).json({ success: false, message: 'OTP inválida!' });
        }
        if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now()) {
            return res.status(401).json({ success: false, message: 'OTP expirada!' });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.status(200).json({ success: true, message: 'Email verificado com sucesso!' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
