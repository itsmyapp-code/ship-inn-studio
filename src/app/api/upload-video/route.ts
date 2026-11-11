import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get('content-type') || ''

  // 1. Client Direct Upload Authorization (Bypasses the 4.5MB Vercel Serverless payload limit!)
  // Allows camera roll videos up to 500MB to stream directly from phone to Vercel Blob CDN.
  if (contentType.includes('application/json')) {
    try {
      const body = (await request.json()) as HandleUploadBody
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => {
          return {
            allowedContentTypes: [
              'video/mp4',
              'video/quicktime',
              'video/webm',
              'video/x-m4v',
              'image/jpeg',
              'image/png',
              'image/webp'
            ],
            addRandomSuffix: true,
            allowOverwrite: true,
            tokenPayload: JSON.stringify({})
          }
        },
        onUploadCompleted: async () => {}
      })
      return NextResponse.json(jsonResponse)
    } catch (error: any) {
      console.error('Error in handleUpload:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }

  // 2. Direct binary fallback for small files
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename') || `video-${Date.now()}.mp4`

  if (!request.body) {
    return NextResponse.json({ error: 'No video stream provided' }, { status: 400 })
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true
    })
    return NextResponse.json({ success: true, url: blob.url })
  } catch (error: any) {
    console.error('Error uploading video to Vercel Blob:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
