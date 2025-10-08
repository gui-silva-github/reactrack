import userModel from "../../models/user.js";
export const getDataController = async (req, res) => {
    try {
        const { userId } = res.locals;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado!' });
        }
        res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
