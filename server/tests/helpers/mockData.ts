export interface MockRegisterPayload {
  name: string
  email: string
  password: string
}

export interface MockCreatedUser {
  id: string
  name: string
  email: string
}

export interface MockLoginPayload {
  email: string
  password: string
}

export const mockRegisterPayload: MockRegisterPayload = {
  name: "Test User",
  email: "test@example.com",
  password: "StrongPassword@123",
}

export const mockCreatedUser: MockCreatedUser = {
  id: "507f1f77bcf86cd799439011",
  name: "Test User",
  email: "test@example.com",
}

export const mockLoginPayload: MockLoginPayload = {
  email: "test@example.com",
  password: "StrongPassword@123",
}

export const mockInvalidLoginPayload = {
  email: "",
  password: "",
}

export const mockResetOtpPayload = {
  email: "test@example.com",
  otp: "123456",
}

export const mockInvalidPayload = {
  name: "",
  email: null,
  password: "",
}
