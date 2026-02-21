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
| `/` | HomePage | Full-width hero image (configured in `content/site.yaml`) |
| `/blog` | BlogListPage | All posts, reverse chronological |
| `/blog/:slug` | PostPage | Individual post with rendered markdown |
| `/library` | LibraryPage | Art book catalog with tag filtering and sorting |
| `/photos` | PhotosPage | Photo collections listing (two-column masonry) |
| `/photos/:slug` | PhotoCollectionPage | Individual collection with horizontal-scroll gallery |
| `/tags` | TagIndexPage | All tags with post counts |
| `/tags/:tag` | TagPage | Posts filtered by tag |
| `/about` | AboutPage | Static bio |

## File Structure

```
src/
├── main.tsx              # Entry point (hydration + prerender export)
├── app.tsx               # Route definitions
├── index.css             # Global styles + theme CSS variables
├── types.ts              # Shared types (Post, TagMap, Book, BookTagMap, PhotoCollection, SiteConfig)
├── vite-env.d.ts         # Virtual module type declarations
├── components/
│   ├── Layout.tsx        # Site shell: header, nav, footer, theme toggle (supports narrow/wide/full maxWidth)
│   ├── ThemeToggle.tsx   # Dark/light mode switcher
│   ├── PostCard.tsx      # Blog post summary card
│   ├── TagBadge.tsx      # Clickable tag pill
│   ├── BookCard.tsx      # Art book card with cover image/placeholder
│   ├── BookFilterBar.tsx # Tag filter pills, sort dropdown, result count
│   ├── PhotoGallery.tsx  # Horizontal-scroll gallery (grid/single layout modes)
│   └── Search.tsx        # Client-side search overlay ("/" shortcut)
└── pages/
    ├── HomePage.tsx          # Full-bleed hero image
    ├── BlogListPage.tsx
    ├── PostPage.tsx
    ├── TagIndexPage.tsx
    ├── TagPage.tsx
    ├── AboutPage.tsx
    ├── LibraryPage.tsx       # Art book catalog with filtering and sorting
    ├── PhotosPage.tsx        # Photo collections listing
    └── PhotoCollectionPage.tsx # Individual collection with gallery
plugins/
├── blog-posts.ts             # Vite plugin: virtual:blog-posts & virtual:blog-tags
├── blog-posts.test.ts
├── art-books.ts              # Vite plugin: virtual:art-books & virtual:art-book-tags
├── art-books.test.ts
├── photo-collections.ts      # Vite plugin: virtual:photo-collections
├── photo-collections.test.ts
├── site-config.ts            # Vite plugin: virtual:site-config
└── rss-feed.ts               # Generates dist/feed.xml at build time
content/
├── posts/                # Markdown blog posts with YAML frontmatter
├── photos/               # Markdown photo collection files with YAML frontmatter
├── books.yaml            # Art book catalog (YAML array of Book entries)
└── site.yaml             # Site-level config (heroImage, etc.)
public/
└── photos/               # Photo image files organized by collection slug
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

### Art books

Art books are defined in `content/books.yaml` as a YAML array with required fields: `slug`, `title`, `author`, `tags`, `dateAdded`. Optional fields: `coverImage`, `year`, `publisher`, `description`.

A custom Vite plugin (`plugins/art-books.ts`) exposes two virtual modules:
- `virtual:art-books` — array of all books sorted by dateAdded descending
- `virtual:art-book-tags` — map of tag name → books

YAML is parsed with `js-yaml`. The dev server watches `content/books.yaml` for hot reload. The `/library` page provides client-side tag filtering (AND semantics) and sorting (dateAdded, title, author, year).

### Photo collections

Photo collections are markdown files in `content/collections/` with required frontmatter: `title`, `slug`, `date`, `cover`, `images` (array of image paths). Optional: `layout` (`"grid"` or `"single"`, default `"grid"`), `hidden` (default `false`). The markdown body is rendered as an optional description.

Images are stored in `public/photos/<collection-slug>/`.

A custom Vite plugin (`plugins/photo-collections.ts`) exposes:
- `virtual:photo-collections` — array of all collections sorted by date descending

The dev server watches `content/collections/` for hot reload.

### Site config

Site-level configuration is defined in `content/site.yaml`. Currently supports:
- `heroImage` — path to the homepage hero image

A custom Vite plugin (`plugins/site-config.ts`) exposes:
- `virtual:site-config` — the parsed config object

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

Defined in `src/index.css` (Gallery Neutral palette):

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--color-bg` | `#ECEAE8` (warm gray) | `#161616` (near black) | Page background |
| `--color-text` | `#2D2D2D` (dark gray) | `#E0DCDA` (off-white) | Body text |
| `--color-accent` | `#7A6E66` (stone) | `#A89E96` (warm stone) | Links, highlights |
| `--color-muted` | `#9A938D` (warm gray) | `#7A746E` (mid gray) | Secondary text |
| `--color-code-bg` | `#E2DFDC` (light warm) | `#222222` (dark gray) | Inline code background |
| `--color-border` | `#D5D2CE` (light stone) | `#2E2E2E` (charcoal) | Borders |

The palette is gallery-neutral, designed to complement photography without competing with image colors.

### Tailwind config

`tailwind.config.js` defines a custom `warm-black` color scale and the IBM Plex Sans font family. It's a minimal config — most theming is handled through the CSS custom properties above rather than Tailwind's theme extension.

### Shiki syntax highlighting

Code blocks use Shiki with dual themes. Light theme colors are inlined; dark theme colors use CSS custom properties (`--shiki-dark`, `--shiki-dark-bg`) activated by `[data-theme="dark"]` selectors in `index.css`.

## Layout System

The `Layout` component (`src/components/Layout.tsx`) supports a `maxWidth` prop:
- `'narrow'` (default) — 700px max-width, standard padding
- `'wide'` — 1100px max-width, used for photo pages

## Prerendering (SSG)

The site is statically generated at build time. `src/main.tsx` exports a `prerender()` function that Vite calls during build to crawl all routes and emit static HTML. The output goes to `dist/` for Cloudflare Pages deployment.

## TypeScript

- Target: ES2022, strict mode enabled
- Preact JSX via `jsxImportSource: "preact"`
- Path aliases map `react`/`react-dom` to `preact/compat` for library compatibility
- Virtual module types declared in `src/vite-env.d.ts`
