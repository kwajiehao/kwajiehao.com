// ABOUTME: Art book library page with a filterable text-first list.
// ABOUTME: Supports tag filtering (AND semantics) and multiple sort options.

import { useEffect, useMemo, useState } from 'preact/hooks'
import { Layout } from '../components/Layout.tsx'
import { BookListItem } from '../components/BookListItem.tsx'
import { BookFilterBar } from '../components/BookFilterBar.tsx'
import { usePagedCoverPrefetch } from '../hooks/usePagedCoverPrefetch.ts'
import type { Book } from '../types.ts'
import books from 'virtual:art-books'
import bookTags from 'virtual:art-book-tags'

const BOOKS_PER_PAGE = 20

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
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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
  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE))
  const currentPageBooks = useMemo(() => {
    const pageStart = (currentPage - 1) * BOOKS_PER_PAGE
    return filteredBooks.slice(pageStart, pageStart + BOOKS_PER_PAGE)
  }, [currentPage, filteredBooks])
  const currentPageCoverUrls = useMemo(
    () => currentPageBooks.map((book) => book.coverImage),
    [currentPageBooks],
  )
  const firstVisibleBook = filteredBooks.length === 0
    ? 0
    : (currentPage - 1) * BOOKS_PER_PAGE + 1
  const lastVisibleBook = Math.min(currentPage * BOOKS_PER_PAGE, filteredBooks.length)
  const expandedBook = currentPageBooks.find((book) => book.slug === expandedSlug)

  usePagedCoverPrefetch(currentPageCoverUrls)

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount))
  }, [pageCount])

  const resetPagePosition = () => {
    setCurrentPage(1)
  }

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
    resetPagePosition()
  }

  const handleClearFilters = () => {
    setActiveTags(new Set())
    setSearchQuery('')
    resetPagePosition()
  }

  const handleSortChange = (field: string) => {
    setSortField(field)
    resetPagePosition()
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    resetPagePosition()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), pageCount))
  }

  return (
    <Layout maxWidth="wide">
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-8">Library</h1>
        <div class="grid gap-8 lg:grid-cols-[minmax(0,42rem)_minmax(14rem,1fr)] lg:gap-10">
          <div class="min-w-0">
            <BookFilterBar
              allTags={allTags}
              activeTags={activeTags}
              onTagToggle={handleTagToggle}
              onClearFilters={handleClearFilters}
              sortField={sortField}
              onSortChange={handleSortChange}
              visibleCount={filteredBooks.length}
              totalCount={books.length}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
            <div class="mt-8">
              {filteredBooks.length === 0 ? (
                <p class="border-y border-[var(--color-border)] py-8 text-sm text-[var(--color-muted)]">
                  No books match the selected filters.
                </p>
              ) : (
                <>
                  <ul class="border-t border-[var(--color-border)]">
                    {currentPageBooks.map((book) => (
                      <BookListItem
                        key={book.slug}
                        book={book}
                        isExpanded={expandedSlug === book.slug}
                        onToggle={() =>
                          setExpandedSlug((current) => current === book.slug ? null : book.slug)
                        }
                        onTagClick={handleTagToggle}
                      />
                    ))}
                  </ul>
                  {pageCount > 1 && (
                    <nav
                      aria-label="Library pages"
                      class="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted)]"
                    >
                      <span>
                        Showing {firstVisibleBook}-{lastVisibleBook} of {filteredBooks.length}
                      </span>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Previous library page"
                          title="Previous page"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          class="inline-flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-code-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-35"
                        >
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 3.5 5.5 7 9 10.5" />
                          </svg>
                        </button>
                        <span aria-live="polite" class="min-w-20 text-center">
                          Page {currentPage} of {pageCount}
                        </span>
                        <button
                          type="button"
                          aria-label="Next library page"
                          title="Next page"
                          disabled={currentPage === pageCount}
                          onClick={() => handlePageChange(currentPage + 1)}
                          class="inline-flex h-8 w-8 items-center justify-center border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-code-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-35"
                        >
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 3.5 8.5 7 5 10.5" />
                          </svg>
                        </button>
                      </div>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
          <aside class="hidden min-w-0 lg:block" aria-live="polite" aria-atomic="true">
            <div class="sticky top-8 min-h-[28rem]">
              {expandedBook?.coverImage && (
                <img
                  src={expandedBook.coverImage}
                  alt={`${expandedBook.title} cover`}
                  loading="lazy"
                  class="max-h-[34rem] w-full object-contain object-top"
                />
              )}
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
