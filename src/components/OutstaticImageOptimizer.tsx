'use client'

import { useEffect } from 'react'

const MAX_WIDTH = 2000
const WEBP_QUALITY = 0.85

async function convertFileToWebp(file: File): Promise<File> {
  // Skip non-images, SVGs, GIFs, or already-WebP files
  if (
    !file.type.startsWith('image/') ||
    file.type === 'image/webp' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file
  }

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let width = img.naturalWidth || img.width
      let height = img.naturalHeight || img.height

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          const webpName = file.name.replace(/\.[^.]+$/, '') + '.webp'
          const converted = new File([blob], webpName, {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(converted)
        },
        'image/webp',
        WEBP_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}

/**
 * Intercepts file uploads inside the Outstatic CMS UI in the capture phase
 * and automatically converts uploaded .jpg/.jpeg/.png/.jfif photos to .webp
 * before Outstatic commits them to GitHub. (The build-time `prebuild` script
 * then generates the matching .avif companion automatically.)
 */
export default function OutstaticImageOptimizer() {
  useEffect(() => {
    const handleFileChange = async (event: Event) => {
      const target = event.target as HTMLInputElement | null
      if (!target || target.tagName !== 'INPUT' || target.type !== 'file') return

      if (target.dataset.webpConverted === 'true') {
        delete target.dataset.webpConverted
        return
      }

      const files = target.files
      if (!files || files.length === 0) return

      const needsConversion = Array.from(files).some(
        (f) =>
          f.type.startsWith('image/') &&
          f.type !== 'image/webp' &&
          f.type !== 'image/svg+xml' &&
          f.type !== 'image/gif'
      )

      if (!needsConversion) return

      // Pause Outstatic's React onChange until conversion completes
      event.stopImmediatePropagation()

      try {
        const convertedFiles = await Promise.all(
          Array.from(files).map((file) => convertFileToWebp(file))
        )

        const dataTransfer = new DataTransfer()
        convertedFiles.forEach((f) => dataTransfer.items.add(f))

        target.files = dataTransfer.files
        target.dataset.webpConverted = 'true'

        // Re-dispatch change event so Outstatic receives the .webp File
        target.dispatchEvent(new Event('change', { bubbles: true }))
      } catch (err) {
        console.error('Outstatic auto-WebP conversion fallback:', err)
        target.dataset.webpConverted = 'true'
        target.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    document.addEventListener('change', handleFileChange, true)
    return () => {
      document.removeEventListener('change', handleFileChange, true)
    }
  }, [])

  return null
}

