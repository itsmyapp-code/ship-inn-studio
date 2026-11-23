import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
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

    let raw = item.coverImage || ''
    if (raw.startsWith('/')) {
      raw = `https://www.theshipinnporlockweir.co.uk${encodeURI(raw)}`
    }
    if (raw.match(/\.(mp4|mov|webm)(\?.*)?$/i)) {
      raw = ''
    }

    const isVideoReel = Boolean(item.videoUrl)

    // Render 1200x630 Facebook-ready OG card with Play button + optional baked Text Overlay for video reels
    if (isVideoReel) {
      const thumbSrc = raw || DEFAULT_IMAGE
      const overlayText = (item.overlayText || '').trim()
      const overlayPosition = item.overlayPosition || 'bottom'
      const overlayStyle = item.overlayStyle || 'brand'

      const overlayStyleMap: Record<string, Record<string, string | number>> = {
        brand: {
          backgroundColor: 'rgba(10, 25, 47, 0.9)',
          color: '#FCD34D',
          border: '3px solid rgba(251, 191, 36, 0.55)',
        },
        bold: {
          backgroundColor: 'rgba(0, 0, 0, 0.84)',
          color: '#FFFFFF',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
        clean: {
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          color: '#0F172A',
          border: '3px solid rgba(226, 232, 240, 0.9)',
        },
        orange: {
          backgroundColor: '#FF6B00',
          color: '#FFFFFF',
          border: '3px solid rgba(255, 255, 255, 0.35)',
        },
      }

      const overlayPositionStyle: Record<string, string | number> =
        overlayPosition === 'top'
          ? { top: '42px' }
          : overlayPosition === 'center'
          ? { top: '96px' }
          : { bottom: '42px' }

      const children: React.ReactNode[] = [
        React.createElement('img', {
          key: 'bg',
          src: thumbSrc,
          alt: '',
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            objectFit: 'cover',
            opacity: 0.35,
          },
        }),
        React.createElement('img', {
          key: 'main',
          src: thumbSrc,
          alt: item.title || 'The Ship Inn Reel',
          style: {
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          },
        }),
        React.createElement('div', {
          key: 'dim',
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            background: 'rgba(10, 25, 47, 0.25)',
            display: 'flex',
          },
        }),
        React.createElement(
          'div',
          {
            key: 'play',
            style: {
              position: 'absolute',
              width: '132px',
              height: '132px',
              borderRadius: '9999px',
              backgroundColor: '#FBBF24',
              border: '8px solid rgba(10, 25, 47, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.55)',
            },
          },
          React.createElement(
            'svg',
            {
              width: 60,
              height: 60,
              viewBox: '0 0 24 24',
              style: { marginLeft: '8px' },
            },
            React.createElement('path', {
              d: 'M8 5v14l11-7z',
              fill: '#0A192F',
            })
          )
        ),
      ]

      if (overlayText) {
        children.push(
          React.createElement(
            'div',
            {
              key: 'overlay-wrap',
              style: {
                position: 'absolute',
                left: '60px',
                right: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...overlayPositionStyle,
              },
            },
            React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 34px',
                  borderRadius: '20px',
                  fontSize: overlayText.length > 48 ? '32px' : '42px',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  maxWidth: '1040px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.48)',
                  ...(overlayStyleMap[overlayStyle] || overlayStyleMap.brand),
                },
              },
              overlayText
            )
          )
        )
      }

      const element = React.createElement(
        'div',
        {
          style: {
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#0A192F',
            overflow: 'hidden',
          },
        },
        ...children
      )

      const imgRes = new ImageResponse(element, {
        width: 1200,
        height: 630,
      })

      // Compress 1200x630 PNG (~1.2MB) to lightweight JPEG (~65KB) so WhatsApp (300KB limit), iMessage, and Facebook always render it
      try {
        const sharpMod = await import('sharp')
        const sharpFn = sharpMod.default || (sharpMod as any)
        const pngBuffer = Buffer.from(await imgRes.arrayBuffer())
        const jpegBuffer = await sharpFn(pngBuffer)
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer()

        return new NextResponse(new Uint8Array(jpegBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': String(jpegBuffer.length),
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        })
      } catch (compressErr) {
        console.warn('[demo-posh/image] JPEG compression fallback to PNG:', compressErr)
        return new ImageResponse(element, {
          width: 1200,
          height: 630,
          headers: {
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        })
      }
    }

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
      return NextResponse.redirect(raw)
    }

    return NextResponse.redirect(DEFAULT_IMAGE)
  } catch (err) {
    return NextResponse.redirect(DEFAULT_IMAGE)
  }
}

