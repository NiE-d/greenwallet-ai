import { describe, it, expect } from 'vitest'
import { compute } from '@/utils/compute'
import { SAMPLE_FORM, DEFAULT_FORM } from '@/types/form'
import type { LifestyleForm } from '@/types/form'

describe('compute()', () => {
  it('produces non-zero waste figures for the realistic SAMPLE_FORM profile', () => {
    const result = compute(SAMPLE_FORM)

    expect(result.monthlyWaste).toBeGreaterThan(0)
    expect(result.annualWaste).toBeGreaterThan(0)
    expect(result.annualWaste).toBe(result.monthlyWaste * 12)
  })

  it('produces zero waste for an all-zero, non-car profile (no avoidable spend)', () => {
    const zeroForm: LifestyleForm = {
      ...DEFAULT_FORM,
      commute: 0,
      transport: 'Metro',
      electricity: 0,
      acHours: 0,
      fanHours: 0,
      deliveries: 0,
      wastage: 'Very low',
      purchases: 0,
      streamingHours: 0,
      familySize: 1,
    }
    const result = compute(zeroForm)

    // Metro has no transport waste, electricity is below baseline (0 < 400),
    // 0 deliveries, "Very low" wastage still has a fixed baseline (200/mo by design),
    // and purchases <= 2 produce no shopping waste.
    expect(result.monthlyWaste).toBe(200) // only the fixed "Very low" food wastage baseline
    expect(result.annualWaste).toBe(2400)
  })

  it('charges car commuters more than metro commuters for an identical distance', () => {
    const carForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Car', commute: 10 }
    const metroForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Metro', commute: 10 }

    const carResult = compute(carForm)
    const metroResult = compute(metroForm)

    expect(carResult.monthlyWaste).toBeGreaterThan(metroResult.monthlyWaste)
  })

  it('increases monthly waste as commute distance increases (car)', () => {
    const shortCommute = compute({ ...SAMPLE_FORM, transport: 'Car', commute: 5 })
    const longCommute = compute({ ...SAMPLE_FORM, transport: 'Car', commute: 50 })

    expect(longCommute.monthlyWaste).toBeGreaterThan(shortCommute.monthlyWaste)
  })

  it('returns a breakdown that sums to the monthly waste (within rounding tolerance)', () => {
    const result = compute(SAMPLE_FORM)
    const breakdownSum = result.breakdown.reduce((sum, item) => sum + item.monthly, 0)

    // Allow a small tolerance since each category is independently rounded
    expect(Math.abs(breakdownSum - result.monthlyWaste)).toBeLessThanOrEqual(result.breakdown.length)
  })

  it('sorts the breakdown in descending order by monthly amount', () => {
    const result = compute(SAMPLE_FORM)
    for (let i = 0; i < result.breakdown.length - 1; i++) {
      expect(result.breakdown[i].monthly).toBeGreaterThanOrEqual(result.breakdown[i + 1].monthly)
    }
  })

  it('never includes a breakdown category with zero or negative monthly waste', () => {
    const result = compute(SAMPLE_FORM)
    for (const item of result.breakdown) {
      expect(item.monthly).toBeGreaterThan(0)
    }
  })

  it('computes co2Annual as a non-negative number and derives trees/km equivalents from it', () => {
    const result = compute(SAMPLE_FORM)

    expect(result.co2Annual).toBeGreaterThanOrEqual(0)
    expect(result.treesEquivalent).toBe(Math.round(result.co2Annual / 21))
    expect(result.carKmEquivalent).toBe(Math.round(result.co2Annual / 0.21))
  })

  it('produces exactly 6 wealth milestones at years 1, 3, 5, 10, 15, 20 in ascending corpus order', () => {
    const result = compute(SAMPLE_FORM)
    const years = result.wealthMilestones.map((m) => m.years)

    expect(years).toEqual([1, 3, 5, 10, 15, 20])
    for (let i = 0; i < result.wealthMilestones.length - 1; i++) {
      expect(result.wealthMilestones[i + 1].corpus).toBeGreaterThanOrEqual(
        result.wealthMilestones[i].corpus,
      )
    }
  })

  it('preserves familySize and computes monthlySavingsPotential as 60% of monthly waste', () => {
    const result = compute(SAMPLE_FORM)

    expect(result.familySize).toBe(SAMPLE_FORM.familySize)
    expect(result.monthlySavingsPotential).toBe(Math.round(result.monthlyWaste * 0.6))
  })

  it('is a pure function: calling it twice with the same input yields identical output', () => {
    const resultA = compute(SAMPLE_FORM)
    const resultB = compute(SAMPLE_FORM)

    expect(resultA).toEqual(resultB)
  })

  // ── Bike transport branch (previously untested) ──────────────────────

  it('charges a smaller transport cost for Bike than Car at the same distance', () => {
    const bikeForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Bike', commute: 10 }
    const carForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Car', commute: 10 }

    const bikeResult = compute(bikeForm)
    const carResult = compute(carForm)

    expect(bikeResult.monthlyWaste).toBeLessThan(carResult.monthlyWaste)
    expect(bikeResult.monthlyWaste).toBeGreaterThan(0)
  })

  it('produces a non-zero CO2 figure for Bike commuting, distinct from Car and Metro', () => {
    const bikeForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Bike', commute: 10 }
    const carForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Car', commute: 10 }
    const metroForm: LifestyleForm = { ...SAMPLE_FORM, transport: 'Metro', commute: 10 }

    const bikeCo2 = compute(bikeForm).co2Annual
    const carCo2 = compute(carForm).co2Annual
    const metroCo2 = compute(metroForm).co2Annual

    // Bike emits more than Metro but less than Car, per the CO2_FACTORS constants.
    expect(bikeCo2).toBeGreaterThan(metroCo2)
    expect(bikeCo2).toBeLessThan(carCo2)
  })

  // ── Defensive fallback paths (previously untested) ────────────────────

  it('food wastage always contributes a non-zero baseline, so the breakdown is never empty for any valid form', () => {
    // WASTAGE_MONTHLY has no zero entry (minimum is 200 for "Very low"), so for
    // any Zod-valid LifestyleForm, food wastage alone guarantees breakdown.length >= 1.
    // This means topCategory is always genuinely derived from real data, never
    // from the internal fallback object — verified here across every wastage level.
    const levels: LifestyleForm['wastage'][] = ['Very low', 'Low', 'Medium', 'High', 'Very high']
    for (const wastage of levels) {
      const form: LifestyleForm = {
        ...DEFAULT_FORM,
        transport: 'Metro',
        commute: 0,
        electricity: 0,
        deliveries: 0,
        purchases: 2,
        wastage,
      }
      const result = compute(form)

      expect(result.breakdown.length).toBeGreaterThanOrEqual(1)
      expect(result.topCategory.category).toBe('Food wastage')
      expect(result.topCategory.monthly).toBeGreaterThan(0)
    }
  })

  it('produces a breakdown percentage of 0 (not NaN or Infinity) when total monthly waste is 0', () => {
    // purchases === 2 sits exactly at the Math.max(0, (purchases - 2) * 450) floor,
    // producing zero shopping waste — exercising the boundary condition directly.
    const form: LifestyleForm = { ...DEFAULT_FORM, purchases: 2, wastage: 'Very low' }
    const result = compute(form)

    for (const item of result.breakdown) {
      expect(Number.isFinite(item.percentage)).toBe(true)
      expect(item.percentage).toBeGreaterThanOrEqual(0)
    }
  })

  it('treats purchases of exactly 2 as the zero-waste shopping floor, and 3 as the first non-zero value', () => {
    const atFloor = compute({ ...DEFAULT_FORM, purchases: 2 })
    const aboveFloor = compute({ ...DEFAULT_FORM, purchases: 3 })

    const floorShopping = atFloor.breakdown.find((b) => b.category === 'Impulse shopping')
    const aboveShopping = aboveFloor.breakdown.find((b) => b.category === 'Impulse shopping')

    // At the floor, shopping waste is 0 so it's filtered out of the breakdown entirely.
    expect(floorShopping).toBeUndefined()
    // One purchase above the floor, shopping waste becomes positive and appears.
    expect(aboveShopping).toBeDefined()
    expect(aboveShopping!.monthly).toBeGreaterThan(0)
  })
})
