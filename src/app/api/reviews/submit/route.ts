import { NextResponse } from 'next/server'
import {
  Testimonial,
  readTestimonials,
  writeTestimonials,
  saveReviewPhoto,
  StayType
} from '@/lib/testimonials'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      location,
      rating,
      stayType,
      reviewText,
      visitDate,
      photos = []
    } = body

    // 1. Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name.' },
        { status: 400 }
      )
    }

    const cleanText = (reviewText || '').trim()
    if (!cleanText || cleanText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: `Please write a review of at least 50 characters (currently ${cleanText.length} characters).`
        },
        { status: 400 }
      )
    }

    const numRating = Number(rating) || 5
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5 stars.' },
        { status: 400 }
      )
    }

    const validStayTypes: StayType[] = ['Dine', 'Stay', 'Drink & Fire', 'Walking / Dog Break']
    const cleanStayType: StayType = validStayTypes.includes(stayType) ? stayType : 'Stay'

    // 2. Process Photos (max 2)
    const savedPhotoPaths: string[] = []
    if (Array.isArray(photos) && photos.length > 0) {
      const selectedPhotos = photos.slice(0, 2)
      for (let i = 0; i < selectedPhotos.length; i++) {
        const item = selectedPhotos[i]
        const dataUrl = typeof item === 'string' ? item : item.dataUrl
        if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
          const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
            const base64Data = matches[2]
            const buffer = Buffer.from(base64Data, 'base64')
            const fileName =
              typeof item === 'object' && item.fileName
                ? item.fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')
                : `guest-${Date.now()}-${i + 1}.${ext}`

            const saved = await saveReviewPhoto(fileName, buffer)
            if (saved.path) {
              savedPhotoPaths.push(saved.path)
            }
          }
        }
      }
    }

    // 3. Create review record (status: 'pending' so it appears for moderation in Admin)
    const all = await readTestimonials()
    const newId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`

    const newReview: Testimonial = {
      id: newId,
      name: name.trim(),
      location: location ? location.trim() : undefined,
      rating: numRating,
      stayType: cleanStayType,
      stayOrVisitDate: visitDate ? visitDate.trim() : undefined,
      visitDate: visitDate ? visitDate.trim() : undefined,
      title: `${cleanStayType} Experience`,
      content: cleanText,
      reviewText: cleanText,
      photos: savedPhotoPaths,
      source: 'direct_submission',
      status: 'pending', // Draft / Pending moderation
      createdAt: new Date().toISOString(),
      verified: false,
      verifiedStay: false,
      featured: false
    }

    all.unshift(newReview)

    await writeTestimonials(
      all,
      `feat(testimonials): new guest review with ${savedPhotoPaths.length} photo(s) from ${newReview.name}`
    )

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Thank you! Your review has been submitted for moderation and will appear on the site once approved.'
    })
  } catch (error) {
    console.error('Error in /api/reviews/submit:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to submit review' },
      { status: 500 }
    )
  }
}

