import userModel from "../../../models/user"
import type { GraphQLContext } from "../../context"

export const authQueries = {
  me(_parent: unknown, _args: unknown, context: GraphQLContext) {
    const u = context.user
    if (!u?.id) return null
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      isAccountVerified: u.isAccountVerified,
    }
  },

  async userData(_parent: unknown, _args: unknown, context: GraphQLContext) {
    const userId = context.user?.id
    if (!userId) {
      return {
        success: false,
        message: "Não autorizado! Logue novamente",
        userData: null,
      }
    }

    try {
      const user = await userModel.findById(userId)

      if (!user) {
        return { success: false, message: "Usuário não encontrado!", userData: null }
      }

      return {
        success: true,
        message: null,
        userData: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified ?? false,
        },
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro interno"
      return { success: false, message: msg, userData: null }
    }
  },

  isAuth(_parent: unknown, _args: unknown, context: GraphQLContext) {
    if (!context.user?.id) {
      return { success: false, message: "Não autorizado! Logue novamente" }
    }
    return { success: true, message: null }
  },
}
