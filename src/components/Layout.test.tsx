// ABOUTME: Regression tests for public links in the shared site navigation.
// ABOUTME: Ensures private-purpose routes remain directly reachable but undiscoverable from global nav.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Layout navigation', () => {
  it('does not publicize the Rochester cat-care route in desktop or mobile navigation', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/components/Layout.tsx'), 'utf8')

    expect(source).not.toContain('Cat Care')
    expect(source).not.toContain('/rochester-cat-care')
  })
})
