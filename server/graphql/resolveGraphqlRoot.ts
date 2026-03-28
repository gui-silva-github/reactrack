import fs from "fs"
import path from "path"

function hasSchemaDir(root: string): boolean {
  return fs.existsSync(path.join(root, "schema", "types", "scalars.graphql"))
}

export function resolveGraphqlRoot(): string {
  const candidates = [
    path.join(process.cwd(), "graphql"),
    path.join(process.cwd(), "server", "graphql"),
    path.join(__dirname, "graphql"),
    path.join(__dirname, "..", "graphql"),
    path.join(__dirname, "..", "..", "graphql"),
  ]

  for (const root of candidates) {
    if (hasSchemaDir(root)) return root
  }

  return path.join(process.cwd(), "graphql")
}
