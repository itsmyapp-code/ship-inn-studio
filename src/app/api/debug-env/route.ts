import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const cookieNames = cookieStore.getAll().map(c => c.name)

  const matchingKeys: Record<string, string> = {}
  for (const [k, v] of Object.entries(process.env)) {
    if (k.toLowerCase().includes('token') || k.toLowerCase().includes('github') || k.toLowerCase().includes('ost') || k.toLowerCase().includes('dst')) {
      matchingKeys[k] = v ? 'SET (' + v.substring(0, 6) + '... length: ' + v.length + ')' : 'EMPTY'
    }
  }

  return NextResponse.json({
    cookieNames,
    matchingKeys,
    allEnvKeys: Object.keys(process.env).sort(),
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_PROJECT_NAME: process.env.VERCEL_PROJECT_NAME,
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    OST_GITHUB_TOKEN: process.env.OST_GITHUB_TOKEN ? 'SET' : 'NOT SET',
    DST_GITHUB_TOKEN: process.env.DST_GITHUB_TOKEN ? 'SET' : 'NOT SET',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'SET' : 'NOT SET',
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  })
}
