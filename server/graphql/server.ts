import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { expressMiddleware } from "@as-integrations/express5"
import { makeExecutableSchema } from "@graphql-tools/schema"
import cors from "cors"
import type { Express } from "express"
import { authDirectiveTransformer } from "./directives/auth.directive"
import { buildContext } from "./context"
import { createDataSources } from "./dataSources"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"

export async function startGraphQL(app: Express): Promise<void> {
  let schema = makeExecutableSchema({ typeDefs, resolvers })
  schema = authDirectiveTransformer(schema)

  const apollo = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
      }),
    ],
  })
  await apollo.start()

  app.use(
    "/graphql",
    cors({
      origin: false,
      credentials: true,
    }),
    expressMiddleware(apollo, {
      context: async ({ req, res }) => buildContext({ req, res, dataSources: createDataSources() }),
    })
  )
}
