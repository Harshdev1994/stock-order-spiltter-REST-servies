import { createOrder } from '../services/orderService'

describe('order service scheduling', () => {
  test('requestedAt on weekend schedules for next market open', () => {
    const req = {
      orderType: 'BUY' as const,
      totalAmount: 1000,
      modelPortfolio: [{ symbol: 'GOOG', weight: 1 }],
      requestedAt: '2026-07-11T12:00:00', // Saturday
    }

    const result = createOrder(req as any)
    expect(result.created).toBe(false)
    expect(result.message).toContain('weekend')
    expect(result.order).toBeUndefined()
  })
})
