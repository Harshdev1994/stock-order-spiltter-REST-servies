import { randomUUID } from 'crypto'
import { ModelStock, OrderRequest } from '../validators/orderValidator'
import { OrderCreateResult, OrderItem, OrderRecord } from '../models/order'
import { addOrder, getOrders } from '../memory/orderMemory'
import { DEFAULT_PRICE, DECIMAL_PLACES } from '../config'
import { roundQuantity } from '../utils/quantity'
import { isMarketOpen, nextMarketOpen } from '../utils/market'

const normalizePortfolio = (portfolio: ModelStock[]) => {
  const totalWeight = portfolio.reduce((sum, item) => sum + item.weight, 0)
  if (totalWeight <= 0) {
    throw new Error('Portfolio weights must sum to a positive value.')
  }

  return portfolio.map((item) => ({
    ...item,
    normalizedWeight: item.weight / totalWeight,
  }))
}

const formatExecutionMessage = (requestedDate: Date, executeDate: Date) => {
  const requestedDay = requestedDate.getDay()
  const isWeekend = requestedDay === 0 || requestedDay === 6

  if (isWeekend) {
    return `Market is closed on weekend. Orders will be executed on Monday at ${executeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`
  }

  return `Orders will be executed at ${executeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`
}

const calculateOrderItems = (request: OrderRequest, executeAtIso: string): OrderItem[] => {
  const normalized = normalizePortfolio(request.modelPortfolio)
  let totalAllocated = 0

  return normalized.map((item, index) => {
    const price = item.marketPrice && item.marketPrice > 0 ? item.marketPrice : DEFAULT_PRICE
    const rawAmount = request.totalAmount * item.normalizedWeight
    const isLast = index === normalized.length - 1
    const amountForCalculation = isLast ? request.totalAmount - totalAllocated : rawAmount
    const rawQuantity = amountForCalculation / price
    const quantity = roundQuantity(rawQuantity, DECIMAL_PLACES)
    const amount = Number((quantity * price).toFixed(2))

    if (isLast) {
      const remaining = request.totalAmount - totalAllocated
      const adjustedQuantity = roundQuantity(remaining / price, DECIMAL_PLACES)
      return {
        symbol: item.symbol,
        price,
        quantity: adjustedQuantity,
        amount: Number((adjustedQuantity * price).toFixed(2)),
        marketPriceUsed: Boolean(item.marketPrice),
        executeAt: executeAtIso,
      }
    }

    totalAllocated += amount
    return {
      symbol: item.symbol,
      price,
      quantity,
      amount,
      marketPriceUsed: Boolean(item.marketPrice),
      executeAt: executeAtIso,
    }
  })
}

export const createOrder = (request: OrderRequest): OrderCreateResult => {
  const requestedDate = request.requestedAt ? new Date(request.requestedAt) : new Date()
  const isOpen = isMarketOpen(requestedDate)
  const executeDate = isOpen ? requestedDate : nextMarketOpen(requestedDate)
  const executeAtIso = executeDate.toISOString()
  const message = formatExecutionMessage(requestedDate, executeDate)

  if (!isOpen) {
    return {
      created: false,
      message,
    }
  }

  const order: OrderRecord = {
    id: randomUUID(),
    orderType: request.orderType,
    totalAmount: request.totalAmount,
    decimalPlaces: DECIMAL_PLACES,
    createdAt: new Date().toISOString(),
    fixedPrice: DEFAULT_PRICE,
    message,
    items: calculateOrderItems(request, executeAtIso),
  }

  addOrder(order)
  return {
    created: true,
    order,
  }
}

export const getHistoricOrders = () => getOrders()
