# kwajiehao.com

## Image Hosting (Cloudflare R2)

Photos are hosted on Cloudflare R2 and served via a custom subdomain (e.g., `photos.kwajiehao.com`). This keeps the git repo lean and serves images from Cloudflare's CDN.

### One-time setup

1. **Create an R2 bucket** in the Cloudflare dashboard (Storage & Databases > R2 > Create bucket). Name it something like `kwajiehao-blog`.

2. **Connect a custom subdomain** — in the bucket settings, go to Settings > Public access > Custom Domains and add `photos.kwajiehao.com`. Cloudflare handles the DNS and SSL automatically.

3. **Install Wrangler** (if not already):

   ```sh
   npm install -D wrangler
   npx wrangler login
   ```

Note that Cloudflare recommends installing Wrangler within your project so we use `npx` to call it.

### Bucket structure

Images are organized by collection slug:

```
kwajiehao-blog/
├── japan-2024/
│   ├── cover.jpg
│   ├── 01.jpg
│   ├── 02.jpg
│   └── 03.jpg
├── life-in-color/
│   ├── sagrada-vertical-1.jpeg
│   ├── southern-france-train.jpeg
│   └── ...
```

## Adding Photo Collections

### 1. Upload images to R2

Upload each image using Wrangler:

```sh
npx wrangler r2 object put kwajiehao-blog/<collection-slug>/<filename> --file <local-path> --remote
```

For example, to upload all images for a new collection:

```sh
# Upload all images in a local folder to R2
for file in /path/to/local/images/*; do
  npx wrangler r2 object put "kwajiehao-blog/japan-2024/$(basename "$file")" --file "$file" --remote
done
```

To verify an upload, check the image URL directly in your browser (e.g., `https://photos.kwajiehao.com/japan-2024/cover.jpg`), or browse the bucket contents in the Cloudflare dashboard under Storage & Databases > R2 > kwajiehao-blog.

### 2. Create a collection file

Create a markdown file in `content/collections/<collection-slug>.md` with YAML frontmatter. Image paths should use the full R2 subdomain URL:

```yaml
---
title: "Japan, 2024"
slug: japan-2024
date: 2024-03-15
cover: https://photos.kwajiehao.com/japan-2024/cover.jpg
layout: grid
images:
  - https://photos.kwajiehao.com/japan-2024/01.jpg
  - https://photos.kwajiehao.com/japan-2024/02.jpg
  - https://photos.kwajiehao.com/japan-2024/03.jpg
  - https://photos.kwajiehao.com/japan-2024/04.jpg
---

Optional description text goes here. Supports **markdown**.
```

### Frontmatter fields

| Field | Required | Description |
|---|---|---|
| `title` | yes | Display name for the collection |
| `slug` | yes | URL-safe identifier (used in `/photos/:slug`) |
| `date` | yes | Date in `YYYY-MM-DD` format |
| `cover` | yes | Full R2 URL to cover image shown on `/photos` listing |
| `images` | yes | Array of full R2 image URLs in display order |
| `layout` | no | `"grid"` (2x2 per page, default) or `"single"` (1 wide image per page) |
| `hidden` | no | `true` to hide from listings (default `false`) |

### 3. Set the homepage hero image

Edit `content/site.yaml` to point to your chosen hero image:

```yaml
heroImage: https://photos.kwajiehao.com/japan-2024/cover.jpg
```

### Layout modes

- **grid** — 2x2 images per page on desktop, 2 stacked images per page on mobile. Good for collections with many images.
- **single** — One full-width image per page. Good for landscape/panoramic shots or smaller curated sets.

### Managing R2 images

```sh
# Upload a single image
npx wrangler r2 object put kwajiehao-blog/<collection-slug>/<filename> --file <local-path> --remote

# Upload all images in a local folder
for file in /path/to/local/images/*; do
  npx wrangler r2 object put "kwajiehao-blog/<collection-slug>/$(basename "$file")" --file "$file" --remote
done

# Delete a single image
npx wrangler r2 object delete kwajiehao-blog/<collection-slug>/<filename> --remote

# Download an image (useful for checking what's uploaded)
npx wrangler r2 object get kwajiehao-blog/<collection-slug>/<filename> --file <local-path> --remote
```

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
