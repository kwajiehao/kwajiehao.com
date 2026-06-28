// ABOUTME: Component tests for the expandable library book row.
// ABOUTME: Covers expanded metadata, tag placement, and layout alignment.

import { fireEvent, render, screen } from '@testing-library/preact'
import { describe, expect, it, vi } from 'vitest'
import { BookListItem } from './BookListItem.tsx'
import type { Book } from '../types.ts'

const book: Book = {
  slug: 'tokyo-nobody',
  title: 'Tokyo Nobody',
  author: ['Masataka Nakano'],
  coverImage: 'https://example.com/tokyo-nobody.jpg',
  publisher: 'Little More',
  year: 2000,
  tags: ['photography', 'japan'],
  dateAdded: '2026-02-21',
  notes: [
    {
      date: '2026-02-21',
      text: 'Empty streets and patient framing.',
    },
  ],
}

describe('BookListItem', () => {
  it('keeps expansion controlled while preserving compact row metadata', () => {
    const onToggle = vi.fn()
    const { container } = render(
      <BookListItem
        book={book}
        isExpanded={false}
        onToggle={onToggle}
        onTagClick={vi.fn()}
      />,
    )

    const topLinePrimary = container.querySelector('[data-topline-primary]')
    expect(topLinePrimary).not.toBeNull()
    expect(topLinePrimary?.textContent).toContain('Tokyo Nobody')
    expect(topLinePrimary?.textContent).toContain('Masataka Nakano')
    expect(topLinePrimary?.getAttribute('class')).toContain('justify-start')

    const topLineMetadata = container.querySelector('[data-topline-metadata]')
    expect(topLineMetadata).not.toBeNull()
    expect(topLineMetadata?.textContent).toBe('Little More / 2000')
    expect(topLineMetadata?.getAttribute('class')).toContain('text-right')

    const toggle = screen.getByRole('button', { name: /Tokyo Nobody/ })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('Empty streets and patient framing.')).toBeNull()
    expect(screen.queryByRole('img', { name: 'Tokyo Nobody cover' })).toBeNull()

    fireEvent.click(toggle)

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
  })

  it('renders notes, tags, and the mobile cover image when expanded', () => {
    const { container } = render(
      <BookListItem
        book={book}
        isExpanded={true}
        onToggle={vi.fn()}
        onTagClick={vi.fn()}
      />,
    )

    const details = container.querySelector('#book-details-tokyo-nobody')
    expect(details).not.toBeNull()
    expect(details?.getAttribute('class')).toContain('grid-cols-[minmax(0,1fr)_1.25rem]')
    expect(details?.getAttribute('class')).toContain(
      'sm:grid-cols-[minmax(0,1.35fr)_minmax(10rem,0.75fr)_minmax(9rem,0.65fr)_1.25rem]',
    )

    expect(details?.querySelector('aside')).toBeNull()
    expect(details?.querySelector('dl')).toBeNull()
    expect(screen.queryByText('Publisher')).toBeNull()
    expect(screen.queryByText('Year')).toBeNull()
    expect(screen.queryByText('Tags')).toBeNull()
    expect(screen.queryByText(/Added/)).toBeNull()
    expect(screen.queryByText(/21 Feb 2026/)).toBeNull()

    const cover = screen.getByRole('img', { name: 'Tokyo Nobody cover' })
    expect(cover.getAttribute('src')).toBe('https://example.com/tokyo-nobody.jpg')
    expect(cover.getAttribute('loading')).toBe('lazy')
    expect(cover.closest('figure')?.getAttribute('class')).toContain('lg:hidden')

    const tags = screen.getByLabelText('Tags for Tokyo Nobody')
    expect(tags.getAttribute('class')).toContain('col-start-1')
    expect(tags.getAttribute('class')).toContain('justify-start')
  })
})
