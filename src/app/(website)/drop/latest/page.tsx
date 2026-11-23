import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { list } from '@vercel/blob'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const blobKeys = Object.keys(process.env).filter(
    (k) => k.toUpperCase().includes('BLOB') || k.toUpperCase().includes('STORAGE')
  )
  const tokenKey = blobKeys.find((k) => k.includes('TOKEN') || k.includes('READ_WRITE'))
  return tokenKey ? process.env[tokenKey] : undefined
}

async function getLatestPostId(): Promise<string | null> {
  const token = getBlobToken()
  if (token) {
    try {
      const { blobs } = await list({ prefix: 'posh-feed.json', token })
      const feedBlob = blobs.find((b) => b.pathname === 'posh-feed.json')
      if (feedBlob && feedBlob.url) {
        const res = await fetch(`${feedBlob.url}?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const items = await res.json()
          if (Array.isArray(items) && items.length > 0 && items[0]?.id) {
            return items[0].id
          }
        }
      }
    } catch {}
  }

  try {
    const dataFile = path.join(process.cwd(), 'content', 'demo-posh-items.json')
    if (fs.existsSync(dataFile)) {
      const items = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
      if (Array.isArray(items) && items.length > 0 && items[0]?.id) {
        return items[0].id
      }
    }
  } catch {}

  return null
}

export default async function LatestShipInnDropPage() {
  const latestId = await getLatestPostId()
  if (latestId) {
    redirect(`/demo-posh-7924?post=${encodeURIComponent(latestId)}`)
  }
  redirect('/demo-posh-7924')
}
