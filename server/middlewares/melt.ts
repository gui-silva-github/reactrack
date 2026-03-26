import { Request, Response, NextFunction } from "express"

export function meltMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.melt = function melt(statusCode: number, data: unknown): void {
    res.status(statusCode).json(data)
  }
  next()
}
