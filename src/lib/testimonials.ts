import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { Outstatic } from 'outstatic'

export interface Testimonial {
  id: string
  name: string
  location?: string
  rating: number // 1 to 5
  stayOrVisitDate?: string
  title?: string
  content: string
  source: 'google' | 'tripadvisor' | 'direct_submission' | 'in_person'
  status: 'pending' | 'published' | 'archived'
  createdAt: string
  verifiedStay?: boolean
}

const TESTIMONIALS_FILE = path.join(process.cwd(), 'content', 'testimonials.json')

export async function getAuthToken(): Promise<string | undefined> {
  const envToken =
    process.env.OST_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.DST_GITHUB_TOKEN ||
    process.env.OST_TOKEN
  if (envToken && envToken.trim()) return envToken.trim()

  // Check admin-configured token cookie
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('ship_github_token')?.value
    if (adminToken && adminToken.trim()) {
      return adminToken.trim()
    }
  } catch (err) {
    // Non-request context
  }

  // Try Outstatic official session loader
  try {
    const ostData = await Outstatic()
    if (ostData?.session?.access_token) {
      return ostData.session.access_token
    }
  } catch (err) {
    // Fallback to cookie check if Outstatic() throws
  }

  try {
    const cookieStore = await cookies()
    const tokenName = process.env.NEXT_PUBLIC_OST_TOKEN_NAME || 'ost_token'
    const ostCookie = cookieStore.get(tokenName)?.value
    const secret = process.env.OST_TOKEN_SECRET || 'l1f3154n4dv3ntur3st4yS7r0n9s3cr3t'
    if (ostCookie && secret) {
      const { payload } = await jose.jwtVerify(ostCookie, new TextEncoder().encode(secret))
      if (payload && typeof payload.access_token === 'string') {
        return payload.access_token
      }
    }
  } catch (err) {
    // Cookie not found, not logged in, or signature mismatch
  }

  return undefined
}

// GitHub config helper mirroring gallery and menus
export async function getGitHubConfig() {
  const token = await getAuthToken()
  const owner = process.env.OST_REPO_OWNER || 'itsmyapp-code'
  const repo = process.env.OST_REPO_SLUG || 'ship-inn-studio'
  const branch = process.env.OST_REPO_BRANCH || 'main'
  return { token, owner, repo, branch }
}

export function readTestimonials(): Testimonial[] {
  try {
    if (!fs.existsSync(TESTIMONIALS_FILE)) {
      const dir = path.dirname(TESTIMONIALS_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(TESTIMONIALS_FILE, '[]', 'utf8')
      return []
    }
    const raw = fs.readFileSync(TESTIMONIALS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Error reading testimonials.json:', err)
    return []
  }
}

export function getTestimonials(filter?: {
  status?: 'published' | 'pending' | 'archived' | 'all'
}): Testimonial[] {
  const all = readTestimonials()
  const statusFilter = filter?.status || 'published'

  let filtered = all
  if (statusFilter !== 'all') {
    filtered = all.filter((t) => t.status === statusFilter)
  }

  // Sort newest first
  return filtered.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export async function writeTestimonials(
  testimonials: Testimonial[],
  commitMessage = 'chore(testimonials): update testimonials data'
): Promise<{ savedLocally: boolean; githubCommitted: boolean }> {
  let savedLocally = false
  let githubCommitted = false

  const contentJson = JSON.stringify(testimonials, null, 2)

  // 1. Save locally
  try {
    const dir = path.dirname(TESTIMONIALS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(TESTIMONIALS_FILE, contentJson, 'utf8')
    savedLocally = true
  } catch (err) {
    console.error('Failed to write testimonials locally:', err)
  }

  // 2. Commit to GitHub (for Vercel serverless production persistence)
  const { token, owner, repo, branch } = await getGitHubConfig()
  if (token) {
    try {
      const filePath = 'content/testimonials.json'
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`

      // Check if file already exists on GitHub to obtain its sha
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
      const putRes = await fetch(apiUrl, {
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

      githubCommitted = putRes.ok
      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}))
        console.error('GitHub API error during commit:', putRes.status, errJson)
      }
    } catch (ghErr) {
      console.error('Error committing testimonials.json to GitHub:', ghErr)
    }
  }

  return { savedLocally, githubCommitted }
}

