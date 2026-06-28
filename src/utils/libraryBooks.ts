// ABOUTME: Library book filtering and sorting helpers.
// ABOUTME: Keeps list behavior testable without importing virtual content modules.

import type { Book } from '../types.ts'

interface LibraryBookFilterOptions {
  activeTags: ReadonlySet<string>
  sortField: string
  searchQuery: string
}

export function sortBooks(items: Book[], field: string): Book[] {
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

export function filterAndSortLibraryBooks(
  items: Book[],
  { activeTags, sortField, searchQuery }: LibraryBookFilterOptions,
): Book[] {
  let result = items

  if (activeTags.size > 0) {
    result = result.filter((book) =>
      [...activeTags].some((tag) => book.tags.includes(tag)),
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
}
