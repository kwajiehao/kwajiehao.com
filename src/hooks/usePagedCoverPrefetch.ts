// ABOUTME: Page-scoped queued cover prefetching for the library.
// ABOUTME: Requests current-page cover URLs without retaining decoded image objects.

import { useEffect, useRef } from 'preact/hooks'

export interface PagedCoverPrefetchOptions {
  concurrency?: number
  maxUrlsPerPage?: number
}

const DEFAULT_CONCURRENCY = 4
const DEFAULT_MAX_URLS_PER_PAGE = 20
const SKIPPED_EFFECTIVE_TYPES = new Set(['slow-2g', '2g'])

interface NavigatorConnection {
  saveData?: boolean
  effectiveType?: string
}

interface NavigatorWithConnection extends Navigator {
  connection?: NavigatorConnection
}

function connectionAllowsPrefetch(): boolean {
  if (typeof navigator === 'undefined') return true

  const connection = (navigator as NavigatorWithConnection).connection
  if (!connection) return true
  if (connection.saveData) return false

  return !SKIPPED_EFFECTIVE_TYPES.has(connection.effectiveType ?? '')
}

function browserCanPrefetch(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof Image !== 'undefined' &&
    connectionAllowsPrefetch()
  )
}

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback
  return Math.max(1, Math.floor(value))
}

function prefetchCoverImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image()
    const releaseImage = () => {
      image.onload = null
      image.onerror = null
      resolve()
    }

    image.decoding = 'async'
    image.onload = releaseImage
    image.onerror = releaseImage
    image.src = url
  })
}

export function usePagedCoverPrefetch(
  coverUrls: readonly (string | null | undefined)[],
  options: PagedCoverPrefetchOptions = {},
) {
  const requestedUrlsRef = useRef<Set<string>>(new Set())
  const concurrency = normalizePositiveInteger(options.concurrency, DEFAULT_CONCURRENCY)
  const maxUrlsPerPage = normalizePositiveInteger(
    options.maxUrlsPerPage,
    DEFAULT_MAX_URLS_PER_PAGE,
  )

  useEffect(() => {
    if (!browserCanPrefetch()) return

    const queue = [...new Set(coverUrls.filter((url): url is string => Boolean(url)))]
      .filter((url) => !requestedUrlsRef.current.has(url))
      .slice(0, maxUrlsPerPage)

    if (queue.length === 0) return

    let activeCount = 0
    let nextIndex = 0
    let cancelled = false

    const runNext = () => {
      if (cancelled) return

      while (activeCount < concurrency && nextIndex < queue.length) {
        const url = queue[nextIndex]
        nextIndex += 1

        requestedUrlsRef.current.add(url)
        activeCount += 1

        void prefetchCoverImage(url).finally(() => {
          activeCount -= 1
          runNext()
        })
      }
    }

    runNext()

    return () => {
      cancelled = true
    }
  }, [concurrency, coverUrls, maxUrlsPerPage])
}
