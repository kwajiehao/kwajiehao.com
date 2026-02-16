// ABOUTME: Renders a single blog post with full HTML content.
// ABOUTME: Shows metadata, tags, and the rendered markdown.

import { useRoute } from 'preact-iso'
import { Layout } from '../components/Layout.tsx'
import { TagBadge } from '../components/TagBadge.tsx'
import posts from 'virtual:blog-posts'

export function PostPage() {
  const { params } = useRoute()
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    return (
      <Layout>
        <section class="py-12">
          <h1 class="text-3xl font-bold">Post not found</h1>
          <p class="mt-4 text-[var(--color-muted)]">
            <a href="/blog" class="text-[var(--color-accent)]">Back to blog</a>
          </p>
        </section>
      </Layout>
    )
  }

  // HTML is generated at build time from our own markdown files (trusted content)
  return (
    <Layout>
      <article class="py-12">
        <header class="mb-8">
          <h1 class="text-3xl font-bold mb-3">{post.title}</h1>
          <div class="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <time>{post.date}</time>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </header>
        <div class="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Layout>
  )
}
