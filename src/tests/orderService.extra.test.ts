import { createOrder } from '../services/orderService'
import { getOrders } from '../memory/orderMemory'

describe('order service additional cases', () => {
  beforeEach(() => {
    // memory is module-scoped; tests run in same process so orders accumulate across tests
  })

  test('decimal precision default 3 for marketPrice that produces repeating decimal', () => {
    const req = {
      orderType: 'BUY' as const,
      totalAmount: 100,
      modelPortfolio: [{ symbol: 'PENNY', weight: 1, marketPrice: 3 }],
    }

    const order = createOrder(req as any)
    const qty = order.items[0].quantity
    // 100 / 3 = 33.333333... rounded to 3 decimals -> 33.333
    expect(qty).toBeCloseTo(33.333, 3)
  })

  test('order create and get orders persistence in memory', () => {
    const initial = getOrders().length
    const req = {
      orderType: 'SELL' as const,
      totalAmount: 500,
      modelPortfolio: [{ symbol: 'A', weight: 1 }],
    }

    const order = createOrder(req as any)
    const all = getOrders()
    expect(all.length).toBeGreaterThanOrEqual(initial + 1)
    const found = all.find((o) => o.id === order.id)
    expect(found).toBeDefined()
  })

  test('splitter logic respects weights and sums to total amount', () => {
    const req = {
      orderType: 'BUY' as const,
      totalAmount: 1000,
      modelPortfolio: [
        { symbol: 'X', weight: 0.6 },
        { symbol: 'Y', weight: 0.4 },
      ],
    }

    const order = createOrder(req as any)
    const sum = order.items.reduce((s, it) => s + it.amount, 0)
    // Due to rounding, last item is adjusted; ensure sum equals requested total
    expect(Math.round(sum)).toBe(Math.round(req.totalAmount))
    // Check approximate allocation
    const x = order.items.find((i) => i.symbol === 'X')!
    const y = order.items.find((i) => i.symbol === 'Y')!
    expect(x.amount).toBeGreaterThanOrEqual(599)
    expect(y.amount).toBeGreaterThanOrEqual(399)
  })
})
