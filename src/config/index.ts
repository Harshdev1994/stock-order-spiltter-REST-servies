import dotenv from 'dotenv'

dotenv.config()

export const PORT = Number(process.env.PORT ?? 4000)
export const DEFAULT_PRICE = 100
export const DECIMAL_PLACES = Number(process.env.DECIMAL_PLACES ?? 3)
