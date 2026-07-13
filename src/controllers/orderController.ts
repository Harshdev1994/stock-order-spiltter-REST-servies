import { Request, Response } from 'express'
import { orderSchema } from '../validators/orderValidator'
import { createOrder, getHistoricOrders } from '../services/orderService'

export const createOrderHandler = (req: Request, res: Response) => {
  const parseResult = orderSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() })
  }

  const order = createOrder(parseResult.data)
  return res.status(201).json(order)
}

export const listOrdersHandler = (_req: Request, res: Response) => {
  const orders = getHistoricOrders()
  return res.json({ count: orders.length, orders })
}
