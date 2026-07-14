import { Request, Response } from 'express'
import { orderSchema } from '../validators/orderValidator'
import { createOrder, getHistoricOrders } from '../services/orderService'

export const createOrderHandler = (req: Request, res: Response) => {
  const parseResult = orderSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() })
  }

  const result = createOrder(parseResult.data)
  if (!result.created) {
    return res.status(200).json({ message: result.message })
  }

  return res.status(201).json(result.order)
}

export const listOrdersHandler = (_req: Request, res: Response) => {
  const orders = getHistoricOrders()
  return res.json({ count: orders.length, orders })
}
