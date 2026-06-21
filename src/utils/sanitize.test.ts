import { describe, it, expect } from 'vitest'
import { parseNumericInput, safeLocalStorageGet, safeLocalStorageSet } from '@/utils/sanitize'

describe('parseNumericInput()', () => {
  it('parses a plain integer string', () => {
    expect(parseNumericInput('42')).toBe(42)
  })

  it('parses a decimal string', () => {
    expect(parseNumericInput('3.5')).toBe(3.5)
  })

  it('strips non-numeric characters before parsing (e.g. currency symbols)', () => {
    expect(parseNumericInput('₹2,500')).toBe(2500)
  })

  it('returns NaN for an empty string', () => {
    expect(parseNumericInput('')).toBeNaN()
  })

  it('returns NaN for a string with no digits', () => {
    expect(parseNumericInput('abc')).toBeNaN()
  })

  it('trims surrounding whitespace before parsing', () => {
    expect(parseNumericInput('  100  ')).toBe(100)
  })
})

describe('safeLocalStorageGet() / safeLocalStorageSet()', () => {
  it('returns null when the key does not exist', () => {
    expect(safeLocalStorageGet('nonexistent_key_xyz')).toBeNull()
  })

  it('round-trips a JSON-serializable value through set then get', () => {
    const value = { id: 'ch_metro', done: true }
    const ok = safeLocalStorageSet('test_key', value)

    expect(ok).toBe(true)
    expect(safeLocalStorageGet('test_key')).toEqual(value)
  })

  it('returns null instead of throwing when stored JSON is corrupted', () => {
    localStorage.setItem('corrupted_key', '{not valid json')
    expect(safeLocalStorageGet('corrupted_key')).toBeNull()
  })

  it('returns false instead of throwing when the value cannot be JSON-serialized', () => {
    // A circular reference makes JSON.stringify throw a real TypeError —
    // this exercises the actual catch block, not a mocked one.
    const circular: Record<string, unknown> = { a: 1 }
    circular.self = circular

    const ok = safeLocalStorageSet('circular_key', circular)

    expect(ok).toBe(false)
    // And nothing should have been written for this key as a result.
    expect(safeLocalStorageGet('circular_key')).toBeNull()
  })

  it('round-trips an empty object and an empty array correctly', () => {
    expect(safeLocalStorageSet('empty_obj', {})).toBe(true)
    expect(safeLocalStorageGet('empty_obj')).toEqual({})

    expect(safeLocalStorageSet('empty_arr', [])).toBe(true)
    expect(safeLocalStorageGet('empty_arr')).toEqual([])
  })
})
