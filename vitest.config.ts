// ABOUTME: Vitest configuration for unit and component tests.
// ABOUTME: Uses jsdom for DOM simulation with Preact JSX support.

import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'plugins/**/*.test.ts'],
    globals: true,
  },
})
