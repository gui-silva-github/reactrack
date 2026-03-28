import { GraphQLScalarType, Kind, type ValueNode } from "graphql"

export const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Valor JSON arbitrário",

  serialize(value: unknown): unknown {
    return value
  },

  parseValue(value: unknown): unknown {
    return value
  },

  parseLiteral(ast: ValueNode): unknown {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value) as unknown
      } catch {
        return ast.value
      }
    }
    if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.BOOLEAN) {
      return "value" in ast ? (ast as { value: unknown }).value : null
    }
    return null
  },
})
