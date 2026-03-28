import type { GraphQLContext } from "../../context"
import type { ProjectRecord } from "../../types/project"

export const projectQueries = {
  projects(
    _parent: unknown,
    args: { limit?: number | null; offset?: number | null; filter?: Record<string, unknown> | null },
    ctx: GraphQLContext
  ) {
    const limit = Math.min(Math.max(args.limit ?? 20, 1), 100)
    const offset = Math.max(args.offset ?? 0, 0)
    const filter = args.filter ?? undefined
    const { rows, total } = ctx.dataSources.project.filterAndPaginate({
      limit,
      offset,
      filter: filter as {
        isActive?: boolean | null
        framework?: string | null
        tag?: string | null
      },
    })
    const edges = rows.map((node, i) => ({
      cursor: Buffer.from(`${offset + i}:${node.id}`).toString("base64url"),
      node,
    }))
    const hasNextPage = offset + rows.length < total
    return {
      edges,
      pageInfo: {
        totalCount: total,
        limit,
        offset,
        hasNextPage,
      },
    }
  },

  project(_parent: unknown, args: { id: string }, ctx: GraphQLContext): ProjectRecord | null {
    return ctx.dataSources.project.findById(args.id) ?? null
  },

  searchProjects(
    _parent: unknown,
    args: { query: string },
    ctx: GraphQLContext
  ): ProjectRecord[] {
    return ctx.dataSources.project.search(args.query)
  },

  projectStats(_parent: unknown, _args: unknown, ctx: GraphQLContext) {
    return ctx.dataSources.project.stats()
  },
}
