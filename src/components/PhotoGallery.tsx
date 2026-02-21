// ABOUTME: Photo gallery with two layout modes: square grid and single (horizontal scroll).
// ABOUTME: Both modes support a shared theater view (lightbox) for full-screen viewing.

import { useEffect, useRef, useState, useCallback } from 'preact/hooks'

interface PhotoGalleryProps {
  images: string[]
  layout: 'grid' | 'single'
}

export function PhotoGallery({ images, layout }: PhotoGalleryProps) {
  const [theaterIndex, setTheaterIndex] = useState<number | null>(null)

  return (
    <>
      {layout === 'single'
        ? <SingleLayout images={images} onOpen={setTheaterIndex} />
        : <GridLayout images={images} onOpen={setTheaterIndex} />
      }
      <TheaterView images={images} index={theaterIndex} onClose={() => setTheaterIndex(null)} onChange={setTheaterIndex} />
    </>
  )
}

// --- Theater view (shared lightbox) ---

function TheaterView({ images, index, onClose, onChange }: {
  images: string[]
  index: number | null
  onClose: () => void
  onChange: (i: number) => void
}) {
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isOpen = index !== null

  const goNext = useCallback(() => {
    onChange(Math.min(index! + 1, images.length - 1))
  }, [index, images.length, onChange])

  const goPrev = useCallback(() => {
    onChange(Math.max(index! - 1, 0))
  }, [index, onChange])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, goNext, goPrev])

  if (!isOpen) return null

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current
    if (delta > 50) goNext()
    else if (delta < -50) goPrev()
  }

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-white/70 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <img
        src={images[index]}
        alt=""
        class="max-w-[90vw] max-h-[85vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {index < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-white/70 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm select-none">
        {index + 1} / {images.length}
      </div>
    </div>
  )
}

// --- Grid layout ---

function GridLayout({ images, onOpen }: { images: string[]; onOpen: (i: number) => void }) {
  return (
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((src, i) => (
        <button
          key={i}
          onClick={() => onOpen(i)}
          class="aspect-square overflow-hidden cursor-pointer block w-full p-0 border-0 bg-transparent"
        >
          <img
            src={src}
            alt=""
            loading={i < 6 ? 'eager' : 'lazy'}
            class="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}

// --- Single layout: horizontal scroll ---

function SingleLayout({ images, onOpen }: { images: string[]; onOpen: (i: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      const el = scrollRef.current
      if (!el) return
      const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[]
      const loaded = imgs.filter((img) => img.naturalWidth > 0)
      if (loaded.length === 0) return

      const containerWidth = el.clientWidth
      const maxH = window.innerHeight * 0.7
      let minH = maxH

      for (const img of loaded) {
        const h = containerWidth * (img.naturalHeight / img.naturalWidth)
        if (h < minH) minH = h
      }
      setHeight(minH)
    }

    const el = scrollRef.current
    if (!el) return
    const imgs = el.querySelectorAll('img')
    let count = 0
    const onLoad = () => { count++; if (count === imgs.length) update() }
    imgs.forEach((img) => {
      if (img.complete) onLoad()
      else img.addEventListener('load', onLoad, { once: true })
    })

    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [images])

  return (
    <div class="relative">
      {/* Fade edges */}
      <div class="pointer-events-none absolute inset-y-0 left-0 w-8 z-10" style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }} />
      <div class="pointer-events-none absolute inset-y-0 right-0 w-8 z-10" style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }} />

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        class="flex overflow-x-auto gap-3 py-2 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading={i < 4 ? 'eager' : 'lazy'}
            class="flex-shrink-0 w-auto max-w-none cursor-pointer"
            style={{ height: height ? `${height}px` : '70vh' }}
            onClick={() => onOpen(i)}
          />
        ))}
      </div>
    </div>
  )
}
