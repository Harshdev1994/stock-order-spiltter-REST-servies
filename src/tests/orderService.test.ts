import { createOrder } from '../services/orderService'

describe('order service scheduling', () => {
  test('requestedAt on weekend schedules for next market open', () => {
    const req = {
      orderType: 'BUY' as const,
      totalAmount: 1000,
      modelPortfolio: [{ symbol: 'GOOG', weight: 1 }],
      requestedAt: '2026-07-11T12:00:00', // Saturday
    }

    const order = createOrder(req as any)
    const executeAt = new Date(order.items[0].executeAt)
    // executeAt must be after requestedAt
    expect(executeAt.getTime()).toBeGreaterThan(new Date(req.requestedAt).getTime())
  })
})
