/// <reference types="vite/client" />

interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  readingTime: number
  hidden: boolean
  html: string
}

declare module 'virtual:blog-posts' {
  const posts: BlogPost[]
  export default posts
}

declare module 'virtual:blog-tags' {
  const tags: Record<string, BlogPost[]>
  export default tags
}

interface ArtBook {
  slug: string
  title: string
  author: string[]
  coverImage?: string
  year?: number
  publisher?: string
  tags: string[]
  description?: string
  dateAdded: string
}

declare module 'virtual:art-books' {
  const books: ArtBook[]
  export default books
}

declare module 'virtual:art-book-tags' {
  const tags: Record<string, ArtBook[]>
  export default tags
}

interface PhotoCollectionData {
  slug: string
  title: string
  date: string
  cover: string
  layout: 'grid' | 'single'
  hidden: boolean
  images: string[]
  description?: string
  html: string
}

declare module 'virtual:photo-collections' {
  const collections: PhotoCollectionData[]
  export default collections
}

interface SiteConfigData {
  heroImage: string
}

declare module 'virtual:site-config' {
  const config: SiteConfigData
  export default config
}
