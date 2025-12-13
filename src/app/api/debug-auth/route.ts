import { NextResponse } from 'next/server'

// HARDCODED CREDENTIALS (The ones we are trying to use)
const CLIENT_ID = 'Ov23liJWu8geK8HsiyH0'
const CLIENT_SECRET = '01a1223c25936d38e8c03dcbd67bdb4477596dfc'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    // Step 1: Redirect to GitHub to get a code
    const redirectUri = `https://ship-inn-website.vercel.app/api/debug-auth`
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`
    return NextResponse.redirect(githubUrl)
  }

  // Step 2: Exchange code for token
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    return NextResponse.json({
      status: 'Debug Complete',
      credentials_valid: !tokenData.error,
      github_response: tokenData,
      sent_credentials: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET.substring(0, 5) + '...', // Hide full secret in output
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
