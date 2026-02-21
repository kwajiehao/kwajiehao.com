// ABOUTME: Filter and sort controls for the book library page.
// ABOUTME: Provides tag filtering (AND semantics), sorting, and result count.

interface BookFilterBarProps {
  allTags: string[]
  activeTags: Set<string>
  onTagToggle: (tag: string) => void
  onClearTags: () => void
  sortField: string
  onSortChange: (field: string) => void
  visibleCount: number
  totalCount: number
  searchQuery: string
  onSearchChange: (query: string) => void
}

const sortOptions = [
  { value: 'dateAdded', label: 'Recent' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'year', label: 'Year' },
]

export function BookFilterBar({
  allTags,
  activeTags,
  onTagToggle,
  onClearTags,
  sortField,
  onSortChange,
  visibleCount,
  totalCount,
  searchQuery,
  onSearchChange,
}: BookFilterBarProps) {
  const isFiltered = activeTags.size > 0 || searchQuery.trim().length > 0

  return (
    <div class="space-y-4">
      <input
        type="text"
        placeholder="Search by title, author..."
        value={searchQuery}
        onInput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
        class="w-full px-3 py-2 text-sm bg-transparent border border-[var(--color-border)] rounded text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] transition-colors"
      />
      <div class="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isActive = activeTags.has(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagToggle(tag)}
              class={`text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-code-bg)] text-[var(--color-accent)] hover:opacity-80'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>
      <div class="flex items-center justify-between text-xs text-[var(--color-muted)]">
        <div class="flex items-center gap-3">
          {isFiltered && (
            <>
              <span>
                {visibleCount} of {totalCount}
              </span>
              <button
                type="button"
                onClick={onClearTags}
                class="text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                Clear
              </button>
            </>
          )}
        </div>
        <div class="flex items-center gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSortChange(opt.value)}
              class={`transition-colors cursor-pointer ${
                sortField === opt.value
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
