import { z } from 'zod'

export const modelStockSchema = z.object({
  symbol: z.string().trim().min(1),
  weight: z.number().nonnegative(),
  marketPrice: z.number().positive().optional(),
})

export const orderSchema = z.object({
  orderType: z.preprocess((value) => {
    if (typeof value === 'string') {
      return value.toUpperCase()
    }
    return value
  }, z.enum(['BUY', 'SELL'])),
  totalAmount: z.number().positive(),
  modelPortfolio: z.array(modelStockSchema).min(1),
  requestedAt: z.string().optional(),
})

export type ModelStock = z.infer<typeof modelStockSchema>
export type OrderRequest = z.infer<typeof orderSchema>
