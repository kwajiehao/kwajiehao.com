// ABOUTME: Horizontal-scroll photo gallery with grid and single layout modes.
// ABOUTME: Uses CSS scroll-snap for smooth page transitions with keyboard and touch support.

import { useEffect, useRef, useState, useCallback } from 'preact/hooks'

interface PhotoGalleryProps {
  images: string[]
  layout: 'grid' | 'single'
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export function PhotoGallery({ images, layout }: PhotoGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Determine page groupings based on layout and screen size
  const getPages = useCallback(() => {
    if (layout === 'single') {
      return images.map((img) => [img])
    }
    // Grid mode: 4 per page on desktop, 2 per page on mobile
    const perPage = isMobile ? 2 : 4
    return chunkArray(images, perPage)
  }, [images, layout, isMobile])

  const pages = getPages()
  const totalPages = pages.length

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track current page from scroll position
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const pageWidth = el.clientWidth
      if (pageWidth === 0) return
      const page = Math.round(el.scrollLeft / pageWidth)
      setCurrentPage(page)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = scrollRef.current
      if (!el) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const scrollToPage = (page: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' })
  }

  const goNext = () => {
    if (currentPage < totalPages - 1) scrollToPage(currentPage + 1)
  }

  const goPrev = () => {
    if (currentPage > 0) scrollToPage(currentPage - 1)
  }

  return (
    <div class="relative">
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        class="flex overflow-x-scroll snap-x snap-mandatory min-h-[60vh] sm:min-h-[70vh]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`.photo-gallery-scroll::-webkit-scrollbar { display: none; }`}</style>
        {pages.map((pageImages, pageIndex) => (
          <div
            key={pageIndex}
            class="flex-shrink-0 w-full snap-start"
          >
            {layout === 'single' ? (
              <div class="w-full h-full flex items-center justify-center p-4">
                <img
                  src={pageImages[0]}
                  alt=""
                  loading={pageIndex < 2 ? 'eager' : 'lazy'}
                  class="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            ) : (
              <div class={`w-full h-full grid gap-2 p-4 ${isMobile ? 'grid-cols-1 grid-rows-2' : 'grid-cols-2 grid-rows-2'}`}>
                {pageImages.map((img, imgIndex) => (
                  <div key={imgIndex} class="overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      loading={pageIndex < 2 ? 'eager' : 'lazy'}
                      class="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrow buttons — hidden on mobile */}
      {totalPages > 1 && (
        <>
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-default"
            aria-label="Previous page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={currentPage === totalPages - 1}
            class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-default"
            aria-label="Next page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Page dots */}
      {totalPages > 1 && (
        <div class="flex justify-center gap-2 py-4">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              class={`min-w-[11px] min-h-[11px] sm:min-w-[8px] sm:min-h-[8px] rounded-full transition-colors ${i === currentPage ? 'bg-[var(--color-text)]' : 'bg-[var(--color-muted)]/40'}`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
