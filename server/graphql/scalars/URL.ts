import { GraphQLScalarType, Kind, type ValueNode } from "graphql"

function assertHttpUrl(raw: string): string {
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    throw new TypeError("URL inválida")
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new TypeError("URL deve ser http ou https")
  }
  return u.toString()
}

export const URLScalar = new GraphQLScalarType({
  name: "URL",
  description: "URL absoluta http(s)",

  serialize(value: unknown): string {
    if (typeof value !== "string") throw new TypeError("URL espera string")
    return assertHttpUrl(value)
  },

  parseValue(value: unknown): string {
    if (typeof value !== "string") throw new TypeError("URL espera string")
    return assertHttpUrl(value)
  },

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) throw new TypeError("URL espera string")
    return assertHttpUrl(ast.value)
  },
})
