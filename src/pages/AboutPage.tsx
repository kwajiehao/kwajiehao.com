// ABOUTME: Short bio and about section.
// ABOUTME: Static content page accessible from the nav.

import { Layout } from '../components/Layout.tsx'

export function AboutPage() {
  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-6">About me</h1>
        <div class="prose leading-relaxed space-y-4">
          <p>
            My corner of the internet to jot down reflections on AI, engineering, and life.
          </p>
          <p>
            Currently a Member of Technical Staff at <a href="https://app.reka.ai/chat" target="_blank" rel="noopener noreferrer" class="text-[var(--color-accent)] underline hover:opacity-80">Reka AI</a>.
          </p>
        </div>
      </section>
    </Layout>
  )
}
