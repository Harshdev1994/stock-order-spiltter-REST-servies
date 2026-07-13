import { OrderRecord } from '../models/order'

const historicalOrders: OrderRecord[] = []

export const addOrder = (order: OrderRecord) => {
  historicalOrders.push(order)
}

export const getOrders = () => [...historicalOrders]
