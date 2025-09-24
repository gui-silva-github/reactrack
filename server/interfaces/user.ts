import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  verifyOtp?: string;
  verifyOtpExpireAt?: number;
  isAccountVerified?: boolean;
  resetOtp?: string;
  resetOtpExpireAt?: number;
}