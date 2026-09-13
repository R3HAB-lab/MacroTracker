/**
 * Rasterises resources/*.svg into the PNG sources that `npx capacitor-assets
 * generate` and the web manifest need. Run it after editing any artwork:
 *
 *   node scripts/render-assets.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')

const renders = [
  // Store / native sources consumed by @capacitor/assets.
  { from: 'resources/icon.svg', to: 'resources/icon.png', size: 1024 },
  { from: 'resources/icon-foreground.svg', to: 'resources/icon-foreground.png', size: 1024 },
  { from: 'resources/icon-background.svg', to: 'resources/icon-background.png', size: 1024 },
  { from: 'resources/splash.svg', to: 'resources/splash.png', size: 2732 },
  { from: 'resources/splash.svg', to: 'resources/splash-dark.png', size: 2732 },
  // Web / PWA icons.
  { from: 'resources/icon.svg', to: 'public/icons/icon-192.png', size: 192 },
  { from: 'resources/icon.svg', to: 'public/icons/icon-512.png', size: 512 },
  { from: 'resources/icon-maskable.svg', to: 'public/icons/icon-maskable-512.png', size: 512 },
  { from: 'resources/icon.svg', to: 'public/apple-touch-icon.png', size: 180 },
]

for (const { from, to, size } of renders) {
  const source = await readFile(resolve(root, from))
  const target = resolve(root, to)
  await mkdir(dirname(target), { recursive: true })
  // `density` scales the SVG rasteriser so large outputs stay sharp.
  const png = await sharp(source, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await writeFile(target, png)
  console.log(`${to}  ${size}x${size}`)
}
