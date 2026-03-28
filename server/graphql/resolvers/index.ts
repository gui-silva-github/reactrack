import { DateTimeScalar } from "../scalars/DateTime"
import { JSONScalar } from "../scalars/JSON"
import { URLScalar } from "../scalars/URL"
import { authMutations } from "./mutations/auth.mutations"
import { projectMutations } from "./mutations/project.mutations"
import { authQueries } from "./queries/auth.resolvers"

export const resolvers = {
  DateTime: DateTimeScalar,
  URL: URLScalar,
  JSON: JSONScalar,
  Query: {
    _schemaRoot: () => false,
    ...authQueries,
  },
  Mutation: {
    _schemaRoot: () => false,
    ...authMutations,
    ...projectMutations,
  },
}
