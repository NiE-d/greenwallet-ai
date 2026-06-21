import { describe, it, expect } from 'vitest'
import { getEquivalents } from '@/data/equivalents'

describe('getEquivalents()', () => {
  it('returns an empty array when amount is exactly 0', () => {
    expect(getEquivalents(0)).toEqual([])
  })

  it('returns an empty array when amount is negative', () => {
    expect(getEquivalents(-500)).toEqual([])
  })

  it('returns an empty array when amount is smaller than every item cost', () => {
    // The cheapest equivalent item costs more than ₹1 in the catalogue.
    expect(getEquivalents(1)).toEqual([])
  })

  it('returns at least one equivalent for a moderate amount', () => {
    const result = getEquivalents(1000)
    expect(result.length).toBeGreaterThan(0)
  })

  it('never returns more items than the requested count', () => {
    const result = getEquivalents(5000, 3)
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('every returned equivalent has a count of at least 1', () => {
    const result = getEquivalents(2000)
    for (const item of result) {
      expect(item.count).toBeGreaterThanOrEqual(1)
    }
  })

  it('does not return duplicate labels sharing the same first word (deduplication)', () => {
    const result = getEquivalents(5000, 10)
    const firstWords = result.map((item) => item.label.split(' ')[0])
    expect(new Set(firstWords).size).toBe(firstWords.length)
  })
})
