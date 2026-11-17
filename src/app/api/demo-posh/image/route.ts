import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { list } from '@vercel/blob'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const DEFAULT_IMAGE = 'https://www.theshipinnporlockweir.co.uk/images/the_ship_inn2.webp'

function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const blobKeys = Object.keys(process.env).filter(
    (k) => k.toUpperCase().includes('BLOB') || k.toUpperCase().includes('STORAGE')
  )
  const tokenKey = blobKeys.find((k) => k.includes('TOKEN') || k.includes('READ_WRITE'))
  return tokenKey ? process.env[tokenKey] : undefined
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.redirect(DEFAULT_IMAGE)
    }

    let item: any = null
    const token = getBlobToken()
    if (token) {
      try {
        const { blobs } = await list({ prefix: 'posh-feed.json', token })
        const feedBlob = blobs.find((b) => b.pathname === 'posh-feed.json')
        if (feedBlob && feedBlob.url) {
          const res = await fetch(`${feedBlob.url}?t=${Date.now()}`, { cache: 'no-store' })
          if (res.ok) {
            const items = await res.json()
            if (Array.isArray(items)) {
              item = items.find((i: any) => i.id === id)
            }
          }
        }
      } catch (err) {
        console.warn('Image endpoint blob error:', err)
      }
    }

    if (!item) {
      try {
        const dataFile = path.join(process.cwd(), 'content', 'demo-posh-items.json')
        if (fs.existsSync(dataFile)) {
          const content = fs.readFileSync(dataFile, 'utf-8')
          const items = JSON.parse(content)
          if (Array.isArray(items)) {
            item = items.find((i: any) => i.id === id)
          }
        }
      } catch (e) {}
    }

    if (!item) {
      return NextResponse.redirect(DEFAULT_IMAGE)
    }

    const raw = item.coverImage || ''
    if (!raw) {
      return NextResponse.redirect(DEFAULT_IMAGE)
    }

    // Base64 extracted video thumbnail or photo data URL
    if (raw.startsWith('data:image')) {
      const match = raw.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        const contentType = match[1]
        const buffer = Buffer.from(match[2], 'base64')
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    }

    // Direct HTTP/HTTPS URL
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      if (raw.match(/\.(mp4|mov|webm)(\?.*)?$/i)) {
        return NextResponse.redirect(DEFAULT_IMAGE)
      }
      return NextResponse.redirect(raw)
    }

    // Relative path
    if (raw.startsWith('/')) {
      return NextResponse.redirect(`https://www.theshipinnporlockweir.co.uk${raw}`)
    }

    return NextResponse.redirect(DEFAULT_IMAGE)
  } catch (err) {
    return NextResponse.redirect(DEFAULT_IMAGE)
  }
}

