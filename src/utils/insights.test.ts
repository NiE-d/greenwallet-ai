import { describe, it, expect } from 'vitest'
import { generateInsights } from '@/utils/insights'
import { SAMPLE_FORM, DEFAULT_FORM } from '@/types/form'
import type { LifestyleForm } from '@/types/form'

const zeroAmounts = {
  transportMonthly: 0,
  deliveryMonthly: 0,
  wasteMonthly: 0,
  electricityMonthly: 0,
  shoppingMonthly: 0,
}

describe('generateInsights()', () => {
  // ── Bike commuting branch (previously completely untested) ───────────

  it('generates a bike-commuting insight when transport is Bike and commute exceeds 5km', () => {
    const form: LifestyleForm = { ...SAMPLE_FORM, transport: 'Bike', commute: 10 }
    const result = generateInsights(form, { ...zeroAmounts, transportMonthly: 500 })

    const transportInsight = result.find((i) => i.id === 'transport')
    expect(transportInsight).toBeDefined()
    expect(transportInsight!.title).toContain('Bike commuting')
    expect(transportInsight!.badgeType).toBe('gold')
  })

  it('omits the bike insight when commute is at or below the 5km threshold', () => {
    const form: LifestyleForm = { ...SAMPLE_FORM, transport: 'Bike', commute: 5 }
    const result = generateInsights(form, { ...zeroAmounts, transportMonthly: 500 })

    expect(result.some((i) => i.id === 'transport')).toBe(false)
  })

  it('omits any transport insight for Metro, Bus, or Walk regardless of commute distance', () => {
    for (const mode of ['Metro', 'Bus', 'Walk'] as const) {
      const form: LifestyleForm = { ...SAMPLE_FORM, transport: mode, commute: 50 }
      const result = generateInsights(form, { ...zeroAmounts, transportMonthly: 500 })
      expect(result.some((i) => i.id === 'transport')).toBe(false)
    }
  })

  // ── Exact boundary conditions for every insight category ─────────────

  it('requires commute > 3 (not >=) for the Car transport insight to appear', () => {
    const atBoundary: LifestyleForm = { ...SAMPLE_FORM, transport: 'Car', commute: 3 }
    const aboveBoundary: LifestyleForm = { ...SAMPLE_FORM, transport: 'Car', commute: 4 }

    expect(
      generateInsights(atBoundary, { ...zeroAmounts, transportMonthly: 100 }).some(
        (i) => i.id === 'transport',
      ),
    ).toBe(false)
    expect(
      generateInsights(aboveBoundary, { ...zeroAmounts, transportMonthly: 100 }).some(
        (i) => i.id === 'transport',
      ),
    ).toBe(true)
  })

  it('requires deliveries > 2 (not >=) for the delivery insight to appear', () => {
    const atBoundary: LifestyleForm = { ...DEFAULT_FORM, deliveries: 2 }
    const aboveBoundary: LifestyleForm = { ...DEFAULT_FORM, deliveries: 3 }

    expect(
      generateInsights(atBoundary, { ...zeroAmounts, deliveryMonthly: 100 }).some(
        (i) => i.id === 'delivery',
      ),
    ).toBe(false)
    expect(
      generateInsights(aboveBoundary, { ...zeroAmounts, deliveryMonthly: 100 }).some(
        (i) => i.id === 'delivery',
      ),
    ).toBe(true)
  })

  it('excludes the wastage insight for "Very low" and "Low" but includes it for "Medium" and above', () => {
    const veryLow: LifestyleForm = { ...DEFAULT_FORM, wastage: 'Very low' }
    const low: LifestyleForm = { ...DEFAULT_FORM, wastage: 'Low' }
    const medium: LifestyleForm = { ...DEFAULT_FORM, wastage: 'Medium' }
    const veryHigh: LifestyleForm = { ...DEFAULT_FORM, wastage: 'Very high' }

    expect(
      generateInsights(veryLow, { ...zeroAmounts, wasteMonthly: 100 }).some((i) => i.id === 'wastage'),
    ).toBe(false)
    expect(
      generateInsights(low, { ...zeroAmounts, wasteMonthly: 100 }).some((i) => i.id === 'wastage'),
    ).toBe(false)
    expect(
      generateInsights(medium, { ...zeroAmounts, wasteMonthly: 100 }).some((i) => i.id === 'wastage'),
    ).toBe(true)
    expect(
      generateInsights(veryHigh, { ...zeroAmounts, wasteMonthly: 100 }).some((i) => i.id === 'wastage'),
    ).toBe(true)
  })

  it('requires electricityMonthly > 100 (not >=) for the electricity insight to appear', () => {
    const atBoundary = generateInsights(DEFAULT_FORM, { ...zeroAmounts, electricityMonthly: 100 })
    const aboveBoundary = generateInsights(DEFAULT_FORM, { ...zeroAmounts, electricityMonthly: 101 })

    expect(atBoundary.some((i) => i.id === 'electricity')).toBe(false)
    expect(aboveBoundary.some((i) => i.id === 'electricity')).toBe(true)
  })

  it('requires purchases > 3 (not >=) for the shopping insight to appear', () => {
    const atBoundary: LifestyleForm = { ...DEFAULT_FORM, purchases: 3 }
    const aboveBoundary: LifestyleForm = { ...DEFAULT_FORM, purchases: 4 }

    expect(
      generateInsights(atBoundary, { ...zeroAmounts, shoppingMonthly: 100 }).some(
        (i) => i.id === 'shopping',
      ),
    ).toBe(false)
    expect(
      generateInsights(aboveBoundary, { ...zeroAmounts, shoppingMonthly: 100 }).some(
        (i) => i.id === 'shopping',
      ),
    ).toBe(true)
  })

  // ── Zero / empty edge case ────────────────────────────────────────────

  it('returns an empty array when no category crosses any insight threshold', () => {
    const minimalForm: LifestyleForm = {
      ...DEFAULT_FORM,
      transport: 'Metro',
      commute: 0,
      deliveries: 0,
      wastage: 'Very low',
      purchases: 0,
    }
    const result = generateInsights(minimalForm, zeroAmounts)

    expect(result).toEqual([])
  })

  it('every generated insight has a positive monthlyLoss and a non-empty co2Impact string', () => {
    const result = generateInsights(SAMPLE_FORM, {
      transportMonthly: 800,
      deliveryMonthly: 600,
      wasteMonthly: 400,
      electricityMonthly: 300,
      shoppingMonthly: 500,
    })

    expect(result.length).toBeGreaterThan(0)
    for (const insight of result) {
      expect(insight.monthlyLoss).toBeGreaterThan(0)
      expect(insight.co2Impact.length).toBeGreaterThan(0)
    }
  })
})
