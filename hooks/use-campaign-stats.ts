import { useEffect, useState, useRef } from 'react'

export interface CampaignStats {
  donors: number
  amountRaised: number
  shares: number
  breakdown: {
    processed: number
    pending: number
    duplicates: number
    nonTransaction: number
    failed: number
  }
  shareBreakdown: Array<{
    platform: string
    count: number
  }>
  lastUpdated: string
  totalUploads: number
}

const DEFAULT_STATS: CampaignStats = {
  donors: 0,
  amountRaised: 0,
  shares: 0,
  breakdown: {
    processed: 0,
    pending: 0,
    duplicates: 0,
    nonTransaction: 0,
    failed: 0,
  },
  shareBreakdown: [],
  lastUpdated: new Date().toISOString(),
  totalUploads: 0,
}

/**
 * Hook to fetch and cache campaign statistics
 * Automatically revalidates every 5 minutes or on demand
 */
export function useCampaignStats(autoRefresh = true) {
  const [stats, setStats] = useState<CampaignStats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<{
    data: CampaignStats | null
    timestamp: number
  }>({ data: null, timestamp: 0 })

  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  const fetchStats = async (forceRefresh = false) => {
    try {
      const now = Date.now()
      const cached = cacheRef.current.data

      // Use cache if available and not expired, unless forced refresh
      if (
        cached &&
        !forceRefresh &&
        now - cacheRef.current.timestamp < CACHE_DURATION
      ) {
        console.log('[v0] Using cached stats')
        setStats(cached)
        setLoading(false)
        return
      }

      setLoading(true)
      const response = await fetch('/api/campaign-stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }

      const data: CampaignStats = await response.json()

      // Update cache
      cacheRef.current.data = data
      cacheRef.current.timestamp = now

      setStats(data)
      setError(null)
      console.log('[v0] Campaign stats fetched:', {
        donors: data.donors,
        amount: data.amountRaised,
        shares: data.shares,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[v0] Error fetching stats:', message)
      setError(message)
      // Fall back to cached data if available
      if (cacheRef.current.data) {
        setStats(cacheRef.current.data)
      }
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    // Initial fetch
    fetchStats()

    // Set up interval for periodic refresh
    const interval = setInterval(() => {
      console.log('[v0] Auto-refreshing campaign stats')
      fetchStats()
    }, CACHE_DURATION)

    return () => clearInterval(interval)
  }, [autoRefresh])

  return {
    stats,
    loading,
    error,
    refresh: () => fetchStats(true),
  }
}
