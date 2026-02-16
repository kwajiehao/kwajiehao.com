// ABOUTME: Vite plugin that processes markdown blog posts into virtual modules.
// ABOUTME: Provides virtual:blog-posts and virtual:blog-tags for use in the app.

import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { createHighlighter, type Highlighter } from 'shiki'

const POSTS_DIR = 'content/posts'
const VIRTUAL_POSTS = 'virtual:blog-posts'
const VIRTUAL_TAGS = 'virtual:blog-tags'
const RESOLVED_POSTS = '\0' + VIRTUAL_POSTS
const RESOLVED_TAGS = '\0' + VIRTUAL_TAGS

export interface PostData {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  readingTime: number
  hidden: boolean
  html: string
}

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function validateFrontmatter(data: Record<string, unknown>, filePath: string): void {
  const required = ['title', 'date', 'tags', 'description', 'slug']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required frontmatter field "${field}" in ${filePath}`)
    }
  }
  if (!Array.isArray(data.tags)) {
    throw new Error(`"tags" must be an array in ${filePath}`)
  }
}

async function createMarkedWithHighlighter(highlighter: Highlighter): Promise<Marked> {
  const marked = new Marked()
  marked.use({
    renderer: {
      code({ text, lang }: { text: string; lang?: string }) {
        const language = lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text'
        return highlighter.codeToHtml(text, {
          lang: language,
          themes: { light: 'github-light', dark: 'github-dark' },
        })
      },
    },
  })
  return marked
}

async function processPostFile(
  filePath: string,
  marked: Marked,
): Promise<PostData> {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  validateFrontmatter(data, filePath)

  const html = await marked.parse(content)
  const readingTime = calculateReadingTime(content)

  return {
    slug: data.slug as string,
    title: data.title as string,
    date: new Date(data.date as string).toISOString().split('T')[0],
    tags: data.tags as string[],
    description: data.description as string,
    readingTime,
    hidden: data.hidden === true,
    html: html as string,
  }
}

async function loadAllPosts(postsDir: string, marked: Marked): Promise<PostData[]> {
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
  const posts = await Promise.all(
    files.map((file) => processPostFile(path.join(postsDir, file), marked)),
  )

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

function buildTagMap(posts: PostData[]): Record<string, PostData[]> {
  const tagMap: Record<string, PostData[]> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap[tag]) tagMap[tag] = []
      tagMap[tag].push(post)
    }
  }
  return tagMap
}

export default function blogPostsPlugin(): Plugin {
  let postsDir: string
  let highlighter: Highlighter
  let marked: Marked

  return {
    name: 'blog-posts',

    async configResolved(config) {
      postsDir = path.resolve(config.root, POSTS_DIR)
      highlighter = await createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['typescript', 'javascript', 'python', 'bash', 'json', 'html', 'css', 'yaml', 'markdown', 'text'],
      })
      marked = await createMarkedWithHighlighter(highlighter)
    },

    resolveId(id) {
      if (id === VIRTUAL_POSTS) return RESOLVED_POSTS
      if (id === VIRTUAL_TAGS) return RESOLVED_TAGS
    },

    async load(id) {
      if (id === RESOLVED_POSTS) {
        const posts = await loadAllPosts(postsDir, marked)
        return `export default ${JSON.stringify(posts)}`
      }
      if (id === RESOLVED_TAGS) {
        const posts = await loadAllPosts(postsDir, marked)
        const visiblePosts = posts.filter((p) => !p.hidden)
        const tagMap = buildTagMap(visiblePosts)
        return `export default ${JSON.stringify(tagMap)}`
      }
    },

    configureServer(server) {
      server.watcher.add(path.resolve(postsDir))
      server.watcher.on('change', (changedPath) => {
        if (changedPath.startsWith(postsDir) && changedPath.endsWith('.md')) {
          const mod1 = server.moduleGraph.getModuleById(RESOLVED_POSTS)
          const mod2 = server.moduleGraph.getModuleById(RESOLVED_TAGS)
          if (mod1) server.moduleGraph.invalidateModule(mod1)
          if (mod2) server.moduleGraph.invalidateModule(mod2)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
