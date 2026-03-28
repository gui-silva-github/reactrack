import type { GraphQLResolveInfo, GraphQLSchema } from "graphql"
import { defaultFieldResolver, GraphQLError } from "graphql"
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils"
import type { GraphQLContext } from "../context"

export const authDirectiveName = "auth"

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD](fieldConfig) {
      const directive = getDirective(schema, fieldConfig, authDirectiveName)?.[0]
      if (!directive) return fieldConfig

      const { resolve = defaultFieldResolver } = fieldConfig

      return {
        ...fieldConfig,
        resolve(
          source: unknown,
          args: Record<string, unknown>,
          context: GraphQLContext,
          info: GraphQLResolveInfo
        ) {
          if (!context.user?.id) {
            throw new GraphQLError("Não autenticado", {
              extensions: { code: "UNAUTHENTICATED" },
            })
          }
          return resolve(source, args, context, info)
        },
      }
    },
  })
}
