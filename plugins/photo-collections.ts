// ABOUTME: Vite plugin that processes photo collection markdown files into virtual modules.
// ABOUTME: Provides virtual:photo-collections for use in the app.

import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const PHOTOS_DIR = 'content/collections'
const VIRTUAL_COLLECTIONS = 'virtual:photo-collections'
const RESOLVED_COLLECTIONS = '\0' + VIRTUAL_COLLECTIONS

export interface PhotoCollectionData {
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

export function validatePhotoFrontmatter(data: Record<string, unknown>, filePath: string): void {
  const required = ['title', 'slug', 'date', 'cover', 'images']
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required frontmatter field "${field}" in ${filePath}`)
    }
  }
  if (!Array.isArray(data.images)) {
    throw new Error(`"images" must be an array in ${filePath}`)
  }
  if ('layout' in data && data.layout !== 'grid' && data.layout !== 'single') {
    throw new Error(`"layout" must be "grid" or "single" in ${filePath}`)
  }
}

export function parsePhotoCollection(raw: string, filePath: string): PhotoCollectionData {
  const { data, content } = matter(raw)

  validatePhotoFrontmatter(data, filePath)

  const html = content.trim() ? (marked.parse(content) as string) : ''

  return {
    slug: data.slug as string,
    title: data.title as string,
    date: new Date(data.date as string).toISOString().split('T')[0],
    cover: data.cover as string,
    layout: (data.layout as 'grid' | 'single') || 'grid',
    hidden: data.hidden === true,
    images: data.images as string[],
    html,
  }
}

function loadAllCollections(photosDir: string): PhotoCollectionData[] {
  if (!fs.existsSync(photosDir)) return []

  const files = fs.readdirSync(photosDir).filter((f) => f.endsWith('.md'))
  const collections = files.map((file) => {
    const raw = fs.readFileSync(path.join(photosDir, file), 'utf-8')
    return parsePhotoCollection(raw, file)
  })

  return collections.sort((a, b) => b.date.localeCompare(a.date))
}

export default function photoCollectionsPlugin(): Plugin {
  let photosDir: string

  return {
    name: 'photo-collections',

    configResolved(config) {
      photosDir = path.resolve(config.root, PHOTOS_DIR)
    },

    resolveId(id) {
      if (id === VIRTUAL_COLLECTIONS) return RESOLVED_COLLECTIONS
    },

    load(id) {
      if (id === RESOLVED_COLLECTIONS) {
        const collections = loadAllCollections(photosDir)
        return `export default ${JSON.stringify(collections)}`
      }
    },

    configureServer(server) {
      server.watcher.add(path.resolve(photosDir))
      server.watcher.on('change', (changedPath) => {
        if (changedPath.startsWith(photosDir) && changedPath.endsWith('.md')) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_COLLECTIONS)
          if (mod) server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
