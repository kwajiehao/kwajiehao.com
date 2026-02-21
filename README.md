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
