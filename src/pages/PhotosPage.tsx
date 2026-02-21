// ABOUTME: Photo collections listing page.
// ABOUTME: Shows all non-hidden collections as a two-column image grid.

import { Layout } from '../components/Layout.tsx'
import collections from 'virtual:photo-collections'

export function PhotosPage() {
  const visibleCollections = collections.filter((c) => !c.hidden)

  return (
    <Layout maxWidth="narrow">
      <section class="py-12">
        <h1 class="text-2xl font-semibold mb-8">Photos</h1>
        {visibleCollections.length === 0 ? (
          <p class="text-[var(--color-muted)]">No collections yet.</p>
        ) : (
          <div class="columns-1 sm:columns-2 gap-4 sm:gap-6">
            {visibleCollections.map((collection) => (
              <a
                key={collection.slug}
                href={`/photos/${collection.slug}`}
                class="block mb-4 sm:mb-6 break-inside-avoid group"
              >
                <div class="overflow-hidden">
                  <img
                    src={collection.cover}
                    alt={collection.title}
                    loading="lazy"
                    class="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div class="mt-2">
                  <h2 class="text-sm font-medium">{collection.title}</h2>
                  <p class="text-xs text-[var(--color-muted)]">{collection.date}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
