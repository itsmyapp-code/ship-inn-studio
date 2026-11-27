import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { list } from '@vercel/blob'
import PDFDocument from 'pdfkit'
// @ts-ignore
import Helvetica from 'pdfkit/standard-fonts/Helvetica'
// @ts-ignore
import HelveticaBold from 'pdfkit/standard-fonts/HelveticaBold'
// @ts-ignore
import TimesBold from 'pdfkit/standard-fonts/TimesBold'
// @ts-ignore
import TimesRoman from 'pdfkit/standard-fonts/TimesRoman'
import sharp from 'sharp'

try {
  const register = (PDFDocument as any).registerStdFonts || (PDFDocument as any).default?.registerStdFonts
  if (typeof register === 'function') {
    register(Helvetica, HelveticaBold, TimesBold, TimesRoman)
  }
} catch (e) {
  // Already registered or fallback
}

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

// Helper to strictly sanitize text to ASCII so standard PDF fonts never produce mojibake/corrupted characters
function safePdf(str: any): string {
  if (!str) return ''
  return String(str)
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '|') // bullets
    .replace(/[\u2018\u2019]/g, "'") // curly single quotes
    .replace(/[\u201C\u201D]/g, '"') // curly double quotes
    .replace(/[\u2013\u2014]/g, '-') // en/em dashes
    .replace(/[^\x20-\x7E]/g, '') // remove emojis, multibyte unicode
    .trim()
}

