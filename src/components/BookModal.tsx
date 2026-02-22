// ABOUTME: Modal overlay for viewing full book details (theater mode).
// ABOUTME: Left-right layout: cover image on left, metadata + Kwa's Notes on right. Supports prev/next navigation.

import { useEffect } from 'preact/hooks'
import type { Book } from '../types.ts'

interface BookModalProps {
  books: Book[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
  onTagClick?: (tag: string) => void
}

function formatNoteDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function BookModal({ books, index, onClose, onChange, onTagClick }: BookModalProps) {
  const book = books[index]
  const hasPrev = index > 0
  const hasNext = index < books.length - 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onChange(index - 1)
      if (e.key === 'ArrowRight' && hasNext) onChange(index + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onChange, index, hasPrev, hasNext])

  const metaParts: string[] = []
  if (book.year) metaParts.push(String(book.year))
  if (book.publisher) metaParts.push(book.publisher)

  const initials = book.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const sortedNotes = book.notes
    ? [...book.notes].sort((a, b) => b.date.localeCompare(a.date))
    : []

  const navButton = (direction: 'prev' | 'next') => {
    const isPrev = direction === 'prev'
    const enabled = isPrev ? hasPrev : hasNext
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onChange(isPrev ? index - 1 : index + 1) }}
        disabled={!enabled}
        class={`absolute top-1/2 -translate-y-1/2 ${isPrev ? 'left-4' : 'right-4'} z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-20 disabled:cursor-default`}
        aria-label={isPrev ? 'Previous book' : 'Next book'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          {isPrev
            ? <polyline points="15 18 9 12 15 6" />
            : <polyline points="9 6 15 12 9 18" />
          }
        </svg>
      </button>
    )
  }

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

      {navButton('prev')}
      {navButton('next')}

      <div
        class="bg-[var(--color-bg)] rounded-lg max-w-4xl w-full h-[80vh] overflow-hidden flex flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {book.coverImage ? (
          <div class="w-1/2 flex-shrink-0 bg-[var(--color-code-bg)] flex items-center justify-center p-6">
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              class="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div class="w-1/2 flex-shrink-0 bg-[var(--color-accent)] flex items-center justify-center">
            <span class="text-4xl font-bold text-white opacity-80">{initials}</span>
          </div>
        )}

        <div class="w-1/2 flex flex-col h-full">
          <div class="flex-shrink-0 px-10 pt-8 pb-4">
            <h2 class="text-xl font-semibold leading-snug">{book.title}</h2>
            <p class="text-sm text-[var(--color-muted)] mt-2">{book.author.join(', ')}</p>
            {metaParts.length > 0 && (
              <p class="text-sm text-[var(--color-muted)] mt-1">{metaParts.join(' · ')}</p>
            )}

            <div class="flex flex-wrap gap-1.5 mt-4">
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
          </div>

          {sortedNotes.length > 0 && (
            <div class="flex-1 min-h-0 border-t border-[var(--color-border)] px-10 pt-6 pb-8 overflow-y-auto">
              <h3 class="text-sm font-semibold tracking-wide uppercase text-[var(--color-muted)]">Kwa's Notes</h3>
              <div class="mt-3 space-y-4">
                {sortedNotes.map((note) => (
                  <div key={note.date}>
                    <p class="text-xs text-[var(--color-muted)] opacity-70">{formatNoteDate(note.date)}</p>
                    <p class="mt-1 text-sm leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
