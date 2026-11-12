import type { Metadata } from 'next'
import DemoPoshClient from './DemoPoshClient'
import { list } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const DEFAULT_TITLE = 'Events & Social Feed | The Ship Inn Porlock Weir'
const DEFAULT_DESC = 'Discover live music, seasonal menus, and harbour updates at The Ship Inn Porlock Weir.'
const DEFAULT_IMAGE = 'https://www.theshipinnporlockweir.co.uk/images/Ship%20-new-thatch.webp'

// Helper to get Blob token if available
function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const blobKeys = Object.keys(process.env).filter(
    (k) => k.toUpperCase().includes('BLOB') || k.toUpperCase().includes('STORAGE')
  )
  const tokenKey = blobKeys.find((k) => k.includes('TOKEN') || k.includes('READ_WRITE'))
  return tokenKey ? process.env[tokenKey] : undefined
}

async function getPostById(postId: string): Promise<any | null> {
  const token = getBlobToken()

  // 1. Check Vercel Blob feed
  if (token) {
    try {
      const { blobs } = await list({ prefix: 'posh-feed.json', token })
      const feedBlob = blobs.find((b) => b.pathname === 'posh-feed.json')
      if (feedBlob && feedBlob.url) {
        const res = await fetch(`${feedBlob.url}?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const items = await res.json()
          if (Array.isArray(items)) {
            const found = items.find((i: any) => i.id === postId)
            if (found) return found
          }
        }
      }
    } catch (e) {
      console.warn('Metadata: Failed to read blob feed:', e)
    }
  }

  // 2. Check local content file
  try {
    const dataFile = path.join(process.cwd(), 'content', 'demo-posh-items.json')
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8')
      const items = JSON.parse(content)
      if (Array.isArray(items)) {
        const found = items.find((i: any) => i.id === postId)
        if (found) return found
      }
    }
  } catch (err) {
    console.warn('Metadata: Failed to read local items:', err)
  }

  return null
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const postId =
    typeof params.post === 'string'
      ? params.post
      : typeof params.id === 'string'
      ? params.id
      : undefined

  if (!postId) {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESC,
      openGraph: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        url: 'https://www.theshipinnporlockweir.co.uk/demo-posh-7924',
        siteName: 'The Ship Inn Porlock Weir',
        images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630, alt: 'The Ship Inn Porlock Weir' }],
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [DEFAULT_IMAGE]
      }
    }
  }

  const post = await getPostById(postId)
  if (!post) {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESC,
      openGraph: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [{ url: DEFAULT_IMAGE }]
      }
    }
  }

  let imageUrl = post.coverImage || DEFAULT_IMAGE
  if (imageUrl.startsWith('/')) {
    imageUrl = `https://www.theshipinnporlockweir.co.uk${encodeURI(imageUrl)}`
  }

  const title = `${post.title} | The Ship Inn Porlock Weir`
  const description = post.excerpt || DEFAULT_DESC

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.theshipinnporlockweir.co.uk/demo-posh-7924?post=${post.id}`,
      siteName: 'The Ship Inn Porlock Weir',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  }
}

export default async function DemoPoshPage({ searchParams }: Props) {
  const params = await searchParams
  const postId =
    typeof params.post === 'string'
      ? params.post
      : typeof params.id === 'string'
      ? params.id
      : undefined
  return <DemoPoshClient initialPostId={postId} />
}
