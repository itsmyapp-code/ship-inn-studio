import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    HAS_CLIENT_ID: !!process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    HAS_CLIENT_SECRET: !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    HAS_SECRET: !!process.env.KEYSTATIC_SECRET,
    HAS_PROJECT: !!process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT,
  })
}
