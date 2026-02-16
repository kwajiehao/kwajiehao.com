// ABOUTME: Landing page with brief intro and recent posts.
// ABOUTME: Shows the 5 most recent blog posts.

import { Layout } from '../components/Layout.tsx'
import { PostCard } from '../components/PostCard.tsx'
import posts from 'virtual:blog-posts'

export function HomePage() {
  const recentPosts = posts.slice(0, 5)

  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-2">Hi, I'm Jie Hao</h1>
        <p class="text-[var(--color-muted)] leading-relaxed mb-8">
          Welcome to my corner of the internet. I write about engineering, AI, and things I find interesting.
        </p>
        {recentPosts.length > 0 && (
          <>
            <h2 class="text-lg font-semibold mb-4">Recent Posts</h2>
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
            {posts.length > 5 && (
              <a href="/blog" class="inline-block mt-6 text-[var(--color-accent)] hover:opacity-80 transition-opacity">
                View all posts &rarr;
              </a>
            )}
          </>
        )}
      </section>
    </Layout>
  )
}
