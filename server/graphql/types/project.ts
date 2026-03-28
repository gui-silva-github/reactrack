export interface DependencyRecord {
  name: string
  version: string
  kind: string
}

export interface RepositoryRecord {
  url: string
  provider: string
  defaultBranch: string
}

export interface ProjectRecord {
  id: string
  name: string
  description?: string | null
  repositoryUrl?: string | null
  framework?: string | null
  version?: string | null
  stars?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
  dependencies: DependencyRecord[]
  repository?: RepositoryRecord | null
}
