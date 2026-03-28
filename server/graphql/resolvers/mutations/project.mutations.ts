import type { GraphQLContext } from "../../context"
import type { ProjectRecord, DependencyRecord } from "../../types/project"

export const projectMutations = {
  createProject(
    _parent: unknown,
    args: { input: Record<string, unknown> },
    ctx: GraphQLContext
  ) {
    const input = args.input
    const deps = (input.dependencies as DependencyRecord[] | undefined) ?? []
    const row = ctx.dataSources.project.create({
      name: String(input.name),
      description: (input.description as string) ?? null,
      repositoryUrl: (input.repositoryUrl as string) ?? null,
      framework: (input.framework as string) ?? null,
      version: (input.version as string) ?? null,
      stars: typeof input.stars === "number" ? input.stars : 0,
      isActive: input.isActive !== false,
      tags: (input.tags as string[]) ?? [],
      dependencies: deps,
      repository: null,
    })
    return { success: true, message: null, project: row }
  },

  updateProject(
    _parent: unknown,
    args: { id: string; input: Record<string, unknown> },
    ctx: GraphQLContext
  ) {
    const patch: Partial<ProjectRecord> = {}
    const input = args.input
    if (input.name !== undefined) patch.name = String(input.name)
    if (input.description !== undefined) patch.description = input.description as string | null
    if (input.repositoryUrl !== undefined) patch.repositoryUrl = input.repositoryUrl as string | null
    if (input.framework !== undefined) patch.framework = input.framework as string | null
    if (input.version !== undefined) patch.version = input.version as string | null
    if (input.stars !== undefined) patch.stars = input.stars as number
    if (input.isActive !== undefined) patch.isActive = Boolean(input.isActive)
    if (input.tags !== undefined) patch.tags = input.tags as string[]
    if (input.dependencies !== undefined) patch.dependencies = input.dependencies as DependencyRecord[]

    const updated = ctx.dataSources.project.update(args.id, patch)
    if (!updated) {
      return { success: false, message: "Projeto não encontrado", project: null }
    }
    return { success: true, message: null, project: updated }
  },

  deleteProject(_parent: unknown, args: { id: string }, ctx: GraphQLContext) {
    const ok = ctx.dataSources.project.delete(args.id)
    if (!ok) {
      return { success: false, message: "Projeto não encontrado", deletedId: null }
    }
    return { success: true, message: null, deletedId: args.id }
  },

  linkRepository(
    _parent: unknown,
    args: { projectId: string; repositoryUrl: string },
    ctx: GraphQLContext
  ) {
    try {
      const updated = ctx.dataSources.project.linkRepository(args.projectId, args.repositoryUrl)
      if (!updated) {
        return { success: false, message: "Projeto não encontrado", project: null }
      }
      return { success: true, message: null, project: updated }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "URL inválida"
      return { success: false, message: msg, project: null }
    }
  },
}
