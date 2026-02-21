// ABOUTME: Tests for the photo collections Vite plugin utilities.
// ABOUTME: Covers frontmatter validation and collection parsing.

import { describe, it, expect } from 'vitest'
import { validatePhotoFrontmatter, parsePhotoCollection } from './photo-collections.ts'

describe('validatePhotoFrontmatter', () => {
  const validData = {
    title: 'Japan, 2024',
    slug: 'japan-2024',
    date: '2024-03-15',
    cover: '/photos/japan-2024/cover.jpg',
    images: [
      '/photos/japan-2024/01.jpg',
      '/photos/japan-2024/02.jpg',
    ],
  }

  it('accepts valid frontmatter with minimal fields', () => {
    expect(() => validatePhotoFrontmatter(validData, 'test.md')).not.toThrow()
  })

  it('accepts valid frontmatter with all optional fields', () => {
    const data = { ...validData, layout: 'single', hidden: true }
    expect(() => validatePhotoFrontmatter(data, 'test.md')).not.toThrow()
  })

  it('throws on missing title', () => {
    const { title: _, ...data } = validData
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "title"')
  })

  it('throws on missing slug', () => {
    const { slug: _, ...data } = validData
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "slug"')
  })

  it('throws on missing date', () => {
    const { date: _, ...data } = validData
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "date"')
  })

  it('throws on missing cover', () => {
    const { cover: _, ...data } = validData
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "cover"')
  })

  it('throws on missing images', () => {
    const { images: _, ...data } = validData
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('Missing required frontmatter field "images"')
  })

  it('throws when images is not an array', () => {
    const data = { ...validData, images: 'not-an-array' }
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('"images" must be an array')
  })

  it('throws when layout is invalid', () => {
    const data = { ...validData, layout: 'mosaic' }
    expect(() => validatePhotoFrontmatter(data, 'test.md')).toThrow('"layout" must be "grid" or "single"')
  })

  it('accepts grid layout', () => {
    const data = { ...validData, layout: 'grid' }
    expect(() => validatePhotoFrontmatter(data, 'test.md')).not.toThrow()
  })

  it('accepts single layout', () => {
    const data = { ...validData, layout: 'single' }
    expect(() => validatePhotoFrontmatter(data, 'test.md')).not.toThrow()
  })

  it('includes filename in error message', () => {
    const { title: _, ...data } = validData
    expect(() => validatePhotoFrontmatter(data, 'my-photos.md')).toThrow('my-photos.md')
  })
})

describe('parsePhotoCollection', () => {
  it('parses minimal frontmatter with defaults', () => {
    const raw = `---
title: "Japan, 2024"
slug: japan-2024
date: 2024-03-15
cover: /photos/japan-2024/cover.jpg
images:
  - /photos/japan-2024/01.jpg
  - /photos/japan-2024/02.jpg
---`
    const result = parsePhotoCollection(raw, 'test.md')
    expect(result.title).toBe('Japan, 2024')
    expect(result.slug).toBe('japan-2024')
    expect(result.date).toBe('2024-03-15')
    expect(result.cover).toBe('/photos/japan-2024/cover.jpg')
    expect(result.layout).toBe('grid')
    expect(result.hidden).toBe(false)
    expect(result.images).toEqual(['/photos/japan-2024/01.jpg', '/photos/japan-2024/02.jpg'])
    expect(result.html).toBe('')
  })

  it('parses optional fields', () => {
    const raw = `---
title: "Street Scenes"
slug: street-scenes
date: 2024-06-01
cover: /photos/street/cover.jpg
layout: single
hidden: true
images:
  - /photos/street/01.jpg
---

Some description about the collection.`
    const result = parsePhotoCollection(raw, 'test.md')
    expect(result.layout).toBe('single')
    expect(result.hidden).toBe(true)
    expect(result.html).toContain('Some description about the collection.')
  })

  it('renders markdown body to html', () => {
    const raw = `---
title: Test
slug: test
date: 2024-01-01
cover: /photos/test/cover.jpg
images:
  - /photos/test/01.jpg
---

This is **bold** text.`
    const result = parsePhotoCollection(raw, 'test.md')
    expect(result.html).toContain('<strong>bold</strong>')
  })

  it('normalizes date format', () => {
    const raw = `---
title: Test
slug: test
date: 2024-03-15
cover: /photos/test/cover.jpg
images:
  - /photos/test/01.jpg
---`
    const result = parsePhotoCollection(raw, 'test.md')
    expect(result.date).toBe('2024-03-15')
  })
})
