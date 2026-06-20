import { useState, useCallback } from 'react'
import { safeLocalStorageGet, safeLocalStorageSet } from '@/utils/sanitize'

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
