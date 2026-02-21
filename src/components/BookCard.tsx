// ABOUTME: Card component for displaying a book in the library grid.
// ABOUTME: Fixed-height card with truncated description; clicking opens a detail modal.

import type { Book } from '../types.ts'

interface BookCardProps {
  book: Book
  onTagClick?: (tag: string) => void
  onClick?: () => void
}

export function BookCard({ book, onTagClick, onClick }: BookCardProps) {
  const metaParts: string[] = []
  if (book.year) metaParts.push(String(book.year))
  if (book.publisher) metaParts.push(book.publisher)

  return (
    <article
      class="rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)] transition-shadow hover:shadow-md h-[420px] flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {book.coverImage ? (
        <div class="w-full h-[220px] flex items-center justify-center flex-shrink-0">
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            class="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <div class="w-full h-[220px] bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
          <span class="text-2xl font-bold text-white opacity-80">
            {book.title.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
          </span>
        </div>
      )}
      <div class="px-6 py-4 h-[200px] flex flex-col overflow-hidden">
        <h3 class="text-sm font-semibold leading-snug h-[2.5rem] line-clamp-2">{book.title}</h3>
        <p class="text-xs text-[var(--color-muted)] mt-1 truncate">{book.author.join(', ')}</p>
        <p class="text-xs text-[var(--color-muted)] mt-0.5">{metaParts.length > 0 ? metaParts.join(' · ') : '\u00A0'}</p>
        <div class="flex flex-wrap gap-1 mt-2 h-[1.5rem] overflow-hidden">
          {book.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onTagClick?.(tag)
              }}
              class="inline-block text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-code-bg)] text-[var(--color-accent)] hover:opacity-80 transition-opacity cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
        {book.description && (
          <p class="mt-2 text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">{book.description}</p>
        )}
      </div>
    </article>
  )
}
