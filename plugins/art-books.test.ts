// ABOUTME: Tests for the art books Vite plugin utilities.
// ABOUTME: Covers book entry validation, YAML parsing, and tag map building.

import { describe, it, expect } from 'vitest'
import { validateBookEntry, parseBooks, buildBookTagMap } from './art-books.ts'

describe('validateBookEntry', () => {
  const validEntry = {
    slug: 'tokyo-nobody',
    title: 'Tokyo Nobody',
    author: 'Masataka Nakano',
    tags: ['photography', 'japanese'],
    dateAdded: '2026-02-21',
  }

  it('accepts a valid entry with required fields only', () => {
    expect(() => validateBookEntry(validEntry)).not.toThrow()
  })

  it('accepts a valid entry with all optional fields', () => {
    const entry = {
      ...validEntry,
      coverImage: '/images/books/tokyo-nobody.jpg',
      year: 2000,
      publisher: 'Steidl',
      description: 'A beautiful book about empty Tokyo.',
    }
    expect(() => validateBookEntry(entry)).not.toThrow()
  })

  it('throws on missing slug', () => {
    const { slug: _, ...entry } = validEntry
    expect(() => validateBookEntry(entry)).toThrow('Missing required field "slug"')
  })

  it('throws on missing title', () => {
    const { title: _, ...entry } = validEntry
    expect(() => validateBookEntry(entry)).toThrow('Missing required field "title"')
  })

  it('throws on missing author', () => {
    const { author: _, ...entry } = validEntry
    expect(() => validateBookEntry(entry)).toThrow('Missing required field "author"')
  })

  it('throws on missing tags', () => {
    const { tags: _, ...entry } = validEntry
    expect(() => validateBookEntry(entry)).toThrow('Missing required field "tags"')
  })

  it('throws on missing dateAdded', () => {
    const { dateAdded: _, ...entry } = validEntry
    expect(() => validateBookEntry(entry)).toThrow('Missing required field "dateAdded"')
  })

  it('throws when tags is not an array', () => {
    const entry = { ...validEntry, tags: 'not-an-array' }
    expect(() => validateBookEntry(entry)).toThrow('"tags" must be an array')
  })

  it('throws when year is not a number', () => {
    const entry = { ...validEntry, year: 'two thousand' }
    expect(() => validateBookEntry(entry)).toThrow('"year" must be a number')
  })
})

describe('parseBooks', () => {
  it('parses valid YAML into Book array', () => {
    const yaml = `
- slug: book-a
  title: Book A
  author: Author A
  tags: [art]
  dateAdded: "2026-02-20"
- slug: book-b
  title: Book B
  author: Author B
  tags: [photography]
  dateAdded: "2026-02-21"
`
    const books = parseBooks(yaml)
    expect(books).toHaveLength(2)
    expect(books[0].slug).toBe('book-b') // sorted by dateAdded desc
    expect(books[1].slug).toBe('book-a')
  })

  it('returns empty array for empty YAML', () => {
    expect(parseBooks('')).toEqual([])
  })

  it('returns empty array for YAML with no entries', () => {
    expect(parseBooks('[]')).toEqual([])
  })

  it('includes optional fields when present', () => {
    const yaml = `
- slug: test
  title: Test Book
  author: Test Author
  tags: [art]
  dateAdded: "2026-01-01"
  coverImage: /images/books/test.jpg
  year: 2020
  publisher: Steidl
  description: A great book
`
    const books = parseBooks(yaml)
    expect(books[0].coverImage).toBe('/images/books/test.jpg')
    expect(books[0].year).toBe(2020)
    expect(books[0].publisher).toBe('Steidl')
    expect(books[0].description).toBe('A great book')
  })

  it('throws on invalid entry', () => {
    const yaml = `
- slug: valid
  title: Valid
  author: Author
  tags: [art]
  dateAdded: "2026-01-01"
- title: Missing Slug
  author: Author
  tags: [art]
  dateAdded: "2026-01-01"
`
    expect(() => parseBooks(yaml)).toThrow('Missing required field "slug"')
  })
})

describe('buildBookTagMap', () => {
  const books = [
    {
      slug: 'book-a',
      title: 'Book A',
      author: 'Author A',
      tags: ['photography', 'japanese'],
      dateAdded: '2026-02-21',
    },
    {
      slug: 'book-b',
      title: 'Book B',
      author: 'Author B',
      tags: ['photography', 'american'],
      dateAdded: '2026-02-20',
    },
    {
      slug: 'book-c',
      title: 'Book C',
      author: 'Author C',
      tags: ['painting'],
      dateAdded: '2026-02-19',
    },
  ]

  it('groups books by tag', () => {
    const tagMap = buildBookTagMap(books)
    expect(Object.keys(tagMap)).toHaveLength(4)
    expect(tagMap['photography']).toHaveLength(2)
    expect(tagMap['japanese']).toHaveLength(1)
    expect(tagMap['american']).toHaveLength(1)
    expect(tagMap['painting']).toHaveLength(1)
  })

  it('preserves book references in tag groups', () => {
    const tagMap = buildBookTagMap(books)
    expect(tagMap['photography'][0].slug).toBe('book-a')
    expect(tagMap['photography'][1].slug).toBe('book-b')
    expect(tagMap['japanese'][0].slug).toBe('book-a')
  })

  it('returns empty map for empty array', () => {
    expect(buildBookTagMap([])).toEqual({})
  })
})
