// ABOUTME: Tests queued page-scoped cover prefetch behavior for the library.
// ABOUTME: Stubs browser image APIs to make request order and cleanup deterministic.

import { cleanup, render, waitFor } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePagedCoverPrefetch } from './usePagedCoverPrefetch.ts'

const requestedUrls: string[] = []
const requestedImages: MockImage[] = []

class MockImage {
  onload: ((event: Event) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  decoding = ''

  set src(value: string) {
    requestedUrls.push(value)
    requestedImages.push(this)
  }

  finishLoad() {
    this.onload?.(new Event('load'))
  }

  finishError() {
    this.onerror?.(new Event('error'))
  }
}

interface PrefetchPageProps {
  urls: string[]
  concurrency?: number
  maxUrlsPerPage?: number
}

function PrefetchPage({
  urls,
  concurrency = 2,
  maxUrlsPerPage = 3,
}: PrefetchPageProps) {
  usePagedCoverPrefetch(urls, { concurrency, maxUrlsPerPage })

  return <div>Current page</div>
}

function stubBrowserPrefetchApis(connection?: { saveData?: boolean; effectiveType?: string }) {
  vi.stubGlobal('Image', MockImage)
  Object.defineProperty(window.navigator, 'connection', {
    configurable: true,
    value: connection,
  })
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  requestedUrls.length = 0
  requestedImages.length = 0
  Reflect.deleteProperty(window.navigator, 'connection')
})

describe('usePagedCoverPrefetch', () => {
  it('prefetches the current page through a bounded queue', async () => {
    stubBrowserPrefetchApis()

    render(
      <PrefetchPage
        urls={[
          'https://example.com/cover-0.jpg',
          'https://example.com/cover-1.jpg',
          'https://example.com/cover-2.jpg',
          'https://example.com/cover-3.jpg',
        ]}
      />,
    )

    await waitFor(() => expect(requestedUrls).toEqual([
      'https://example.com/cover-0.jpg',
      'https://example.com/cover-1.jpg',
    ]))

    requestedImages[0].finishLoad()

    await waitFor(() => expect(requestedUrls).toEqual([
      'https://example.com/cover-0.jpg',
      'https://example.com/cover-1.jpg',
      'https://example.com/cover-2.jpg',
    ]))

    requestedImages[1].finishLoad()
    requestedImages[2].finishLoad()
    await Promise.resolve()

    expect(requestedUrls).toEqual([
      'https://example.com/cover-0.jpg',
      'https://example.com/cover-1.jpg',
      'https://example.com/cover-2.jpg',
    ])
    expect(requestedImages[0].onload).toBeNull()
    expect(requestedImages[0].onerror).toBeNull()
  })

  it('deduplicates URLs across page changes', async () => {
    stubBrowserPrefetchApis()

    const { rerender } = render(
      <PrefetchPage
        urls={[
          'https://example.com/cover-0.jpg',
          'https://example.com/cover-1.jpg',
        ]}
      />,
    )

    await waitFor(() => expect(requestedUrls).toEqual([
      'https://example.com/cover-0.jpg',
      'https://example.com/cover-1.jpg',
    ]))

    requestedImages[0].finishLoad()
    requestedImages[1].finishLoad()

    rerender(
      <PrefetchPage
        urls={[
          'https://example.com/cover-1.jpg',
          'https://example.com/cover-2.jpg',
        ]}
      />,
    )

    await waitFor(() => expect(requestedUrls).toEqual([
      'https://example.com/cover-0.jpg',
      'https://example.com/cover-1.jpg',
      'https://example.com/cover-2.jpg',
    ]))
  })

  it('skips image requests for reduced-data connections', async () => {
    stubBrowserPrefetchApis({ saveData: true })

    render(<PrefetchPage urls={['https://example.com/cover.jpg']} />)

    await Promise.resolve()

    expect(requestedUrls).toEqual([])
  })

  it('skips image requests on 2g connections', async () => {
    stubBrowserPrefetchApis({ effectiveType: '2g' })

    render(<PrefetchPage urls={['https://example.com/cover.jpg']} />)

    await Promise.resolve()

    expect(requestedUrls).toEqual([])
  })
})
