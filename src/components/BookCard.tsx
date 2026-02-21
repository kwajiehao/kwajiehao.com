// ABOUTME: Card component for displaying a book in the library grid.
// ABOUTME: Shows cover image (or placeholder), title, author, metadata, tags, and description.

import type { Book } from '../types.ts'

interface BookCardProps {
  book: Book
  onTagClick?: (tag: string) => void
}

function CoverPlaceholder({ title }: { title: string }) {
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div class="w-full aspect-square bg-[var(--color-accent)] flex items-center justify-center">
      <span class="text-2xl font-bold text-white opacity-80">{initials}</span>
    </div>
  )
}

export function BookCard({ book, onTagClick }: BookCardProps) {
  const metaParts: string[] = []
  if (book.year) metaParts.push(String(book.year))
  if (book.publisher) metaParts.push(book.publisher)

  return (
    <article class="rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)] transition-shadow hover:shadow-md">
      {book.coverImage ? (
        <div class="w-full aspect-square bg-[var(--color-code-bg)] flex items-center justify-center">
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            class="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <CoverPlaceholder title={book.title} />
      )}
      <div class="p-3">
        <h3 class="text-sm font-semibold leading-snug">{book.title}</h3>
        <p class="text-xs text-[var(--color-muted)] mt-1">{book.author}</p>
        {metaParts.length > 0 && (
          <p class="text-xs text-[var(--color-muted)] mt-0.5">{metaParts.join(' · ')}</p>
        )}
        <div class="flex flex-wrap gap-1 mt-2">
          {book.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onTagClick?.(tag)
              }}
              class="inline-block text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-code-bg)] text-[var(--color-accent)] hover:opacity-80 transition-opacity cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
        {book.description && (
          <p class="mt-2 text-xs text-[var(--color-muted)] leading-relaxed">{book.description}</p>
        )}
      </div>
    </article>
  )
}
