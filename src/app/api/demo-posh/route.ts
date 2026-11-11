import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { put, list } from '@vercel/blob'

export const dynamic = 'force-dynamic'

const DATA_FILE = path.join(process.cwd(), 'content', 'demo-posh-items.json')
const BLOB_FEED_KEY = 'posh-feed.json'

// Helper to get Blob token if available
function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const blobKeys = Object.keys(process.env).filter(
    k => k.toUpperCase().includes('BLOB') || k.toUpperCase().includes('STORAGE')
  )
  const tokenKey = blobKeys.find(k => k.includes('TOKEN') || k.includes('READ_WRITE'))
  return tokenKey ? process.env[tokenKey] : undefined
}

// 1. Read items: Prioritizes Vercel Blob (instant, zero-builds), falls back to local disk
async function readItems(): Promise<any[]> {
  const token = getBlobToken()

  // Try Vercel Blob first
  if (token) {
    try {
      const { blobs } = await list({ prefix: BLOB_FEED_KEY, token })
      const feedBlob = blobs.find(b => b.pathname === BLOB_FEED_KEY)
      if (feedBlob && feedBlob.url) {
        const res = await fetch(`${feedBlob.url}?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const items = await res.json()
          if (Array.isArray(items)) return items
        }
      }
    } catch (blobErr) {
      console.warn('Notice reading feed from Vercel Blob:', blobErr)
    }
  }

  // Fallback to local disk file (bundled content or local development)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('Error reading demo-posh-items.json locally:', err)
  }

  return []
}

// 2. Write items: Saves directly into Vercel Blob without making Git commits (ZERO Vercel build minutes!)
async function writeItems(items: any[]): Promise<boolean> {
  const contentJson = JSON.stringify(items, null, 2)
  const token = getBlobToken()

  // Primary: Store directly in Vercel Blob Edge storage (instant, zero-rebuild)
  if (token) {
    try {
      await put(BLOB_FEED_KEY, contentJson, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        token
      })
      return true
    } catch (blobErr: any) {
      console.error('Failed to write feed to Vercel Blob:', blobErr.message || blobErr)
      throw blobErr
    }
  }

  // Secondary / Local: Write to local disk file
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, contentJson, 'utf-8')
    return true
  } catch (err: any) {
    console.error('Failed to write demo-posh-items.json locally:', err)
    throw err
  }
}

// GET /api/demo-posh
export async function GET() {
  const items = await readItems()
  return NextResponse.json({ success: true, items })
}

// POST /api/demo-posh (Create or Delete without triggering Git commits or Vercel rebuilds)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, item, id } = body

    let current = await readItems()

    if (action === 'delete') {
      current = current.filter((i: any) => i.id !== id)
      await writeItems(current)
      return NextResponse.json({ success: true, items: current })
    }

    if (item && item.title) {
      current = [item, ...current]
      await writeItems(current)
      return NextResponse.json({ success: true, items: current })
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
