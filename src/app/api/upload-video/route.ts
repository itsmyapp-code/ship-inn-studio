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
    // Check all environment variables related to Blob
    const blobEnvKeys = Object.keys(process.env).filter(k => k.toUpperCase().includes('BLOB') || k.toUpperCase().includes('STORAGE'))
    const token = process.env.BLOB_READ_WRITE_TOKEN || 
                  (blobEnvKeys.length > 0 ? process.env[blobEnvKeys.find(k => k.includes('TOKEN') || k.includes('READ_WRITE')) || ''] : undefined)

    if (token || process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, request.body, {
        access: 'public',
        addRandomSuffix: true,
        token: token || process.env.BLOB_READ_WRITE_TOKEN
      })
      return NextResponse.json({ success: true, url: blob.url })
    }

    return NextResponse.json({
      success: false,
      error: 'BLOB_READ_WRITE_TOKEN missing. Please connect a Blob Store in your Vercel Dashboard.',
      availableBlobKeys: blobEnvKeys
    }, { status: 500 })
  } catch (error: any) {
    console.error('Error uploading video to Vercel Blob:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

