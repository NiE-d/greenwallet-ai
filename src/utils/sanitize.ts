/**
 * Safely parse a numeric input value.
 * Returns NaN if the string is not a valid finite number.
 */
export function parseNumericInput(value: string): number {
  const trimmed = value.trim().replace(/[^0-9.]/g, '')
  const parsed = parseFloat(trimmed)
  return isFinite(parsed) ? parsed : NaN
}

/**
 * Safely read from localStorage. Returns null on any error.
 */
export function safeLocalStorageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Safely write to localStorage. Returns false if it fails (e.g. private mode quota).
 */
export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
