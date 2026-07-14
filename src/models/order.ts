export type OrderItem = {
  symbol: string
  price: number
  quantity: number
  amount: number
  marketPriceUsed: boolean
  executeAt: string
}

export type OrderRecord = {
  id: string
  orderType: 'BUY' | 'SELL'
  totalAmount: number
  decimalPlaces: number
  createdAt: string
  fixedPrice: number
  message: string
  items: OrderItem[]
}

export type OrderCreateResult = {
  created: boolean
  message?: string
  order?: OrderRecord
}
