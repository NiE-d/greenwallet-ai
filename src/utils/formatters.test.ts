import { describe, it, expect } from 'vitest'
import { formatINR, formatNumber, formatKg, pluralize } from '@/utils/formatters'

describe('formatINR()', () => {
  it('formats a whole number with the rupee symbol and Indian digit grouping', () => {
    expect(formatINR(100000)).toBe('₹1,00,000')
  })

  it('rounds a decimal amount to the nearest rupee', () => {
    expect(formatINR(99.6)).toBe('₹100')
  })
})

describe('formatNumber()', () => {
  it('formats with Indian digit grouping and no currency symbol', () => {
    expect(formatNumber(1234567)).toBe('12,34,567')
  })
})

describe('formatKg()', () => {
  it('shows kg for values under 1000', () => {
    expect(formatKg(420)).toBe('420 kg')
  })

  it('switches to tonnes for values at or above 1000', () => {
    expect(formatKg(1500)).toBe('1.5 tonnes')
  })
})

describe('pluralize()', () => {
  it('returns the singular form for a count of exactly 1', () => {
    expect(pluralize(1, 'tree')).toBe('tree')
  })

  it('returns the default pluralized form (singular + s) for counts other than 1', () => {
    expect(pluralize(5, 'tree')).toBe('trees')
    expect(pluralize(0, 'tree')).toBe('trees')
  })
})
