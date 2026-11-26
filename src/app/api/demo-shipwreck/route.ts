import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { put, list } from '@vercel/blob'

export const dynamic = 'force-dynamic'

const DATA_FILE = path.join(process.cwd(), 'content', 'demo-shipwreck-items.json')
const BLOB_FEED_KEY = 'shipwreck-feed.json'

function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const blobKeys = Object.keys(process.env).filter(
    (k) => k.toUpperCase().includes('BLOB') || k.toUpperCase().includes('STORAGE')
  )
  const tokenKey = blobKeys.find((k) => k.includes('TOKEN') || k.includes('READ_WRITE'))
  return tokenKey ? process.env[tokenKey] : undefined
}

async function readItems(): Promise<any[]> {
  const token = getBlobToken()
  let rawItems: any[] = []

  // 1. Try Vercel Blob first
  if (token) {
    try {
      const { blobs } = await list({ prefix: BLOB_FEED_KEY, token })
      const feedBlob = blobs.find((b) => b.pathname === BLOB_FEED_KEY)
      if (feedBlob && feedBlob.url) {
        const res = await fetch(`${feedBlob.url}?t=${Date.now()}`, { cache: 'no-store' })
        if (res.ok) {
          const items = await res.json()
          if (Array.isArray(items)) rawItems = items
        }
      }
    } catch (blobErr) {
      console.warn('Notice reading feed from Vercel Blob:', blobErr)
    }
  }

  // 2. Fallback to local disk file
  if (rawItems.length === 0) {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8')
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) rawItems = parsed
      }
    } catch (err) {
      console.error('Error reading demo-shipwreck-items.json locally:', err)
    }
  }

  return rawItems
}

async function writeItems(items: any[]): Promise<boolean> {
  const contentJson = JSON.stringify(items, null, 2)
  const token = getBlobToken()

  // Store in Vercel Blob
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
      console.error('Failed to write shipwreck feed to Vercel Blob:', blobErr.message || blobErr)
      throw blobErr
    }
  }

  // Fallback to local disk file
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, contentJson, 'utf-8')
    return true
  } catch (err: any) {
    console.error('Failed to write shipwreck feed locally:', err.message || err)
    return false
  }
}

export async function GET() {
  try {
    const items = await readItems()
    return NextResponse.json({
      success: true,
      items,
      count: items.length
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, item, id, bandName } = body
    const existing = await readItems()

    if (action === 'delete') {
      const targetId = id || item?.id
      const filtered = existing.filter((i) => i.id !== targetId)
      await writeItems(filtered)
      return NextResponse.json({ success: true, count: filtered.length })
    }

    if (action === 'reset') {
      const initialPath = path.join(process.cwd(), 'content', 'demo-shipwreck-items.json')
      if (fs.existsSync(initialPath)) {
        const raw = fs.readFileSync(initialPath, 'utf-8')
        const parsed = JSON.parse(raw)
        await writeItems(parsed)
        return NextResponse.json({ success: true, items: parsed })
      }
    }

    // Default: Add or update band item
    const newItem = item || {
      id: `band-${Date.now()}`,
      bandName: bandName || 'New Festival Artist',
      ...body
    }

    // Prepend or update
    const index = existing.findIndex((i) => i.id === newItem.id)
    let updated: any[]
    if (index >= 0) {
      updated = [...existing]
      updated[index] = { ...updated[index], ...newItem }
    } else {
      updated = [newItem, ...existing]
    }

    await writeItems(updated)
    return NextResponse.json({ success: true, item: newItem, count: updated.length })
  } catch (err: any) {
    console.error('Error handling demo-shipwreck POST:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
