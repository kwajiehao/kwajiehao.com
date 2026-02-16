// ABOUTME: Lists all blog posts in reverse chronological order.
// ABOUTME: Shows post cards with tags and reading time.

import { Layout } from '../components/Layout.tsx'
import { PostCard } from '../components/PostCard.tsx'
import posts from 'virtual:blog-posts'

export function BlogListPage() {
  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-8">Blog</h1>
        {posts.length === 0 ? (
          <p class="text-[var(--color-muted)]">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </section>
    </Layout>
  )
}
