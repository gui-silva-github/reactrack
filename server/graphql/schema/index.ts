import fs from "fs"
import path from "path"
import gql from "graphql-tag"
import { resolveGraphqlRoot } from "../resolveGraphqlRoot"

const schemaDir = path.join(resolveGraphqlRoot(), "schema")

const files = [
  path.join(schemaDir, "types", "root.graphql"),
  path.join(schemaDir, "types", "scalars.graphql"),
  path.join(schemaDir, "types", "Dependency.graphql"),
  path.join(schemaDir, "types", "Repository.graphql"),
  path.join(schemaDir, "types", "Project.graphql"),
  path.join(schemaDir, "types", "project.connection.graphql"),
  path.join(schemaDir, "types", "auth.graphql"),
  path.join(schemaDir, "queries", "auth.queries.graphql"),
  path.join(schemaDir, "mutations", "auth.mutations.graphql"),
  path.join(schemaDir, "queries", "project.queries.graphql"),
  path.join(schemaDir, "mutations", "project.mutations.graphql"),
]

export const typeDefs = files.map((f) => gql(fs.readFileSync(f, "utf8")))
