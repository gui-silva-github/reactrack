export interface ILoginUserRequest {
  email: string;
  password: string;
}

export interface IRegisterUserRequest extends ILoginUserRequest {
  name: string;
}

export interface IVerifyEmailRequest {
  email: string;
  otp: string;
}

export interface IResetPasswordRequest extends IVerifyEmailRequest {
  newPassword: string;
}

export interface ISendResetOtpRequest {
  email: string;
}

export interface ISendVerifyOtpRequest extends ISendResetOtpRequest {}
