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
