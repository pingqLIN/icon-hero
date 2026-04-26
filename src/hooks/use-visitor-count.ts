import { useEffect, useRef, useState } from 'react'

const COUNTER_URL = 'https://api.counterapi.dev/v1/icon-hero/visits/up'
const CACHE_KEY = 'icon-hero-visitor-count'
const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1'])

interface UseVisitorCountResult {
  count: number | null
  loading: boolean
  error: boolean
}

export function useVisitorCount(): UseVisitorCountResult {
  const [count, setCount] = useState<number | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? Number(cached) : null
    } catch {
      return null
    }
  })
  const hasCachedCountRef = useRef(count !== null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const shouldFetchCount = !(import.meta.env.DEV && LOCAL_DEV_HOSTS.has(window.location.hostname))

    async function fetchCount() {
      if (!shouldFetchCount) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(COUNTER_URL)
        if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`)
        const data = await response.json() as { count?: number }
        if (!cancelled) {
          const nextCount = data.count ?? null
          setCount(nextCount)
          setError(false)
          if (nextCount !== null) {
            hasCachedCountRef.current = true
            try {
              localStorage.setItem(CACHE_KEY, String(nextCount))
            } catch {
              // ignore storage write failures
            }
          }
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(!hasCachedCountRef.current)
          setLoading(false)
        }
      }
    }

    fetchCount()
    return () => { cancelled = true }
  }, [])

  return { count, loading, error }
}
