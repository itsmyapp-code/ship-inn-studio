import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_FILE = path.join(process.cwd(), 'content', 'demo-posh-items.json')

function readItems() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (err) {
    console.error('Error reading demo-posh-items.json:', err)
  }
  return []
}

function writeItems(items: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Error writing demo-posh-items.json:', err)
    return false
  }
}

// GET /api/demo-posh
export async function GET() {
  const items = readItems()
  return NextResponse.json({ success: true, items })
}

// POST /api/demo-posh (Create or Delete)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, item, id } = body

    let current = readItems()

    if (action === 'delete') {
      current = current.filter((i: any) => i.id !== id)
      writeItems(current)
      return NextResponse.json({ success: true, items: current })
    }

    if (item && item.title) {
      // Add new item to the top
      current = [item, ...current]
      writeItems(current)
      return NextResponse.json({ success: true, items: current })
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

