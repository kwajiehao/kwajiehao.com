// ABOUTME: Shows all posts filtered by a specific tag.
// ABOUTME: Accessed via /tags/:tag routes.

import { useRoute } from 'preact-iso'
import { Layout } from '../components/Layout.tsx'
import { PostCard } from '../components/PostCard.tsx'
import tags from 'virtual:blog-tags'

export function TagPage() {
  const { params } = useRoute()
  const tag = params.tag
  const tagPosts = tags[tag] || []

  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-2">
          Tag: <span class="text-[var(--color-accent)]">{tag}</span>
        </h1>
        <p class="text-[var(--color-muted)] mb-8">
          {tagPosts.length} {tagPosts.length === 1 ? 'post' : 'posts'}
        </p>
        {tagPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        <a href="/tags" class="inline-block mt-6 text-[var(--color-accent)] hover:opacity-80 transition-opacity">
          &larr; All tags
        </a>
      </section>
    </Layout>
  )
}
