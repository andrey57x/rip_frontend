// src/hooks/useFetchReactions.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Reaction } from '../types/models'
import * as api from '../api/api'

type Filters = {
  title?: string
  date_from?: string
  date_to?: string
  price_min?: number
  price_max?: number
  limit?: number
  offset?: number
}

/**
 * useFetchReactions - надёжный хук для списка реакций.
 * - при mount (если immediate = true) делает один запрос;
 * - для последующих запросов используйте setFiltersAndFetch(f)
 * - отменяет предыдущий запрос через AbortController при новом fetch
 */
export default function useFetchReactions(initialFilters?: Filters, immediate = true) {
  const [filters, setFilters] = useState<Filters | undefined>(initialFilters)
  const [data, setData] = useState<Reaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async (f?: Filters) => {
    const applied = f ?? filters
    // отменяем предыдущий запрос
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setLoading(true)
    setError(null)

    try {
      const res = await api.getReactions(applied, ac.signal)
      setData(res)
      setLoading(false)
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // игнорируем
        return
      }
      setError(err?.message ?? 'fetch error')
      setLoading(false)
    }
  // NOTE: не включаем `filters` в зависимости, чтобы не вызывать эффект по каждой ре-инициализации
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // При монтировании один запрос (если требуется)
  useEffect(() => {
    if (!immediate) return
    fetchData()
    return () => abortRef.current?.abort()
  // fetchData не меняется (useCallback без deps), immediate редко меняется, поэтому []/immediate ok
  }, [immediate, fetchData])

  const refetch = () => fetchData(filters)

  const setFiltersAndFetch = (f: Filters) => {
    setFilters(f)
    // делаем fetch по переданным фильтрам (не ждём setState)
    fetchData(f)
  }

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    setFiltersAndFetch,
    refetch,
  }
}
