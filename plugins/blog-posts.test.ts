// ABOUTME: Tests for the blog posts Vite plugin utilities.
// ABOUTME: Covers reading time calculation, frontmatter validation, and markdown processing.

import { describe, it, expect } from 'vitest'
import { calculateReadingTime, validateFrontmatter } from './blog-posts.ts'

describe('calculateReadingTime', () => {
  it('returns 1 minute for short text', () => {
    expect(calculateReadingTime('hello world')).toBe(1)
  })

  it('returns correct time for 200-word text', () => {
    const words = Array(200).fill('word').join(' ')
    expect(calculateReadingTime(words)).toBe(1)
  })

  it('returns correct time for 400-word text', () => {
    const words = Array(400).fill('word').join(' ')
    expect(calculateReadingTime(words)).toBe(2)
  })

  it('returns correct time for 1000-word text', () => {
    const words = Array(1000).fill('word').join(' ')
    expect(calculateReadingTime(words)).toBe(5)
  })

  it('rounds to nearest minute', () => {
    const words = Array(300).fill('word').join(' ')
    expect(calculateReadingTime(words)).toBe(2)
  })
})

describe('validateFrontmatter', () => {
  const validData = {
    title: 'Test Post',
    date: '2026-01-01',
    tags: ['test'],
    description: 'A test post',
    slug: 'test-post',
  }

  it('accepts valid frontmatter', () => {
    expect(() => validateFrontmatter(validData, 'test.md')).not.toThrow()
  })

  it('throws on missing title', () => {
    const { title: _, ...data } = validData
    expect(() => validateFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "title"')
  })

  it('throws on missing date', () => {
    const { date: _, ...data } = validData
    expect(() => validateFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "date"')
  })

  it('throws on missing tags', () => {
    const { tags: _, ...data } = validData
    expect(() => validateFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "tags"')
  })

  it('throws on missing description', () => {
    const { description: _, ...data } = validData
    expect(() => validateFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "description"')
  })

  it('throws on missing slug', () => {
    const { slug: _, ...data } = validData
    expect(() => validateFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "slug"')
  })

  it('throws when tags is not an array', () => {
    const data = { ...validData, tags: 'not-an-array' }
    expect(() => validateFrontmatter(data, 'test.md')).toThrow('"tags" must be an array')
  })

  it('includes filename in error message', () => {
    const { title: _, ...data } = validData
    expect(() => validateFrontmatter(data, 'my-post.md')).toThrow('my-post.md')
  })
})