async function readLiveBands(): Promise<any[]> {
  const token = getBlobToken()
  let rawItems: any[] = []

  // 1. Try Vercel Blob first (real-time live data)
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

export async function GET() {
  try {
    const bands = await readLiveBands()

    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      autoFirstPage: true,
      info: {
        Title: 'ShipWreck Music Festival 2027 Lineup Guide',
        Author: 'The Ship Inn, Porlock Weir'
      }
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))

    const pageWidth = 595.28
    const pageHeight = 841.89

    // Dark nautical page background
    doc.rect(0, 0, pageWidth, pageHeight).fill('#05080f')

    // Gold decorative border
    doc
      .rect(20, 20, pageWidth - 40, pageHeight - 40)
      .lineWidth(2)
      .strokeColor('#d97706')
      .stroke()

    doc
      .rect(24, 24, pageWidth - 48, pageHeight - 48)
      .lineWidth(0.5)
      .strokeColor('#b45309')
      .stroke()

    // Header Logo (Converted dynamically with Sharp)
    const logoWebpPath = path.join(process.cwd(), 'public', 'images', 'the_ship_inn2.webp')
    if (fs.existsSync(logoWebpPath)) {
      try {
        const logoPngBuffer = await sharp(logoWebpPath).resize(150, 150).png().toBuffer()
        doc.image(logoPngBuffer, pageWidth / 2 - 24, 32, { width: 48, height: 48 })
      } catch (logoErr) {
        console.warn('Could not embed logo in PDF:', logoErr)
      }
    }

    // Header Typography (Strictly ASCII safe)
    let currentY = 90
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#f59e0b')
      .text('THE SHIP INN  |  PORLOCK WEIR QUAYSIDE', 30, currentY, {
        align: 'center',
        characterSpacing: 2
      })

    currentY += 16
    doc
      .font('Times-Bold')
      .fontSize(22)
      .fillColor('#fef3c7')
      .text('SHIPWRECK MUSIC FESTIVAL 2027', 30, currentY, {
        align: 'center'
      })

    currentY += 26
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#38bdf8')
      .text('Friday 4th - Sunday 6th June 2027', 30, currentY, {
        align: 'center'
      })

    currentY += 14
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#94a3b8')
      .text('Free Quayside Admission  |  3 Stages  |  Exmoor Ales & Porlock Bay Oysters', 30, currentY, {
        align: 'center'
      })

    currentY += 12
    // Divider line
    doc
      .moveTo(40, currentY)
      .lineTo(pageWidth - 40, currentY)
      .lineWidth(1)
      .strokeColor('#d97706')
      .stroke()

    currentY += 16

    // Separate bands by day
    const fridayBands = bands.filter((b) => b.day === 'Friday')
    const saturdayBands = bands.filter((b) => b.day === 'Saturday')
    const sundayBands = bands.filter((b) => b.day === 'Sunday')
    const tbcBands = bands.filter(
      (b) => b.day === 'TBC' || b.isTbc || (b.timeSlot || '').includes('TBC')
    )

    // Render 2 Columns of Schedule
    const colWidth = (pageWidth - 90) / 2
    const col1X = 38
    const col2X = 38 + colWidth + 14

    const renderDaySection = (x: number, y: number, title: string, sub: string, items: any[]) => {
      let curY = y

      // Section Header Banner
      doc.rect(x, curY, colWidth, 20).fill('#0f172a')
      doc.rect(x, curY, colWidth, 20).strokeColor('#d97706').lineWidth(0.5).stroke()

      doc
        .font('Times-Bold')
        .fontSize(11)
        .fillColor('#fbbf24')
        .text(safePdf(title), x + 8, curY + 4, { width: colWidth - 70 })

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor('#38bdf8')
        .text(safePdf(sub), x + colWidth - 65, curY + 5, { width: 55, align: 'right' })

      curY += 26

      if (items.length === 0) {
        doc
          .font('Helvetica-Oblique')
          .fontSize(8)
          .fillColor('#64748b')
          .text('Acts announced soon...', x + 8, curY)
        return curY + 20
      }

      for (const b of items) {
        // Band box
        doc.rect(x, curY, colWidth, 48).fill('#090e17')
        doc.rect(x, curY, colWidth, 48).strokeColor('#1e293b').lineWidth(0.5).stroke()

        // Band Name
        doc
          .font('Times-Bold')
          .fontSize(10.5)
          .fillColor('#ffffff')
          .text(safePdf(b.bandName), x + 8, curY + 5, { width: colWidth - 85 })

        if (b.isHeadline) {
          doc
            .font('Helvetica-Bold')
            .fontSize(6)
            .fillColor('#f59e0b')
            .text('[HEADLINE ACT]', x + 8, curY + 17)
        }

        // Time slot badge
        const cleanSlot = safePdf(b.timeSlot) || 'Schedule TBC'
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#fbbf24')
          .text(cleanSlot, x + colWidth - 110, curY + 5, {
            width: 102,
            align: 'right'
          })

        // Stage & Genre
        const cleanStage = safePdf(b.stage) || 'The Quay Stage'
        const cleanGenre = safePdf(b.genre) || 'Maritime Folk'
        doc
          .font('Helvetica')
          .fontSize(7)
          .fillColor('#94a3b8')
          .text(
            `${cleanStage}  |  ${cleanGenre}`,
            x + 8,
            curY + (b.isHeadline ? 26 : 19),
            { width: colWidth - 16 }
          )

        // Description preview
        const cleanDesc = safePdf(b.description)
        const shortDesc = cleanDesc.slice(0, 65) + (cleanDesc.length > 65 ? '...' : '')
        doc
          .font('Helvetica')
          .fontSize(6)
          .fillColor('#64748b')
          .text(shortDesc, x + 8, curY + 36, { width: colWidth - 16 })

        curY += 53
      }

      return curY
    }

    // Render Column 1: Friday & Saturday
    let y1 = currentY
    y1 = renderDaySection(col1X, y1, 'Friday Sessions', '4th June', fridayBands)
    y1 += 8
    y1 = renderDaySection(col1X, y1, 'Saturday Main Stage', '5th June', saturdayBands)

    // Render Column 2: Sunday & TBC Acts
    let y2 = currentY
    y2 = renderDaySection(col2X, y2, 'Sunday Quayside Finale', '6th June', sundayBands)
    y2 += 8
    y2 = renderDaySection(col2X, y2, 'Additional Acts & Sessions', 'TBC', tbcBands)

    // Bottom Hospitality Strip
    const footerY = 718

    doc.rect(38, footerY, pageWidth - 76, 52).fill('#0f172a')
    doc.rect(38, footerY, pageWidth - 76, 52).strokeColor('#d97706').lineWidth(0.5).stroke()

    const perkW = (pageWidth - 76) / 3

    // Perk 1
    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor('#fbbf24')
      .text('16 GUEST REAL ALES', 38 + 10, footerY + 8)
    doc
      .font('Helvetica')
      .fontSize(6.5)
      .fillColor('#cbd5e1')
      .text('Exmoor real ales and cloudy farmhouse ciders across indoor & outdoor quayside bars.', 38 + 10, footerY + 20, { width: perkW - 20 })

    // Perk 2
    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor('#fbbf24')
      .text('PORLOCK BAY OYSTERS', 38 + perkW + 10, footerY + 8)
    doc
      .font('Helvetica')
      .fontSize(6.5)
      .fillColor('#cbd5e1')
      .text('Freshly shucked local oysters and quayside spit-roasted Exmoor lamb served daily.', 38 + perkW + 10, footerY + 20, { width: perkW - 20 })

    // Perk 3
    doc
      .font('Helvetica-Bold')
      .fontSize(7.5)
      .fillColor('#fbbf24')
      .text('HIGH TIDE SESSIONS', 38 + perkW * 2 + 10, footerY + 8)
    doc
      .font('Helvetica')
      .fontSize(6.5)
      .fillColor('#cbd5e1')
      .text('Torchlit quayside acoustic sessions as high tide fills the harbour basin each evening.', 38 + perkW * 2 + 10, footerY + 20, { width: perkW - 20 })

    // Bottom Copyright & Live Stamp
    doc
      .font('Helvetica')
      .fontSize(6.5)
      .fillColor('#64748b')
      .text(
        `The Ship Inn, Porlock Weir, Somerset, TA24 8PB | Tel: 01643 863288 | www.theshipinnporlockweir.co.uk | Live Generated: ${new Date().toLocaleDateString('en-GB')}`,
        30,
        pageHeight - 34,
        { align: 'center' }
      )

    doc.end()

    await new Promise((resolve) => doc.on('end', resolve))
    const pdfBuffer = Buffer.concat(chunks)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="ShipWreck_Festival_Lineup_Guide.pdf"',
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (err: any) {
    console.error('Error generating live PDF:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
