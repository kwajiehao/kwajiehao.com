// ABOUTME: CLI script to generate WebP variants of images at multiple widths and upload to R2.
// ABOUTME: Usage: npm run resize -- ./local-photos/collection-slug collection-slug

import sharp from 'sharp'
import { execSync } from 'child_process'
import { readdirSync, mkdtempSync, rmSync } from 'fs'
import { join, parse, extname } from 'path'
import { tmpdir } from 'os'

const WIDTHS = [400, 800, 1200, 1600]
const BUCKET = 'kwajiehao-blog'
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff'])

function usage(): never {
  console.error('Usage: npm run resize -- <image-dir> <collection-slug>')
  console.error('Example: npm run resize -- ./local-photos/life-in-color life-in-color')
  process.exit(1)
}

async function main() {
  const [imageDir, slug] = process.argv.slice(2)
  if (!imageDir || !slug) usage()

  const files = readdirSync(imageDir).filter((f) =>
    IMAGE_EXTENSIONS.has(extname(f).toLowerCase())
  )

  if (files.length === 0) {
    console.error(`No image files found in ${imageDir}`)
    process.exit(1)
  }

  console.log(`Found ${files.length} images in ${imageDir}`)
  console.log(`Collection slug: ${slug}`)
  console.log(`Target widths: ${WIDTHS.join(', ')}`)
  console.log()

  const results: { file: string; status: 'ok' | 'failed'; error?: string }[] = []

  for (const file of files) {
    const inputPath = join(imageDir, file)
    const { name } = parse(file)
    const tmpDir = mkdtempSync(join(tmpdir(), 'resize-'))

    try {
      // Upload original
      const r2OriginalKey = `${slug}/${file}`
      console.log(`Uploading original: ${r2OriginalKey}`)
      execSync(
        `npx wrangler r2 object put "${BUCKET}/${r2OriginalKey}" --file="${inputPath}" --remote`,
        { stdio: 'inherit' }
      )

      // Get original dimensions
      const metadata = await sharp(inputPath).metadata()
      const originalWidth = metadata.width ?? Infinity

      // Generate and upload WebP variants
      for (const width of WIDTHS) {
        if (width >= originalWidth) {
          console.log(`  Skipping ${width}w (original is ${originalWidth}px wide)`)
          continue
        }

        const variantName = `${name}-${width}.webp`
        const variantPath = join(tmpDir, variantName)
        const r2Key = `${slug}/${variantName}`

        console.log(`  Generating ${variantName}...`)
        await sharp(inputPath)
          .resize(width)
          .webp({ quality: 80 })
          .toFile(variantPath)

        console.log(`  Uploading: ${r2Key}`)
        execSync(
          `npx wrangler r2 object put "${BUCKET}/${r2Key}" --file="${variantPath}" --remote`,
          { stdio: 'inherit' }
        )
      }

      results.push({ file, status: 'ok' })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  ERROR processing ${file}: ${message}`)
      results.push({ file, status: 'failed', error: message })
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }

    console.log()
  }

  // Print summary
  console.log('=== Summary ===')
  const succeeded = results.filter((r) => r.status === 'ok')
  const failed = results.filter((r) => r.status === 'failed')
  console.log(`Succeeded: ${succeeded.length}/${results.length}`)
  if (failed.length > 0) {
    console.log(`Failed:`)
    for (const f of failed) {
      console.log(`  - ${f.file}: ${f.error}`)
    }
    process.exit(1)
  }
}

main()
