import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuthToken } from '@/lib/testimonials'

export const dynamic = 'force-dynamic'

// GET: Check if a GitHub token is configured (either in Vercel env or cookie)
export async function GET() {
  const token = await getAuthToken()
  return NextResponse.json({
    configured: Boolean(token),
    source: process.env.OST_GITHUB_TOKEN || process.env.GITHUB_TOKEN ? 'vercel_env' : token ? 'admin_cookie' : 'none'
  })
}

// POST: Save GitHub Personal Access Token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid GitHub token.' },
        { status: 400 }
      )
    }

    const trimmed = token.trim()

    // Test token validity with GitHub API
    const ghRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${trimmed}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'The-Ship-Inn-Admin'
      }
    })

    if (!ghRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub token. GitHub rejected the token with status ' + ghRes.status },
        { status: 400 }
      )
    }

    const userData = await ghRes.json()

    // Store in secure HTTP-only cookie for 1 year
    const cookieStore = await cookies()
    cookieStore.set('ship_github_token', trimmed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })

    return NextResponse.json({
      success: true,
      message: `Connected successfully to GitHub as "${userData.login}"! Live synchronization is active.`,
      user: userData.login
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to connect token' },
      { status: 500 }
    )
  }
}

// DELETE: Remove stored token cookie
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.set('ship_github_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    })
    return NextResponse.json({ success: true, message: 'Token removed.' })
  } catch (err) {
    return NextResponse.json({ success: false })
  }
}

