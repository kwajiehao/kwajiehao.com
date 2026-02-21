// ABOUTME: Vite plugin that processes art book catalog from YAML into virtual modules.
// ABOUTME: Provides virtual:art-books and virtual:art-book-tags for use in the app.

import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const BOOKS_FILE = 'content/books.yaml'
const VIRTUAL_BOOKS = 'virtual:art-books'
const VIRTUAL_BOOK_TAGS = 'virtual:art-book-tags'
const RESOLVED_BOOKS = '\0' + VIRTUAL_BOOKS
const RESOLVED_BOOK_TAGS = '\0' + VIRTUAL_BOOK_TAGS

export interface BookData {
  slug: string
  title: string
  author: string
  coverImage?: string
  year?: number
  publisher?: string
  tags: string[]
  description?: string
  dateAdded: string
}

export function validateBookEntry(data: Record<string, unknown>): void {
  const required = ['slug', 'title', 'author', 'tags', 'dateAdded']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field "${field}" in book entry`)
    }
  }
  if (!Array.isArray(data.tags)) {
    throw new Error('"tags" must be an array in book entry')
  }
  if ('year' in data && typeof data.year !== 'number') {
    throw new Error('"year" must be a number in book entry')
  }
}

export function parseBooks(content: string): BookData[] {
  if (!content.trim()) return []

  const parsed = yaml.load(content) as Record<string, unknown>[] | null
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) return []

  const books: BookData[] = parsed.map((entry) => {
    validateBookEntry(entry as Record<string, unknown>)
    return {
      slug: entry.slug as string,
      title: entry.title as string,
      author: entry.author as string,
      coverImage: entry.coverImage as string | undefined,
      year: entry.year as number | undefined,
      publisher: entry.publisher as string | undefined,
      tags: entry.tags as string[],
      description: entry.description as string | undefined,
      dateAdded: entry.dateAdded as string,
    }
  })

  return books.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
}

export function buildBookTagMap(books: BookData[]): Record<string, BookData[]> {
  const tagMap: Record<string, BookData[]> = {}
  for (const book of books) {
    for (const tag of book.tags) {
      if (!tagMap[tag]) tagMap[tag] = []
      tagMap[tag].push(book)
    }
  }
  return tagMap
}

export default function artBooksPlugin(): Plugin {
  let booksFilePath: string

  return {
    name: 'art-books',

    configResolved(config) {
      booksFilePath = path.resolve(config.root, BOOKS_FILE)
    },

    resolveId(id) {
      if (id === VIRTUAL_BOOKS) return RESOLVED_BOOKS
      if (id === VIRTUAL_BOOK_TAGS) return RESOLVED_BOOK_TAGS
    },

    load(id) {
      if (id === RESOLVED_BOOKS) {
        const content = fs.existsSync(booksFilePath)
          ? fs.readFileSync(booksFilePath, 'utf-8')
          : ''
        const books = parseBooks(content)
        return `export default ${JSON.stringify(books)}`
      }
      if (id === RESOLVED_BOOK_TAGS) {
        const content = fs.existsSync(booksFilePath)
          ? fs.readFileSync(booksFilePath, 'utf-8')
          : ''
        const books = parseBooks(content)
        const tagMap = buildBookTagMap(books)
        return `export default ${JSON.stringify(tagMap)}`
      }
    },

    configureServer(server) {
      server.watcher.add(path.dirname(booksFilePath))
      server.watcher.on('change', (changedPath) => {
        if (changedPath === booksFilePath) {
          const mod1 = server.moduleGraph.getModuleById(RESOLVED_BOOKS)
          const mod2 = server.moduleGraph.getModuleById(RESOLVED_BOOK_TAGS)
          if (mod1) server.moduleGraph.invalidateModule(mod1)
          if (mod2) server.moduleGraph.invalidateModule(mod2)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
