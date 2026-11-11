/**
 * Client-Side Image Compression Utility
 * - Accepts any File input (JPEG, PNG, HEIC, WebP, etc.)
 * - Resizes image down to max 1600px while maintaining aspect ratio
 * - Re-encodes on HTML5 Canvas to image/webp at 0.80 quality
 * - Automatically strips all camera, lens, and GPS EXIF metadata
 * - Enforces a maximum compressed size of 350KB
 */

export interface CompressionResult {
  file: File
  dataUrl: string
  blob: Blob
  sizeKB: number
  width: number
  height: number
  fileName: string
}

export interface CompressionOptions {
  maxWidthOrHeight?: number
  quality?: number
  maxSizeKB?: number
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidthOrHeight = 1600,
    quality = 0.8,
    maxSizeKB = 350
  } = options

  // Validate input type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files (JPEG, PNG, HEIC, WebP) are supported.')
  }

  // Load file into an HTML Image element
  const img = await loadImage(file)

  // Calculate scaled dimensions
  let { width, height } = img
  if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
    if (width > height) {
      height = Math.round((height * maxWidthOrHeight) / width)
      width = maxWidthOrHeight
    } else {
      width = Math.round((width * maxWidthOrHeight) / height)
      height = maxWidthOrHeight
    }
  }

  // Render to canvas to re-encode and strip EXIF
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { alpha: true })

  if (!ctx) {
    throw new Error('Unable to create canvas rendering context.')
  }

  // High quality image smoothing
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  // Export as WebP
  let currentQuality = quality
  let blob: Blob = await canvasToBlob(canvas, 'image/webp', currentQuality)

  // Iterative quality step-down if file exceeds maxSizeKB
  while (blob.size / 1024 > maxSizeKB && currentQuality > 0.4) {
    currentQuality -= 0.1
    blob = await canvasToBlob(canvas, 'image/webp', currentQuality)
  }

  const sizeKB = Math.round(blob.size / 1024)
  if (sizeKB > maxSizeKB) {
    throw new Error(
      `Photo is ${sizeKB}KB after compression, which exceeds the ${maxSizeKB}KB limit. Please choose a slightly smaller photo.`
    )
  }

  // Generate safe filename
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .substring(0, 30)
  const timestamp = Date.now().toString(36)
  const finalFileName = `review-${cleanBaseName}-${timestamp}.webp`

  const compressedFile = new File([blob], finalFileName, { type: 'image/webp' })
  const dataUrl = canvas.toDataURL('image/webp', currentQuality)

  return {
    file: compressedFile,
    dataUrl,
    blob,
    sizeKB,
    width,
    height,
    fileName: finalFileName
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image file.'))
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result
      } else {
        reject(new Error('Failed to read image as data URL.'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading selected file.'))
    reader.readAsDataURL(file)
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas export to blob failed.'))
        }
      },
      mimeType,
      quality
    )
  })
}

