// ABOUTME: Individual photo collection page with gallery viewer.
// ABOUTME: Shows title, optional description, and horizontal-scroll gallery.

import { useRoute } from 'preact-iso'
import { Layout } from '../components/Layout.tsx'
import { PhotoGallery } from '../components/PhotoGallery.tsx'
import collections from 'virtual:photo-collections'

export function PhotoCollectionPage() {
  const { params } = useRoute()
  const slug = params.slug

  const visibleCollections = collections.filter((c) => !c.hidden)
  const collection = collections.find((c) => c.slug === slug)

  if (!collection) {
    return (
      <Layout maxWidth="narrow">
        <section class="py-12">
          <p class="text-[var(--color-muted)]">Collection not found.</p>
          <a href="/photos" class="text-[var(--color-accent)] hover:opacity-80 transition-opacity mt-4 inline-block">
            &larr; Back to photos
          </a>
        </section>
      </Layout>
    )
  }

  // Find prev/next among visible collections
  const currentIndex = visibleCollections.findIndex((c) => c.slug === slug)
  const prevCollection = currentIndex > 0 ? visibleCollections[currentIndex - 1] : null
  const nextCollection = currentIndex < visibleCollections.length - 1 ? visibleCollections[currentIndex + 1] : null

  return (
    <Layout maxWidth="narrow">
      <section class="py-12">
        <a href="/photos" class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
          &larr; Photos
        </a>
        <h1 class="text-2xl font-semibold mt-4 mb-2">{collection.title}</h1>
        <p class="text-sm text-[var(--color-muted)] mb-6">{collection.date}</p>

        {collection.html && (
          <div class="prose mb-8 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: collection.html }} />
        )}

        <PhotoGallery images={collection.images} layout={collection.layout} />

        {/* Prev/Next navigation */}
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-[var(--color-border)]">
          <div>
            {prevCollection && (
              <a href={`/photos/${prevCollection.slug}`} class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                &larr; {prevCollection.title}
              </a>
            )}
          </div>
          <div>
            {nextCollection && (
              <a href={`/photos/${nextCollection.slug}`} class="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                {nextCollection.title} &rarr;
              </a>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
