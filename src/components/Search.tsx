// ABOUTME: Client-side search overlay that filters posts, books, and photos by title, tags, and description.
// ABOUTME: Triggered by search icon in header or "/" keyboard shortcut.

import { useState, useEffect, useRef } from 'preact/hooks'
import posts from 'virtual:blog-posts'
import books from 'virtual:art-books'
import collections from 'virtual:photo-collections'

interface PostResult {
  type: 'post'
  slug: string
  title: string
  subtitle: string
}

interface BookResult {
  type: 'book'
  slug: string
  title: string
  subtitle: string
}

interface PhotoResult {
  type: 'photo'
  slug: string
  title: string
  subtitle: string
}

type SearchResult = PostResult | BookResult | PhotoResult

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const searchablePosts = posts.filter((p) => !p.hidden)
  const searchableCollections = collections.filter((c) => !c.hidden)

  const results: SearchResult[] = query.trim()
    ? [
        ...searchablePosts
          .filter((post) => {
            const q = query.toLowerCase()
            return (
              post.title.toLowerCase().includes(q) ||
              post.description.toLowerCase().includes(q) ||
              post.tags.some((tag) => tag.toLowerCase().includes(q))
            )
          })
          .map((post): PostResult => ({
            type: 'post',
            slug: post.slug,
            title: post.title,
            subtitle: post.description,
          })),
        ...books
          .filter((book) => {
            const q = query.toLowerCase()
            return (
              book.title.toLowerCase().includes(q) ||
              book.author.join(' ').toLowerCase().includes(q) ||
              (book.description ?? '').toLowerCase().includes(q) ||
              book.tags.some((tag) => tag.toLowerCase().includes(q))
            )
          })
          .map((book): BookResult => ({
            type: 'book',
            slug: book.slug,
            title: book.title,
            subtitle: book.author.join(', '),
          })),
        ...searchableCollections
          .filter((col) => {
            const q = query.toLowerCase()
            return (
              col.title.toLowerCase().includes(q) ||
              (col.description ?? '').toLowerCase().includes(q)
            )
          })
          .map((col): PhotoResult => ({
            type: 'photo',
            slug: col.slug,
            title: col.title,
            subtitle: 'Photo collection',
          })),
      ]
    : []

  const postResults = results.filter((r) => r.type === 'post')
  const bookResults = results.filter((r) => r.type === 'book')
  const photoResults = results.filter((r) => r.type === 'photo')

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  function hrefFor(result: SearchResult): string {
    switch (result.type) {
      case 'post':
        return `/blog/${result.slug}`
      case 'book':
        return `/library?book=${result.slug}`
      case 'photo':
        return `/photos/${result.slug}`
    }
  }

  function renderSection(label: string, items: SearchResult[]) {
    if (items.length === 0) return null
    return (
      <>
        <div class="px-4 py-2 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider bg-[var(--color-code-bg)]">
          {label}
        </div>
        {items.map((result) => (
          <a
            key={`${result.type}-${result.slug}`}
            href={hrefFor(result)}
            class="block px-4 py-3 hover:bg-[var(--color-code-bg)] transition-colors border-b border-[var(--color-border)] last:border-b-0"
            onClick={() => { setIsOpen(false); setQuery('') }}
          >
            <div class="font-medium text-sm">{result.title}</div>
            <div class="text-xs text-[var(--color-muted)] mt-1">{result.subtitle}</div>
          </a>
        ))}
      </>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Search posts"
        class="p-1 hover:text-[var(--color-accent)] transition-colors cursor-pointer text-[var(--color-text)] bg-transparent border-none"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    )
  }

  return (
    <>
      <div
        class="fixed inset-0 bg-black/50 z-40"
        onClick={() => { setIsOpen(false); setQuery('') }}
      />
      <div class="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[500px] z-50 px-4">
        <div class="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts, books, photos... (Esc to close)"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 bg-transparent text-[var(--color-text)] outline-none border-b border-[var(--color-border)] placeholder:text-[var(--color-muted)]"
          />
          {query.trim() && (
            <div class="max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <p class="px-4 py-3 text-sm text-[var(--color-muted)]">No results found.</p>
              ) : (
                <>
                  {renderSection('Posts', postResults)}
                  {renderSection('Books', bookResults)}
                  {renderSection('Photos', photoResults)}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
