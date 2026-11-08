import React from 'react'

export interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  pictureClassName?: string
  fill?: boolean
  priority?: boolean
}

/**
 * Derives the .avif primary and .webp fallback paths for local /images/ assets.
 */
export function getAvifAndWebpPaths(src?: string): { avifSrc: string; webpSrc: string } | null {
  if (!src || typeof src !== 'string') return null

  const [cleanPath, queryAndHash] = src.split(/(?=[?#])/)
  const suffix = queryAndHash || ''

  const normalized = cleanPath.replace(/^\/\//, '/').replace(/^\/public\/images\//, '/images/')

  const isLocalImage =
    normalized.startsWith('/images/') ||
    normalized.startsWith('images/')

  if (!isLocalImage) return null

  const match = normalized.match(/^(.*)\.(webp|avif|jpe?g|png|jfif)$/i)
  if (!match) return null

  const base = match[1].startsWith('/') ? match[1] : `/${match[1]}`
  return {
    avifSrc: `${base}.avif${suffix}`,
    webpSrc: `${base}.webp${suffix}`,
  }
}

/**
 * Renders a <picture> element with an AVIF primary source and WebP fallback
 * for all local /images/* assets. Supports Next/Image-style `fill` and `priority`
 * props as well as standard <img> props.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  pictureClassName = 'contents',
  fill,
  priority,
  loading,
  fetchPriority,
  sizes,
  ...rest
}: SmartImageProps) {
  const paths = getAvifAndWebpPaths(src)

  const combinedClassName = [
    fill ? 'absolute inset-0 w-full h-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const resolvedLoading = priority ? 'eager' : loading
  const resolvedFetchPriority = priority ? 'high' : fetchPriority

  if (!paths) {
    return (
      <img
        src={src}
        alt={alt}
        className={combinedClassName}
        loading={resolvedLoading}
        fetchPriority={resolvedFetchPriority}
        sizes={sizes}
        {...rest}
      />
    )
  }

  return (
    <picture className={pictureClassName}>
      <source srcSet={paths.avifSrc} type="image/avif" sizes={sizes} />
      <source srcSet={paths.webpSrc} type="image/webp" sizes={sizes} />
      <img
        src={paths.webpSrc}
        alt={alt}
        className={combinedClassName}
        loading={resolvedLoading}
        fetchPriority={resolvedFetchPriority}
        sizes={sizes}
        {...rest}
      />
    </picture>
  )
}

/**
 * Transforms <img> tags inside rendered Markdown HTML into <picture> elements
 * serving .avif with a .webp fallback.
 */
export function upgradeHtmlImagesToPicture(html: string): string {
  if (!html) return html
  return html.replace(/<img\s+([^>]*?)src=(["'])([^"']+)\2([^>]*?)>/gi, (fullMatch, before, quote, src, after) => {
    const paths = getAvifAndWebpPaths(src)
    if (!paths) return fullMatch
    return `<picture class="contents"><source srcset="${paths.avifSrc}" type="image/avif" /><source srcset="${paths.webpSrc}" type="image/webp" /><img ${before}src=${quote}${paths.webpSrc}${quote}${after}></picture>`
  })
}
