import { describe, it, expect } from 'vitest'
import { LifestyleFormSchema, SAMPLE_FORM } from '@/types/form'

describe('LifestyleFormSchema', () => {
  it('accepts the realistic SAMPLE_FORM profile', () => {
    const result = LifestyleFormSchema.safeParse(SAMPLE_FORM)
    expect(result.success).toBe(true)
  })

  it('rejects streamingHours above 24 (this exact bug previously broke form submission)', () => {
    const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, streamingHours: 80 })
    expect(result.success).toBe(false)
  })

  it('rejects familySize of 0 (minimum is 1 person)', () => {
    const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, familySize: 0 })
    expect(result.success).toBe(false)
  })

  it('accepts familySize of 1 (lower boundary)', () => {
    const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, familySize: 1 })
    expect(result.success).toBe(true)
  })

  it('accepts familySize of 50 (upper boundary) and rejects 51', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, familySize: 50 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, familySize: 51 }).success).toBe(false)
  })

  it('rejects a negative commute distance', () => {
    const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, commute: -5 })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid transport mode not in the enum', () => {
    const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, transport: 'Spaceship' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-numeric value for electricity', () => {
    const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, electricity: 'a lot' })
    expect(result.success).toBe(false)
  })

  // ── Boundary values for every remaining numeric field ─────────────────

  it('accepts commute at its upper boundary (500) and rejects one above it (501)', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, commute: 500 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, commute: 501 }).success).toBe(false)
  })

  it('accepts electricity at its upper boundary (100000) and rejects one above it', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, electricity: 100000 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, electricity: 100001 }).success).toBe(
      false,
    )
  })

  it('accepts acHours at its boundaries (0 and 24) and rejects values outside them', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, acHours: 0 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, acHours: 24 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, acHours: -1 }).success).toBe(false)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, acHours: 25 }).success).toBe(false)
  })

  it('accepts fanHours at its boundaries (0 and 24) and rejects values outside them', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, fanHours: 0 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, fanHours: 24 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, fanHours: 25 }).success).toBe(false)
  })

  it('accepts streamingHours at its exact upper boundary (24) and rejects 25', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, streamingHours: 24 }).success).toBe(
      true,
    )
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, streamingHours: 25 }).success).toBe(
      false,
    )
  })

  it('accepts deliveries at its upper boundary (200) and rejects one above it', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, deliveries: 200 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, deliveries: 201 }).success).toBe(false)
  })

  it('accepts purchases at its upper boundary (10000) and rejects one above it', () => {
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, purchases: 10000 }).success).toBe(true)
    expect(LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, purchases: 10001 }).success).toBe(
      false,
    )
  })

  it('rejects every numeric field when set to a negative value', () => {
    const fields: Array<keyof typeof SAMPLE_FORM> = [
      'commute',
      'electricity',
      'acHours',
      'fanHours',
      'deliveries',
      'purchases',
      'streamingHours',
    ]
    for (const field of fields) {
      const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, [field]: -1 })
      expect(result.success).toBe(false)
    }
  })

  it('accepts every valid WastageLevel enum value', () => {
    const levels = ['Very low', 'Low', 'Medium', 'High', 'Very high']
    for (const wastage of levels) {
      const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, wastage })
      expect(result.success).toBe(true)
    }
  })

  it('accepts every valid TransportMode enum value', () => {
    const modes = ['Car', 'Bike', 'Metro', 'Bus', 'Walk']
    for (const transport of modes) {
      const result = LifestyleFormSchema.safeParse({ ...SAMPLE_FORM, transport })
      expect(result.success).toBe(true)
    }
  })

  it('rejects a form that is missing a required field entirely', () => {
    const incomplete: Record<string, unknown> = { ...SAMPLE_FORM }
    delete incomplete.commute
    const result = LifestyleFormSchema.safeParse(incomplete)
    expect(result.success).toBe(false)
  })
})
