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
})
