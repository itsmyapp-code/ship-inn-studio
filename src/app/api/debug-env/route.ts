import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    OST_GITHUB_ID: process.env.OST_GITHUB_ID ? 'SET (' + process.env.OST_GITHUB_ID.substring(0, 8) + '...)' : 'NOT SET',
    OST_GITHUB_SECRET: process.env.OST_GITHUB_SECRET ? 'SET (' + process.env.OST_GITHUB_SECRET.substring(0, 8) + '...)' : 'NOT SET',
    OST_REPO_SLUG: process.env.OST_REPO_SLUG || 'NOT SET',
    OST_REPO_OWNER: process.env.OST_REPO_OWNER || 'NOT SET',
    OST_TOKEN_SECRET: process.env.OST_TOKEN_SECRET ? 'SET' : 'NOT SET',
    VERCEL_GIT_REPO_SLUG: process.env.VERCEL_GIT_REPO_SLUG || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  })
}
