import { Request, Response, NextFunction } from 'express'

export const timedLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint()
  res.once('finish', () => {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1_000_000
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${durationMs.toFixed(2)}ms`)
  })
  next()
}
