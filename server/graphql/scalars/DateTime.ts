import { GraphQLScalarType, Kind } from "graphql"

export const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "Data/hora em ISO-8601",

  serialize(value: unknown): string {
    if (value instanceof Date) return value.toISOString()
    if (typeof value === "string") return new Date(value).toISOString()
    throw new TypeError("DateTime não pode serializar este valor")
  },

  parseValue(value: unknown): Date {
    if (typeof value !== "string") throw new TypeError("DateTime espera string")
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) throw new TypeError("DateTime inválido")
    return d
  },

  parseLiteral(ast): Date {
    if (ast.kind !== Kind.STRING) throw new TypeError("DateTime espera string")
    const d = new Date(ast.value)
    if (Number.isNaN(d.getTime())) throw new TypeError("DateTime inválido")
    return d
  },
})
