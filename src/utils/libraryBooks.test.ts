// ABOUTME: Tests for library book filtering and sorting semantics.
// ABOUTME: Covers multi-tag filters and search composition.

import { describe, expect, it } from 'vitest'
import type { Book } from '../types.ts'
import { filterAndSortLibraryBooks } from './libraryBooks.ts'

const books: Book[] = [
  {
    slug: 'photography-only',
    title: 'Photography Only',
    author: ['A Photographer'],
    publisher: 'Aperture',
    tags: ['photography'],
    dateAdded: '2026-02-01',
  },
  {
    slug: 'japan-only',
    title: 'Japan Only',
    author: ['A Writer'],
    publisher: 'Tokyo Press',
    tags: ['japan'],
    dateAdded: '2026-02-02',
  },
  {
    slug: 'both-tags',
    title: 'Both Tags',
    author: ['A Curator'],
    tags: ['photography', 'japan'],
    dateAdded: '2026-02-03',
  },
  {
    slug: 'neither-tag',
    title: 'Neither Tag',
    author: ['A Painter'],
    tags: ['painting'],
    dateAdded: '2026-02-04',
  },
]

describe('filterAndSortLibraryBooks', () => {
  it('matches books with any selected tag', () => {
    const result = filterAndSortLibraryBooks(books, {
      activeTags: new Set(['photography', 'japan']),
      sortField: 'title',
      searchQuery: '',
    })

    expect(result.map((book) => book.slug)).toEqual([
      'both-tags',
      'japan-only',
      'photography-only',
    ])
  })

  it('applies search within the selected tag union', () => {
    const result = filterAndSortLibraryBooks(books, {
      activeTags: new Set(['photography', 'painting']),
      sortField: 'title',
      searchQuery: 'aperture',
    })

    expect(result.map((book) => book.slug)).toEqual(['photography-only'])
  })
})
