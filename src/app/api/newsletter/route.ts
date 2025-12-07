import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'MailerLite error', detail: text }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to contact MailerLite' }, { status: 500 })
  }
}
