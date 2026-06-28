// ABOUTME: Art book library page with a filterable text-first list.
// ABOUTME: Supports tag filtering (AND semantics) and multiple sort options.

import { useState, useMemo } from 'preact/hooks'
import { Layout } from '../components/Layout.tsx'
import { BookListItem } from '../components/BookListItem.tsx'
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
        (book.notes ?? []).some((n) => n.text.toLowerCase().includes(q)),
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
          onClearFilters={handleClearFilters}
          sortField={sortField}
          onSortChange={setSortField}
          visibleCount={filteredBooks.length}
          totalCount={books.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div class="mt-8">
          {filteredBooks.length === 0 ? (
            <p class="border-y border-[var(--color-border)] py-8 text-sm text-[var(--color-muted)]">
              No books match the selected filters.
            </p>
          ) : (
            <ul class="border-t border-[var(--color-border)]">
              {filteredBooks.map((book) => (
                <BookListItem key={book.slug} book={book} onTagClick={handleTagToggle} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  )
}
