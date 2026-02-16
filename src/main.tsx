// ABOUTME: Application entry point.
// ABOUTME: Hydrates the prerendered app or renders fresh.

import { hydrate, prerender as ssr } from 'preact-iso'
import { App } from './app.tsx'
import './index.css'

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app')!)
}

export async function prerender(data: Record<string, unknown>) {
  return await ssr(<App {...data} />)
}
