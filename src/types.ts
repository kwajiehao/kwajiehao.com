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
