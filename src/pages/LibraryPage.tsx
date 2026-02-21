// ABOUTME: Art book library page with filterable card grid.
// ABOUTME: Supports tag filtering (AND semantics) and multiple sort options.

import { useState, useMemo } from 'preact/hooks'
import { Layout } from '../components/Layout.tsx'
import { BookCard } from '../components/BookCard.tsx'
import { BookFilterBar } from '../components/BookFilterBar.tsx'
import type { Book } from '../types.ts'
import books from 'virtual:art-books'
import bookTags from 'virtual:art-book-tags'

function sortBooks(items: Book[], field: string): Book[] {
  const sorted = [...items]
  switch (field) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'author':
      return sorted.sort((a, b) => a.author.localeCompare(b.author))
    case 'year':
      return sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    case 'dateAdded':
    default:
      return sorted.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
  }
}

export function LibraryPage() {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState('dateAdded')

  const allTags = useMemo(() => Object.keys(bookTags).sort(), [])

  const filteredBooks = useMemo(() => {
    if (activeTags.size === 0) return sortBooks(books, sortField)
    const filtered = books.filter((book) =>
      [...activeTags].every((tag) => book.tags.includes(tag)),
    )
    return sortBooks(filtered, sortField)
  }, [activeTags, sortField])

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }

  const handleClearTags = () => setActiveTags(new Set())

  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-8">Library</h1>
        <BookFilterBar
          allTags={allTags}
          activeTags={activeTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
          sortField={sortField}
          onSortChange={setSortField}
          visibleCount={filteredBooks.length}
          totalCount={books.length}
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {filteredBooks.length === 0 ? (
            <p class="text-[var(--color-muted)] col-span-full">No books match the selected filters.</p>
          ) : (
            filteredBooks.map((book) => (
              <BookCard key={book.slug} book={book} onTagClick={handleTagToggle} />
            ))
          )}
        </div>
      </section>
    </Layout>
  )
}
