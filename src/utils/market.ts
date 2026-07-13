export const MARKET_OPEN_HOUR = 9
export const MARKET_OPEN_MIN = 30
export const MARKET_CLOSE_HOUR = 16
export const MARKET_CLOSE_MIN = 0

const isWeekday = (d: Date) => {
  const day = d.getDay()
  return day >= 1 && day <= 5
}

export const isMarketOpen = (d: Date): boolean => {
  if (!isWeekday(d)) return false
  const hours = d.getHours()
  const mins = d.getMinutes()

  const beforeOpen = hours < MARKET_OPEN_HOUR || (hours === MARKET_OPEN_HOUR && mins < MARKET_OPEN_MIN)
  const afterClose = hours > MARKET_CLOSE_HOUR || (hours === MARKET_CLOSE_HOUR && mins >= MARKET_CLOSE_MIN)
  return !beforeOpen && !afterClose
}

export const nextMarketOpen = (d: Date): Date => {
  const date = new Date(d.getTime())

  // If today is weekday and before open -> same day at open
  const todayBeforeOpen = isWeekday(date) && (date.getHours() < MARKET_OPEN_HOUR || (date.getHours() === MARKET_OPEN_HOUR && date.getMinutes() < MARKET_OPEN_MIN))
  if (todayBeforeOpen) {
    date.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MIN, 0, 0)
    return date
  }

  // Advance to next day until weekday
  do {
    date.setDate(date.getDate() + 1)
    date.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MIN, 0, 0)
  } while (!isWeekday(date))

  return date
}
