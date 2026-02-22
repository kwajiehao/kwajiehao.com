// ABOUTME: Utility to generate responsive image attributes (srcSet) for R2-hosted images.
// ABOUTME: Produces variant URLs following the naming convention: filename-{width}.webp

const WIDTHS = [400, 800, 1200, 1600]
const R2_HOST = 'photos.kwajiehao.com'

interface ResponsiveImageAttrs {
  src: string
  srcSet?: string
}

export function getResponsiveImageAttrs(url: string): ResponsiveImageAttrs {
  if (!url.includes(R2_HOST)) {
    return { src: url }
  }

  const lastDotIndex = url.lastIndexOf('.')
  const base = url.substring(0, lastDotIndex)

  const srcSet = WIDTHS
    .map((w) => `${base}-${w}.webp ${w}w`)
    .join(', ')

  return { src: `${base}-400.webp`, srcSet }
}
