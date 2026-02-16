// ABOUTME: Clickable tag pill that links to the tag's filtered post list.
// ABOUTME: Used on post cards and post pages.

export function TagBadge({ tag }: { tag: string }) {
  return (
    <a
      href={`/tags/${tag}`}
      class="inline-block text-xs px-2 py-0.5 rounded-full bg-[var(--color-code-bg)] text-[var(--color-accent)] hover:opacity-80 transition-opacity"
    >
      {tag}
    </a>
  )
}
