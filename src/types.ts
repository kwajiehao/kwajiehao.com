// ABOUTME: Shared TypeScript types for blog data structures.
// ABOUTME: Defines Post metadata and tag map shapes used across the app.

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  readingTime: number
  hidden: boolean
  html: string
}

export type TagMap = Record<string, Post[]>

export interface Book {
  slug: string
  title: string
  author: string[]
  coverImage?: string
  year?: number
  publisher?: string
  tags: string[]
  description?: string
  dateAdded: string
}

export type BookTagMap = Record<string, Book[]>

export interface PhotoCollection {
  slug: string
  title: string
  date: string
  cover: string
  layout: 'grid' | 'single'
  hidden: boolean
  images: string[]
  description?: string
  html: string
}

export interface SiteConfig {
  heroImage: string
}
