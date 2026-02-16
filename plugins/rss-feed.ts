// ABOUTME: Vite plugin that generates an RSS feed at build time.
// ABOUTME: Creates feed.xml from blog post data in the output directory.

import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { Feed } from 'feed'

const POSTS_DIR = 'content/posts'
const SITE_URL = 'https://kwajiehao.com'

export default function rssFeedPlugin(): Plugin {
  let outDir: string
  let root: string

  return {
    name: 'rss-feed',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir
      root = config.root
    },

    async closeBundle() {
      const postsDir = path.resolve(root, POSTS_DIR)
      if (!fs.existsSync(postsDir)) return

      const marked = new Marked()
      const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

      const posts = await Promise.all(
        files.map(async (file) => {
          const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
          const { data, content } = matter(raw)
          const html = await marked.parse(content)
          return {
            title: data.title as string,
            date: new Date(data.date as string),
            description: data.description as string,
            slug: data.slug as string,
            hidden: data.hidden === true,
            html: html as string,
          }
        }),
      )

      const visiblePosts = posts
        .filter((p) => !p.hidden)
        .sort((a, b) => b.date.getTime() - a.date.getTime())

      const feed = new Feed({
        title: "kwajiehao's blog",
        description: 'Thoughts on engineering, AI, and things I find interesting.',
        id: SITE_URL,
        link: SITE_URL,
        language: 'en',
        copyright: `All rights reserved ${new Date().getFullYear()}, kwajiehao`,
        updated: visiblePosts[0]?.date || new Date(),
      })

      for (const post of visiblePosts) {
        feed.addItem({
          title: post.title,
          id: `${SITE_URL}/blog/${post.slug}`,
          link: `${SITE_URL}/blog/${post.slug}`,
          description: post.description,
          content: post.html,
          date: post.date,
        })
      }

      const outputPath = path.resolve(root, outDir, 'feed.xml')
      // The prerenderer may create feed.xml/ as a directory from crawling the RSS link
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).isDirectory()) {
        fs.rmSync(outputPath, { recursive: true })
      }
      fs.writeFileSync(outputPath, feed.rss2())
    },
  }
}
