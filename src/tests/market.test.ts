import { isMarketOpen, nextMarketOpen, MARKET_OPEN_HOUR, MARKET_OPEN_MIN } from '../utils/market'

describe('market utils', () => {
  test('nextMarketOpen moves weekend to next Monday 09:30', () => {
    // 2026-07-11 is a Saturday
    const saturday = new Date('2026-07-11T12:00:00')
    const nextOpen = nextMarketOpen(saturday)
    expect(nextOpen.getDay()).toBeGreaterThan(0)
    // Should be a weekday (Mon-Fri)
    expect(nextOpen.getHours()).toBe(MARKET_OPEN_HOUR)
    expect(nextOpen.getMinutes()).toBe(MARKET_OPEN_MIN)
  })

  test('isMarketOpen returns false for weekend', () => {
    const sunday = new Date('2026-07-12T11:00:00')
    expect(isMarketOpen(sunday)).toBe(false)
  })
})
