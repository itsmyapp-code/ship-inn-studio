import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'theshipinnta248pb!'

// GET: Check if current visitor has a valid admin session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ship_admin_auth')?.value
    const isAuthenticated = sessionCookie === 'authenticated'

    return NextResponse.json({ authenticated: isAuthenticated })
  } catch (err) {
    return NextResponse.json({ authenticated: false })
  }
}

// POST: Verify passcode and establish 30-day session
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { passcode } = body

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter the admin passcode.' },
        { status: 400 }
      )
    }

    if (passcode.trim() !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { success: false, error: 'Incorrect passcode. Please try again.' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('ship_admin_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return NextResponse.json({ success: true, message: 'Admin authenticated successfully.' })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Authentication error' },
      { status: 500 }
    )
  }
}

// DELETE: Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.set('ship_admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false })
  }
}

