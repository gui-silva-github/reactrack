import type { Response } from "express"

export const TOKEN_COOKIE = "token"

export function getAuthCookieOptions(): {
  httpOnly: boolean
  secure: boolean
  sameSite: "strict" | "none"
  maxAge: number
} {
  const prod = process.env.NODE_ENV === "production"
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

export function clearAuthCookie(res: Response): void {
  const prod = process.env.NODE_ENV === "production"
  res.clearCookie(TOKEN_COOKIE, {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}
