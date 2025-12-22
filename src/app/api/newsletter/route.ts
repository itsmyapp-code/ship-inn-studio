import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  try {
    const apiKey = process.env.MAILERLITE_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjZlNjEzNzUwZGE4Y2ZiNDgwMjA5ODYxMDUyZWIwYWI1OWI5ZjE2MzQ5N2NkZjk2MWI3NTk4YWZmNzRjYmU1NGU2MWRiNGEzNmFhYTM2ZTMiLCJpYXQiOjE3NjYzOTI0MTIuNDcyNzc2LCJuYmYiOjE3NjYzOTI0MTIuNDcyNzc4LCJleHAiOjQ5MjIwNjYwMTIuNDY4ODIyLCJzdWIiOiIxOTg1NDc4Iiwic2NvcGVzIjpbXX0.MCUARw2dDdcgWu6uDeg559iCPRPeipTd5BpYCLQAy4bnZvN2JofWECPfppvoDaYDnqbWLYZ2F8pBAKGre9y3pPCNuT0nE1fNujQkZvZSxzOfpDgKaUzTodr7IRHt9LBIMEPfxV__QnTgnKDbZ_TLD6asrxWcuWv2vXhcN-WS3D2eKjYKS7GzvUlt-5EAD35Fs3QtlctqLB77UeHQ8kvHmcvZzg1eEvV6tKW-0MCTbMnICn0jfdqcSNLUpMhhthmW0kK0ktVTl5FgSITL1GIN8L9q775GF3H9Yx_IwhvuY4OXgapnVGX8IEAg-QGvzDOghyTsbAKnKQb84lH9eIZ01ml4z2wJWsPBuXhb6xjgDuvlfqc7WlKOUUh32895-xfQffG6V5eePhOX9Drf-6wjW8TG1UOs4lRgYtZk2HFS596u8ykZMagW-DPK8_-VH1NLE0GqIMbbq5ozoP7p-HW8oiadPZpi6XCojWLs0okeMiL0BMJ__AsCbkLmpM-wXQA8SldjYCRL_sUMe0wyzSS5k8nbu0PBzc9f7tSe3d648OcAUAX9x1FKOKOOehC1pPFjtn11pIAOJv_W2IPj_F-pUCpkUCfrE79VL5GTpYAshTrVP9DO8KENlmK1xHbZkjvfPJoeDLGiXK1_NqNRd_iADuChr0mUO31BVAJRJY1kwHc'
    
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
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
