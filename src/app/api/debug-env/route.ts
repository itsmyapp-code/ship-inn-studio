import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const matchingKeys: Record<string, string> = {}
  for (const [k, v] of Object.entries(process.env)) {
    if (k.toLowerCase().includes('token') || k.toLowerCase().includes('github') || k.toLowerCase().includes('ost') || k.toLowerCase().includes('dst')) {
      matchingKeys[k] = v ? 'SET (' + v.substring(0, 6) + '... length: ' + v.length + ')' : 'EMPTY'
    }
  }

  return NextResponse.json({
    matchingKeys,
    OST_GITHUB_TOKEN: process.env.OST_GITHUB_TOKEN ? 'SET' : 'NOT SET',
    DST_GITHUB_TOKEN: process.env.DST_GITHUB_TOKEN ? 'SET' : 'NOT SET',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET',
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  })
}
