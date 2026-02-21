// ABOUTME: Art book library page with filterable card grid.
// ABOUTME: Supports tag filtering (AND semantics) and multiple sort options.

import { useState, useMemo } from 'preact/hooks'
import { Layout } from '../components/Layout.tsx'
import { BookCard } from '../components/BookCard.tsx'
import { BookFilterBar } from '../components/BookFilterBar.tsx'
import { BookModal } from '../components/BookModal.tsx'
import type { Book } from '../types.ts'
import books from 'virtual:art-books'
import bookTags from 'virtual:art-book-tags'

function sortBooks(items: Book[], field: string): Book[] {
  const sorted = [...items]
  switch (field) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'author':
      return sorted.sort((a, b) => a.author[0].localeCompare(b.author[0]))
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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const allTags = useMemo(() => Object.keys(bookTags).sort(), [])

  const filteredBooks = useMemo(() => {
    let result = books

    if (activeTags.size > 0) {
      result = result.filter((book) =>
        [...activeTags].every((tag) => book.tags.includes(tag)),
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.some((a) => a.toLowerCase().includes(q)) ||
        (book.publisher ?? '').toLowerCase().includes(q) ||
        (book.description ?? '').toLowerCase().includes(q),
      )
    }

    return sortBooks(result, sortField)
  }, [activeTags, sortField, searchQuery])

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

  const handleClearFilters = () => {
    setActiveTags(new Set())
    setSearchQuery('')
  }

  return (
    <Layout maxWidth="wide">
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-8">Library</h1>
        <BookFilterBar
          allTags={allTags}
          activeTags={activeTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearFilters}
          sortField={sortField}
          onSortChange={setSortField}
          visibleCount={filteredBooks.length}
          totalCount={books.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {filteredBooks.length === 0 ? (
            <p class="text-[var(--color-muted)] col-span-full">No books match the selected filters.</p>
          ) : (
            filteredBooks.map((book) => (
              <BookCard key={book.slug} book={book} onTagClick={handleTagToggle} onClick={() => setSelectedBook(book)} />
            ))
          )}
        </div>
        {selectedBook && (
          <BookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onTagClick={(tag) => {
              setSelectedBook(null)
              handleTagToggle(tag)
            }}
          />
        )}
      </section>
    </Layout>
  )
}
