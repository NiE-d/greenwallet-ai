import { useState, useCallback } from 'react'
import { safeLocalStorageGet, safeLocalStorageSet } from '@/utils/sanitize'

/**
 * A `useState`-like hook that automatically persists its value to
 * localStorage under the given key, and rehydrates from localStorage on
 * mount. Falls back to `initialValue` if no stored value exists or if
 * localStorage is unavailable (e.g. private browsing mode).
 *
 * @param key - The localStorage key to read from and write to.
 * @param initialValue - The value to use when nothing is stored yet.
 * @returns A `[value, setValue]` tuple, mirroring React's `useState` API.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = safeLocalStorageGet<T>(key)
    return item !== null ? item : initialValue
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
        safeLocalStorageSet(key, next)
        return next
      })
    },
    [key],
  )

  return [storedValue, setValue] as const
}
