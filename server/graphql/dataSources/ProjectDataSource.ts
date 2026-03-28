import fs from "fs"
import path from "path"
import { randomBytes } from "crypto"
import type { ProjectRecord, RepositoryRecord } from "../../graphql/types/project"
import { resolveGraphqlRoot } from "../resolveGraphqlRoot"

function seedPath(): string {
  return path.join(resolveGraphqlRoot(), "seed", "projects.json")
}

export class ProjectDataSource {
  private projects: ProjectRecord[] = []

  constructor() {
    this.reloadFromDisk()
  }

  reloadFromDisk(): void {
    const p = seedPath()
    if (!fs.existsSync(p)) {
      this.projects = []
      return
    }
    const raw = fs.readFileSync(p, "utf8")
    this.projects = JSON.parse(raw) as ProjectRecord[]
  }

  private persist(): void {
    const p = seedPath()
    fs.writeFileSync(p, JSON.stringify(this.projects, null, 2), "utf8")
  }

  getAll(): ProjectRecord[] {
    return [...this.projects]
  }

  findById(id: string): ProjectRecord | undefined {
    return this.projects.find((p) => p.id === id)
  }

  filterAndPaginate(opts: {
    limit: number
    offset: number
    filter?: { isActive?: boolean | null; framework?: string | null; tag?: string | null }
  }): { rows: ProjectRecord[]; total: number } {
    let rows = this.getAll()
    const f = opts.filter
    if (f?.isActive !== undefined && f.isActive !== null) {
      rows = rows.filter((p) => p.isActive === f.isActive)
    }
    if (f?.framework) {
      rows = rows.filter((p) => (p.framework ?? "").toLowerCase() === f.framework!.toLowerCase())
    }
    if (f?.tag) {
      const t = f.tag.toLowerCase()
      rows = rows.filter((p) => p.tags.some((tag: string) => tag.toLowerCase().includes(t)))
    }
    const total = rows.length
    const slice = rows.slice(opts.offset, opts.offset + opts.limit)
    return { rows: slice, total }
  }

  search(query: string): ProjectRecord[] {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return this.projects.filter((p) => {
      const inName = p.name.toLowerCase().includes(q)
      const inDesc = (p.description ?? "").toLowerCase().includes(q)
      const inTags = p.tags.some((t: string) => t.toLowerCase().includes(q))
      return inName || inDesc || inTags
    })
  }

  stats(): {
    totalProjects: number
    activeProjects: number
    totalStars: number
    frameworks: string[]
  } {
    const totalProjects = this.projects.length
    const activeProjects = this.projects.filter((p) => p.isActive).length
    const totalStars = this.projects.reduce((s, p) => s + (p.stars ?? 0), 0)
    const fw = new Set<string>()
    for (const p of this.projects) {
      if (p.framework) fw.add(p.framework)
    }
    return {
      totalProjects,
      activeProjects,
      totalStars,
      frameworks: [...fw].sort(),
    }
  }

  create(input: Omit<ProjectRecord, "id" | "createdAt" | "updatedAt">): ProjectRecord {
    const now = new Date().toISOString()
    const id = `proj_${Date.now()}_${randomBytes(4).toString("hex")}`
    const row: ProjectRecord = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
      tags: input.tags ?? [],
      dependencies: input.dependencies ?? [],
    }
    this.projects.push(row)
    this.persist()
    return row
  }

  update(id: string, patch: Partial<ProjectRecord>): ProjectRecord | undefined {
    const idx = this.projects.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    const now = new Date().toISOString()
    const merged = { ...this.projects[idx], ...patch, id, updatedAt: now }
    this.projects[idx] = merged
    this.persist()
    return merged
  }

  delete(id: string): boolean {
    const idx = this.projects.findIndex((p) => p.id === id)
    if (idx === -1) return false
    this.projects.splice(idx, 1)
    this.persist()
    return true
  }

  linkRepository(projectId: string, repositoryUrl: string): ProjectRecord | undefined {
    const repo = this.parseRepository(repositoryUrl)
    return this.update(projectId, { repositoryUrl: repo.url, repository: repo })
  }

  private parseRepository(repositoryUrl: string): RepositoryRecord {
    const u = new URL(repositoryUrl)
    const host = u.hostname.toLowerCase()
    let provider = "git"
    if (host.includes("github")) provider = "github"
    else if (host.includes("gitlab")) provider = "gitlab"
    else if (host.includes("bitbucket")) provider = "bitbucket"
    return {
      url: u.toString(),
      provider,
      defaultBranch: "main",
    }
  }
}
