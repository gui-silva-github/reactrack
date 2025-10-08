export interface IUserData {
    _id: string;
    name: string;
    email: string;
    password: string;
    verifyOtp?: string;
    verifyOtpExpireAt?: number;
    isAccountVerified?: boolean;
    resetOtp: string;
    resetOtpExpireAt?: number;
}