// ABOUTME: Landing page with hero image.
// ABOUTME: Displays a hero image configured in site.yaml.

import { Layout } from '../components/Layout.tsx'
import siteConfig from 'virtual:site-config'

export function HomePage() {
  return (
    <Layout>
      <section class="py-12">
        <a href="/photos" class="block">
          <img
            src={siteConfig.heroImage}
            alt=""
            class="w-full max-h-[70vh] object-cover"
          />
        </a>
      </section>
    </Layout>
  )
}
