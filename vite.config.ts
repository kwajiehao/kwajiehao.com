// ABOUTME: Vite configuration with Preact, Tailwind, and prerendering.
// ABOUTME: Enables SSG by crawling routes from the entry point.

import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import blogPosts from './plugins/blog-posts.ts'
import rssFeed from './plugins/rss-feed.ts'

export default defineConfig({
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: '#app',
      },
    }),
    tailwindcss(),
    blogPosts(),
    rssFeed(),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
