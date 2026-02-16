// ABOUTME: Summary card for a blog post shown on listing pages.
// ABOUTME: Displays title, date, reading time, tags, and description.

import type { Post } from '../types.ts'
import { TagBadge } from './TagBadge.tsx'

export function PostCard({ post }: { post: Post }) {
  return (
    <article class="py-6 border-b border-[var(--color-border)]">
      <a href={`/blog/${post.slug}`} class="block group">
        <h2 class="text-xl font-semibold group-hover:text-[var(--color-accent)] transition-colors">
          {post.title}
        </h2>
      </a>
      <div class="flex items-center gap-3 mt-2 text-sm text-[var(--color-muted)]">
        <time>{post.date}</time>
        <span>&middot;</span>
        <span>{post.readingTime} min read</span>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
      <p class="mt-3 text-[var(--color-muted)] leading-relaxed">{post.description}</p>
    </article>
  )
}
