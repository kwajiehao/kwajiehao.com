// ABOUTME: Tests for responsive image utility functions.

import { describe, it, expect } from 'vitest'
import { getResponsiveImageAttrs } from './image'

describe('getResponsiveImageAttrs', () => {
  it('generates srcSet for photos.kwajiehao.com URLs', () => {
    const result = getResponsiveImageAttrs(
      'https://photos.kwajiehao.com/life-in-color/paris-gallery.jpeg'
    )

    expect(result.src).toBe(
      'https://photos.kwajiehao.com/life-in-color/paris-gallery.jpeg'
    )
    expect(result.srcSet).toBe(
      'https://photos.kwajiehao.com/life-in-color/paris-gallery-400.webp 400w, ' +
      'https://photos.kwajiehao.com/life-in-color/paris-gallery-800.webp 800w, ' +
      'https://photos.kwajiehao.com/life-in-color/paris-gallery-1200.webp 1200w, ' +
      'https://photos.kwajiehao.com/life-in-color/paris-gallery-1600.webp 1600w'
    )
  })

  it('handles URLs with .png extension', () => {
    const result = getResponsiveImageAttrs(
      'https://photos.kwajiehao.com/collection/photo.png'
    )

    expect(result.src).toBe(
      'https://photos.kwajiehao.com/collection/photo.png'
    )
    expect(result.srcSet).toBe(
      'https://photos.kwajiehao.com/collection/photo-400.webp 400w, ' +
      'https://photos.kwajiehao.com/collection/photo-800.webp 800w, ' +
      'https://photos.kwajiehao.com/collection/photo-1200.webp 1200w, ' +
      'https://photos.kwajiehao.com/collection/photo-1600.webp 1600w'
    )
  })

  it('passes through non-photos.kwajiehao.com URLs unchanged', () => {
    const result = getResponsiveImageAttrs(
      'https://example.com/image.jpg'
    )

    expect(result.src).toBe('https://example.com/image.jpg')
    expect(result.srcSet).toBeUndefined()
  })

  it('passes through relative URLs unchanged', () => {
    const result = getResponsiveImageAttrs('/images/photo.jpg')

    expect(result.src).toBe('/images/photo.jpg')
    expect(result.srcSet).toBeUndefined()
  })

  it('handles filenames with multiple dots', () => {
    const result = getResponsiveImageAttrs(
      'https://photos.kwajiehao.com/trip/my.photo.name.jpeg'
    )

    expect(result.src).toBe(
      'https://photos.kwajiehao.com/trip/my.photo.name.jpeg'
    )
    expect(result.srcSet).toBe(
      'https://photos.kwajiehao.com/trip/my.photo.name-400.webp 400w, ' +
      'https://photos.kwajiehao.com/trip/my.photo.name-800.webp 800w, ' +
      'https://photos.kwajiehao.com/trip/my.photo.name-1200.webp 1200w, ' +
      'https://photos.kwajiehao.com/trip/my.photo.name-1600.webp 1600w'
    )
  })

  it('handles URLs that already end in .webp', () => {
    const result = getResponsiveImageAttrs(
      'https://photos.kwajiehao.com/collection/photo.webp'
    )

    expect(result.src).toBe(
      'https://photos.kwajiehao.com/collection/photo.webp'
    )
    expect(result.srcSet).toBe(
      'https://photos.kwajiehao.com/collection/photo-400.webp 400w, ' +
      'https://photos.kwajiehao.com/collection/photo-800.webp 800w, ' +
      'https://photos.kwajiehao.com/collection/photo-1200.webp 1200w, ' +
      'https://photos.kwajiehao.com/collection/photo-1600.webp 1600w'
    )
  })
})
