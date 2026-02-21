// ABOUTME: Site-wide layout with header navigation and footer.
// ABOUTME: Wraps all pages with consistent structure and dark mode toggle.

import type { ComponentChildren } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { useLocation } from 'preact-iso'
import { ThemeToggle } from './ThemeToggle.tsx'
import { Search } from './Search.tsx'

interface LayoutProps {
  children: ComponentChildren
  maxWidth?: 'narrow' | 'wide'
}

const maxWidthClasses = {
  narrow: 'max-w-[900px]',
  wide: 'max-w-[1100px]',
}

function NavLink({ href, children }: { href: string; children: ComponentChildren }) {
  const { path } = useLocation()
  const isActive = path === href || (href !== '/' && path.startsWith(href))
  return (
    <a
      href={href}
      class={`hover:text-[var(--color-accent)] transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}
    >
      {children}
    </a>
  )
}

export function Layout({ children, maxWidth = 'narrow' }: LayoutProps) {
  const widthClass = maxWidthClasses[maxWidth]
  const [menuOpen, setMenuOpen] = useState(false)
  const { path } = useLocation()

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [path])

  return (
    <div class="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <header class={`w-full ${widthClass} mx-auto px-6 py-4`}>
        <div class="flex items-center justify-between">
          <a href="/" class="text-lg font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0">
            Kwa Jie Hao
          </a>
          {/* Desktop nav */}
          <nav class="hidden md:flex items-center gap-6 text-sm">
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/library">Library</NavLink>
            <NavLink href="/photos">Photos</NavLink>
            <NavLink href="/tags">Tags</NavLink>
            <NavLink href="/about">About</NavLink>
            <a
              href="https://instagram.com/oaheijawk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="p-1 hover:text-[var(--color-accent)] transition-colors text-[var(--color-text)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <Search />
            <ThemeToggle />
          </nav>
          {/* Mobile hamburger button */}
          <button
            class="md:hidden p-1 hover:text-[var(--color-accent)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <nav class="md:hidden flex flex-col gap-4 pt-4 pb-2 text-sm border-t border-[var(--color-border)] mt-4">
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/library">Library</NavLink>
            <NavLink href="/photos">Photos</NavLink>
            <NavLink href="/tags">Tags</NavLink>
            <NavLink href="/about">About</NavLink>
            <div class="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com/oaheijawk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="p-1 hover:text-[var(--color-accent)] transition-colors text-[var(--color-text)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <Search />
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>
      <main class={`w-full ${widthClass} mx-auto px-6 flex-1`}>
        {children}
      </main>
      <footer class={`w-full ${widthClass} mx-auto px-6 py-8 text-sm text-[var(--color-muted)] flex justify-between`}>
        <span>&copy; {new Date().getFullYear()} Kwa Jie Hao</span>
        <a href="/feed.xml" class="hover:text-[var(--color-accent)] transition-colors">RSS</a>
      </footer>
    </div>
  )
}
