declare namespace Express {
  interface Response {
    melt(statusCode: number, data: unknown): void
  }
}
