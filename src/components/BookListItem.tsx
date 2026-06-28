// ABOUTME: Expandable text row for a book in the library list.
// ABOUTME: Shows compact metadata first, then inline notes, tags, and details.

import type { Book } from '../types.ts'

interface BookListItemProps {
  book: Book
  isExpanded: boolean
  onToggle: () => void
  onTagClick?: (tag: string) => void
}

function compactMetadata(book: Book): string {
  const parts: string[] = []
  if (book.publisher) parts.push(book.publisher)
  if (book.year) parts.push(String(book.year))
  return parts.length > 0 ? parts.join(' / ') : 'No publisher or year listed'
}

const entryGridColumns = 'grid-cols-[minmax(0,1fr)_1.25rem] sm:grid-cols-[minmax(0,1.35fr)_minmax(10rem,0.75fr)_minmax(9rem,0.65fr)_1.25rem]'

export function BookListItem({ book, isExpanded, onToggle, onTagClick }: BookListItemProps) {
  const sortedNotes = book.notes
    ? [...book.notes].sort((a, b) => b.date.localeCompare(a.date))
    : []
  const detailsId = `book-details-${book.slug}`

  return (
    <li class="list-none">
      <article class="border-b border-[var(--color-border)]">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          onClick={onToggle}
          class={`grid w-full cursor-pointer ${entryGridColumns} gap-x-3 gap-y-1 py-4 text-left outline-none transition-colors hover:bg-[var(--color-code-bg)] focus-visible:bg-[var(--color-code-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] sm:gap-4 sm:px-2`}
        >
          <span
            data-topline-primary
            class="col-start-1 flex min-w-0 flex-wrap items-baseline justify-start gap-x-3 gap-y-1 sm:col-span-2"
          >
            <span class="min-w-0 text-base font-medium leading-snug text-[var(--color-text)]">
              {book.title}
            </span>
            <span class="min-w-0 text-sm leading-snug text-[var(--color-muted)]">
              {book.author.join(', ')}
            </span>
          </span>
          <span
            data-topline-metadata
            class="col-start-1 min-w-0 text-sm leading-snug text-[var(--color-muted)] sm:col-start-3 sm:pt-0.5 sm:text-right"
          >
            {compactMetadata(book)}
          </span>
          <span class={`col-start-2 row-span-2 row-start-1 flex h-5 w-5 items-center justify-center self-start text-[var(--color-muted)] transition-transform sm:col-start-auto sm:row-span-1 sm:row-start-auto sm:self-center ${isExpanded ? 'rotate-90' : ''}`}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 3.5 8.5 7 5 10.5" />
            </svg>
          </span>
        </button>

        {isExpanded && (
          <div id={detailsId} class={`grid ${entryGridColumns} gap-x-3 gap-y-4 pb-5 sm:gap-x-4 sm:px-2 sm:pr-10`}>
            {book.coverImage && (
              <figure class="col-span-2 col-start-1 lg:hidden sm:col-span-3">
                <img
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  loading="lazy"
                  class="max-h-72 w-full max-w-48 object-contain object-left-top"
                />
              </figure>
            )}

            <div class="col-start-1 min-w-0 space-y-4 sm:col-span-3">
              {sortedNotes.length > 0 ? (
                sortedNotes.map((note) => (
                  <section key={note.date}>
                    <p class="text-sm leading-relaxed text-[var(--color-text)]">{note.text}</p>
                  </section>
                ))
              ) : (
                <p class="text-sm text-[var(--color-muted)]">No note recorded.</p>
              )}
            </div>

            <div class="col-span-2 col-start-1 flex flex-wrap justify-start gap-2 sm:col-span-3" aria-label={`Tags for ${book.title}`}>
              {book.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick?.(tag)}
                  class="inline-flex min-h-7 items-center rounded-full bg-[var(--color-code-bg)] px-2.5 text-xs text-[var(--color-accent)] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </li>
  )
}
