import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename') || `video-${Date.now()}.mp4`

  if (!request.body) {
    return NextResponse.json({ error: 'No video stream provided' }, { status: 400 })
  }

  try {
    // If BLOB_READ_WRITE_TOKEN is configured in Vercel environment variables, use native Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, request.body, {
        access: 'public',
        addRandomSuffix: true
      })
      return NextResponse.json({ success: true, url: blob.url })
    }

    // Fallback if token not yet added in Vercel project settings:
    // Inform caller with a helpful tip
    return NextResponse.json({
      success: false,
      error: 'BLOB_READ_WRITE_TOKEN missing. Please connect a Blob Store in your Vercel Dashboard.'
    }, { status: 500 })
  } catch (error: any) {
    console.error('Error uploading video to Vercel Blob:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

