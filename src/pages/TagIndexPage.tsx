// ABOUTME: Displays all tags with their post counts.
// ABOUTME: Each tag links to a filtered view of posts with that tag.

import { Layout } from '../components/Layout.tsx'
import tags from 'virtual:blog-tags'

export function TagIndexPage() {
  const sortedTags = Object.entries(tags).sort((a, b) => b[1].length - a[1].length)

  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-8">Tags</h1>
        {sortedTags.length === 0 ? (
          <p class="text-[var(--color-muted)]">No tags yet.</p>
        ) : (
          <div class="flex flex-wrap gap-3">
            {sortedTags.map(([tag, tagPosts]) => (
              <a
                key={tag}
                href={`/tags/${tag}`}
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-code-bg)] text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                <span>{tag}</span>
                <span class="text-xs text-[var(--color-muted)]">({tagPosts.length})</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
