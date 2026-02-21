// ABOUTME: Modal overlay for viewing full book details (theater mode).
// ABOUTME: Shows cover, title, author, metadata, tags, and full untruncated description.

import { useEffect } from 'preact/hooks'
import type { Book } from '../types.ts'

interface BookModalProps {
  book: Book
  onClose: () => void
  onTagClick?: (tag: string) => void
}

export function BookModal({ book, onClose, onTagClick }: BookModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const metaParts: string[] = []
  if (book.year) metaParts.push(String(book.year))
  if (book.publisher) metaParts.push(book.publisher)

  const initials = book.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
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

      <div
        class="bg-[var(--color-bg)] rounded-lg max-w-lg w-full h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {book.coverImage ? (
          <div class="w-full flex-1 min-h-0 bg-[var(--color-code-bg)] flex items-center justify-center flex-shrink">
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              class="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div class="w-full flex-1 min-h-0 bg-[var(--color-accent)] flex items-center justify-center flex-shrink">
            <span class="text-4xl font-bold text-white opacity-80">{initials}</span>
          </div>
        )}

        <div class="p-5 flex-shrink overflow-y-auto">
          <h2 class="text-lg font-semibold leading-snug">{book.title}</h2>
          <p class="text-sm text-[var(--color-muted)] mt-1">{book.author.join(', ')}</p>
          {metaParts.length > 0 && (
            <p class="text-sm text-[var(--color-muted)] mt-0.5">{metaParts.join(' · ')}</p>
          )}

          <div class="flex flex-wrap gap-1.5 mt-3">
            {book.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                class="inline-block text-xs px-2 py-0.5 rounded-full bg-[var(--color-code-bg)] text-[var(--color-accent)] hover:opacity-80 transition-opacity cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {book.description && (
            <p class="mt-4 text-sm text-[var(--color-muted)] leading-relaxed">{book.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
