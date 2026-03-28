import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "../../interfaces/jwt"
import userModel from "../../models/user"
import type { AppDataSources } from "../dataSources"

export interface GraphQLUser {
  id: string
  name: string
  email: string
  isAccountVerified: boolean
}

export interface GraphQLContext {
  req: Request
  res: Response
  user: GraphQLUser | null
  dataSources: AppDataSources
}

export async function buildContext(params: {
  req: Request
  res: Response
  dataSources: AppDataSources
}): Promise<GraphQLContext> {
  const { req, res, dataSources } = params
  let user: GraphQLUser | null = null
  const secret = process.env.JWT_SECRET
  const token = req.cookies?.token as string | undefined

  if (token && secret) {
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload
      if (decoded?.id) {
        const doc = await userModel.findById(decoded.id).lean()
        if (doc) {
          user = {
            id: String(doc._id),
            name: doc.name,
            email: doc.email,
            isAccountVerified: doc.isAccountVerified ?? false,
          }
        }
      }
    } catch {
      user = null
    }
  }

  return { req, res, user, dataSources }
}
