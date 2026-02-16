// ABOUTME: Site-wide layout with header navigation and footer.
// ABOUTME: Wraps all pages with consistent structure and dark mode toggle.

import type { ComponentChildren } from 'preact'
import { useLocation } from 'preact-iso'
import { ThemeToggle } from './ThemeToggle.tsx'
import { Search } from './Search.tsx'

interface LayoutProps {
  children: ComponentChildren
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

export function Layout({ children }: LayoutProps) {
  return (
    <div class="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <header class="w-full max-w-[700px] mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <a href="/" class="text-lg font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors shrink-0">
          Kwa Jie Hao
        </a>
        <nav class="flex items-center gap-4 sm:gap-6 text-sm">
          <NavLink href="/blog">Blog</NavLink>
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
      </header>
      <main class="w-full max-w-[700px] mx-auto px-6 flex-1">
        {children}
      </main>
      <footer class="w-full max-w-[700px] mx-auto px-6 py-8 text-sm text-[var(--color-muted)] flex justify-between">
        <span>&copy; {new Date().getFullYear()} Kwa Jie Hao</span>
        <a href="/feed.xml" class="hover:text-[var(--color-accent)] transition-colors">RSS</a>
      </footer>
    </div>
  )
}
