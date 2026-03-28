import { ProjectDataSource } from "./ProjectDataSource"

export interface AppDataSources {
  project: ProjectDataSource
}

export function createDataSources(): AppDataSources {
  return {
    project: new ProjectDataSource(),
  }
}
