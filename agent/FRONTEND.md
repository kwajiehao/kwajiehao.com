# Frontend Architecture

## Stack

- **Framework**: Preact v10 (lightweight React alternative)
- **Build tool**: Vite v6 with `@preact/preset-vite`
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`) + CSS custom properties for theming
- **Routing**: `preact-iso` (path-based routing with SSG support)
- **Content**: Markdown with YAML frontmatter, processed by `marked` + `shiki` for syntax highlighting
- **Testing**: Vitest + `@testing-library/preact` (jsdom environment)
- **Deployment**: Cloudflare Pages (output to `dist/`)

## Routes

Defined in `src/app.tsx`:

| Path | Page | Description |
|---|---|---|
| `/` | HomePage | Landing page with intro + 5 most recent posts |
| `/blog` | BlogListPage | All posts, reverse chronological |
| `/blog/:slug` | PostPage | Individual post with rendered markdown |
| `/tags` | TagIndexPage | All tags with post counts |
| `/tags/:tag` | TagPage | Posts filtered by tag |
| `/about` | AboutPage | Static bio |

## File Structure

```
src/
├── main.tsx              # Entry point (hydration + prerender export)
├── app.tsx               # Route definitions
├── index.css             # Global styles + theme CSS variables
├── types.ts              # Shared types (Post, TagMap)
├── vite-env.d.ts         # Virtual module type declarations
├── components/
│   ├── Layout.tsx        # Site shell: header, nav, footer, theme toggle
│   ├── ThemeToggle.tsx   # Dark/light mode switcher
│   ├── PostCard.tsx      # Blog post summary card
│   ├── TagBadge.tsx      # Clickable tag pill
│   └── Search.tsx        # Client-side search overlay ("/" shortcut)
└── pages/
    ├── HomePage.tsx
    ├── BlogListPage.tsx
    ├── PostPage.tsx
    ├── TagIndexPage.tsx
    ├── TagPage.tsx
    └── AboutPage.tsx
plugins/
├── blog-posts.ts         # Vite plugin: virtual:blog-posts & virtual:blog-tags
├── blog-posts.test.ts
└── rss-feed.ts           # Generates dist/feed.xml at build time
content/
└── posts/                # Markdown blog posts with YAML frontmatter
```

## Content Pipeline

Blog posts live in `content/posts/` as `.md` files with required frontmatter:

```yaml
---
title: string
date: YYYY-MM-DD
tags: string[]
description: string
slug: string
hidden: boolean  # optional, excludes from listings
---
```

A custom Vite plugin (`plugins/blog-posts.ts`) exposes two virtual modules:
- `virtual:blog-posts` — array of all visible posts sorted by date descending
- `virtual:blog-tags` — map of tag name → posts

Markdown is parsed with `marked`, syntax-highlighted with `shiki` (dual-theme), and frontmatter extracted with `gray-matter`. Reading time is calculated at `Math.max(1, Math.round(wordCount / 200))` minutes. The dev server watches `content/posts/` for hot reload.

## Theme & Color System

### How it works

Theme is controlled by a `data-theme` attribute on `<html>`, set to `"light"` or `"dark"`. Colors are defined as CSS custom properties in `src/index.css` under `:root` (light) and `[data-theme="dark"]` (dark). Components reference these via Tailwind arbitrary values like `bg-[var(--color-bg)]`.

### Theme toggle

`src/components/ThemeToggle.tsx` handles persistence:
1. Checks `localStorage` key `"theme"`
2. Falls back to `window.matchMedia('(prefers-color-scheme: dark)')`
3. Defaults to light if no preference
4. Sets `data-theme` on `document.documentElement`

### Color tokens

Defined in `src/index.css`:

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--color-bg` | `#e5ebe0` (sage green) | `#1c1917` (warm black) | Page background |
| `--color-text` | `#2d2d2d` (dark gray) | `#e7e0d8` (off-white) | Body text |
| `--color-accent` | `#b85c38` (terracotta) | `#d4896a` (light terracotta) | Links, highlights |
| `--color-muted` | `#6b7268` (olive gray) | `#a39890` (warm gray) | Secondary text |
| `--color-code-bg` | `#d9e0d3` (pale sage) | `#292420` (dark warm) | Inline code background |
| `--color-border` | `#cdd5c7` (sage) | `#3a3330` (charcoal) | Borders |

The light theme uses a sage green palette inspired by Japanese interior design. The dark theme uses warm earthy tones. The terracotta accent works as a complementary color against both.

### Tailwind config

`tailwind.config.js` defines a custom `warm-black` color scale and the IBM Plex Sans font family. It's a minimal config — most theming is handled through the CSS custom properties above rather than Tailwind's theme extension.

### Shiki syntax highlighting

Code blocks use Shiki with dual themes. Light theme colors are inlined; dark theme colors use CSS custom properties (`--shiki-dark`, `--shiki-dark-bg`) activated by `[data-theme="dark"]` selectors in `index.css`.

## Prerendering (SSG)

The site is statically generated at build time. `src/main.tsx` exports a `prerender()` function that Vite calls during build to crawl all routes and emit static HTML. The output goes to `dist/` for Cloudflare Pages deployment.

## TypeScript

- Target: ES2022, strict mode enabled
- Preact JSX via `jsxImportSource: "preact"`
- Path aliases map `react`/`react-dom` to `preact/compat` for library compatibility
- Virtual module types declared in `src/vite-env.d.ts`
