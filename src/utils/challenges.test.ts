import { describe, it, expect } from 'vitest'
import { generateChallenges } from '@/utils/challenges'
import { SAMPLE_FORM, DEFAULT_FORM } from '@/types/form'
import type { LifestyleForm } from '@/types/form'

describe('generateChallenges()', () => {
  it('returns at most 6 challenges regardless of input', () => {
    const result = generateChallenges(SAMPLE_FORM)
    expect(result.length).toBeLessThanOrEqual(6)
  })

  it('includes a metro/transport challenge when transport mode is Car', () => {
    const form: LifestyleForm = { ...SAMPLE_FORM, transport: 'Car' }
    const result = generateChallenges(form)
    expect(result.some((c) => c.id === 'ch_metro')).toBe(true)
  })

  it('includes a metro/transport challenge when transport mode is Bike', () => {
    const form: LifestyleForm = { ...SAMPLE_FORM, transport: 'Bike' }
    const result = generateChallenges(form)
    expect(result.some((c) => c.id === 'ch_metro')).toBe(true)
  })

  it('omits the transport challenge entirely when already using Metro', () => {
    const form: LifestyleForm = { ...SAMPLE_FORM, transport: 'Metro' }
    const result = generateChallenges(form)
    expect(result.some((c) => c.id === 'ch_metro')).toBe(false)
    expect(result.some((c) => c.id === 'ch_walk')).toBe(false)
  })

  it('includes a cooking challenge only when deliveries exceed 2 per week', () => {
    const highDeliveries: LifestyleForm = { ...DEFAULT_FORM, deliveries: 5 }
    const lowDeliveries: LifestyleForm = { ...DEFAULT_FORM, deliveries: 1 }

    expect(generateChallenges(highDeliveries).some((c) => c.id === 'ch_cook')).toBe(true)
    expect(generateChallenges(lowDeliveries).some((c) => c.id === 'ch_cook')).toBe(false)
  })

  it('includes the AC challenge only when AC usage exceeds 3 hours/day', () => {
    const highAC: LifestyleForm = { ...DEFAULT_FORM, acHours: 6 }
    const lowAC: LifestyleForm = { ...DEFAULT_FORM, acHours: 1 }

    expect(generateChallenges(highAC).some((c) => c.id === 'ch_ac')).toBe(true)
    expect(generateChallenges(lowAC).some((c) => c.id === 'ch_ac')).toBe(false)
  })

  it('every returned challenge has a non-empty id, title, and reward', () => {
    const result = generateChallenges(SAMPLE_FORM)
    for (const challenge of result) {
      expect(challenge.id.length).toBeGreaterThan(0)
      expect(challenge.title.length).toBeGreaterThan(0)
      expect(challenge.reward.length).toBeGreaterThan(0)
    }
  })

  it('produces no duplicate challenge ids', () => {
    const result = generateChallenges(SAMPLE_FORM)
    const ids = result.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
