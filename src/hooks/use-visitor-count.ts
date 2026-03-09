import { useState, useEffect } from 'react'

const COUNTER_URL = 'https://api.counterapi.dev/v1/icon-hero/visits/up'

interface UseVisitorCountResult {
  count: number | null
  loading: boolean
  error: boolean
}

export function useVisitorCount(): UseVisitorCountResult {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchCount() {
      try {
        const response = await fetch(COUNTER_URL)
        if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`)
        const data = await response.json() as { count?: number }
        if (!cancelled) {
          setCount(data.count ?? null)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchCount()
    return () => { cancelled = true }
  }, [])

  return { count, loading, error }
}
