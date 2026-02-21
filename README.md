# kwajiehao.com

## Adding Photo Collections

### 1. Add images

Place your image files in `public/photos/<collection-slug>/`:

```
public/photos/japan-2024/
├── cover.jpg
├── 01.jpg
├── 02.jpg
├── 03.jpg
└── 04.jpg
```

### 2. Create a collection file

Create a markdown file in `content/collections/<collection-slug>.md` with YAML frontmatter:

```yaml
---
title: "Japan, 2024"
slug: japan-2024
date: 2024-03-15
cover: /photos/japan-2024/cover.jpg
layout: grid
images:
  - /photos/japan-2024/01.jpg
  - /photos/japan-2024/02.jpg
  - /photos/japan-2024/03.jpg
  - /photos/japan-2024/04.jpg
---

Optional description text goes here. Supports **markdown**.
```

### Frontmatter fields

| Field | Required | Description |
|---|---|---|
| `title` | yes | Display name for the collection |
| `slug` | yes | URL-safe identifier (used in `/photos/:slug`) |
| `date` | yes | Date in `YYYY-MM-DD` format |
| `cover` | yes | Path to cover image shown on `/photos` listing |
| `images` | yes | Array of image paths in display order |
| `layout` | no | `"grid"` (2x2 per page, default) or `"single"` (1 wide image per page) |
| `hidden` | no | `true` to hide from listings (default `false`) |

### 3. Set the homepage hero image

Edit `content/site.yaml` to point to your chosen hero image:

```yaml
heroImage: /photos/japan-2024/cover.jpg
```

### Layout modes

- **grid** — 2x2 images per page on desktop, 2 stacked images per page on mobile. Good for collections with many images.
- **single** — One full-width image per page. Good for landscape/panoramic shots or smaller curated sets.

## Adding Books to the Library

The library page (`/library`) displays a catalog of art books with tag-based filtering and sorting.

### How it works

Books are defined in `content/books.yaml` as a YAML array. A Vite plugin (`plugins/art-books.ts`) parses and validates the YAML at build time, producing two virtual modules:

- `virtual:art-books` — all books sorted by `dateAdded` (newest first)
- `virtual:art-book-tags` — map of tag name to books with that tag

The `/library` page imports these modules and provides client-side tag filtering (AND semantics — selecting multiple tags shows only books matching all of them) and sorting by date added, title, author, or year.

The dev server watches `content/books.yaml` for changes and hot-reloads automatically.

### Adding a book

Add an entry to `content/books.yaml`:

```yaml
- slug: my-book
  title: My Book Title
  author: Author Name
  tags: [photography, landscape]
  dateAdded: "2026-02-22"
  year: 2020
  publisher: Publisher Name
  coverImage: /photos/my-book/cover.jpg
  description: A short description of the book.
```

### Fields

| Field | Required | Description |
|---|---|---|
| `slug` | yes | URL-safe unique identifier |
| `title` | yes | Display name |
| `author` | yes | Author name |
| `tags` | yes | Array of tag strings (used for filtering) |
| `dateAdded` | yes | Date added in `YYYY-MM-DD` format |
| `year` | no | Publication year |
| `publisher` | no | Publisher name |
| `coverImage` | no | Path to cover image (falls back to a placeholder with author initials) |
| `description` | no | Short text description |
