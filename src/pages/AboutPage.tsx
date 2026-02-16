// ABOUTME: Short bio and about section.
// ABOUTME: Static content page accessible from the nav.

import { Layout } from '../components/Layout.tsx'

export function AboutPage() {
  return (
    <Layout>
      <section class="py-12">
        <h1 class="text-3xl font-bold mb-6">About</h1>
        <div class="prose leading-relaxed space-y-4">
          <p>
            Hi, I'm Jie Hao. I'm a software engineer interested in AI, systems, and building things that work.
          </p>
          <p>
            This blog is where I share thoughts on engineering, AI, and whatever else catches my attention.
          </p>
        </div>
      </section>
    </Layout>
  )
}
