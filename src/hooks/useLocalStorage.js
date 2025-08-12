import { useEffect } from 'react'

/**
 * Persist values to localStorage whenever deps change.
 * pairs: Array of [key, value, serializer?]. If serializer provided, it's used to turn value into string.
 */
export function useLocalStoragePersist(pairs, deps) {
  useEffect(() => {
    try {
      for (const entry of pairs) {
        if (!entry) continue
        const [key, value, serializer] = entry
        const str = serializer ? serializer(value) : String(value)
        localStorage.setItem(key, str)
      }
    } catch (_) {
      // ignore to avoid breaking UI if storage is unavailable
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}


