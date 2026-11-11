import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getGitHubConfig } from '@/lib/testimonials'

export const dynamic = 'force-dynamic'

const DATA_FILE = path.join(process.cwd(), 'content', 'demo-posh-items.json')
const GH_FILE_PATH = 'content/demo-posh-items.json'

// 1. Read helper: tries GitHub in production (to avoid Vercel ephemeral filesystem wipe), falls back to local disk
async function readItems(): Promise<any[]> {
  try {
    const { token, owner, repo, branch } = await getGitHubConfig()
    if (token) {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${GH_FILE_PATH}?ref=${branch}`
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'The-Ship-Inn-Admin'
        },
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        if (data && data.content) {
          const raw = Buffer.from(data.content, 'base64').toString('utf8')
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) return parsed
        }
      }
    }
  } catch (err) {
    console.error('Error fetching demo-posh items from GitHub:', err)
  }

  // Fallback to local disk file
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

// 2. Write helper: writes to disk and commits to GitHub repo
async function writeItems(items: any[], commitMessage: string) {
  const contentJson = JSON.stringify(items, null, 2)

  // A. Save locally
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, contentJson, 'utf-8')
  } catch (err) {
    console.error('Failed to write demo-posh-items.json locally:', err)
  }

  // B. Commit to GitHub (persists permanently on Vercel and triggers redeploy)
  try {
    const { token, owner, repo, branch } = await getGitHubConfig()
    if (token) {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${GH_FILE_PATH}`
      let sha: string | undefined

      const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'The-Ship-Inn-Admin'
        },
        cache: 'no-store'
      })
      if (getRes.ok) {
        const fileData = await getRes.json()
        sha = fileData.sha
      }

      const contentBase64 = Buffer.from(contentJson, 'utf8').toString('base64')
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'The-Ship-Inn-Admin'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: contentBase64,
          branch,
          ...(sha ? { sha } : {})
        })
      })
      return true
    }
  } catch (err) {
    console.error('Failed to commit demo-posh-items.json to GitHub:', err)
  }

  return false
}

// GET /api/demo-posh
export async function GET() {
  const items = await readItems()
  return NextResponse.json({ success: true, items })
}

// POST /api/demo-posh (Create or Delete)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, item, id } = body

    let current = await readItems()

    if (action === 'delete') {
      const targetItem = current.find((i: any) => i.id === id)
      current = current.filter((i: any) => i.id !== id)
      await writeItems(current, `chore(posh): delete "${targetItem?.title || id}"`)
      return NextResponse.json({ success: true, items: current })
    }

    if (item && item.title) {
      current = [item, ...current]
      await writeItems(current, `feat(posh): publish "${item.title}"`)
      return NextResponse.json({ success: true, items: current })
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
