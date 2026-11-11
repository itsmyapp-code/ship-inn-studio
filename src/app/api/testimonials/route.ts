import { NextResponse } from 'next/server'
import {
  Testimonial,
  readTestimonials,
  getTestimonials,
  writeTestimonials,
  getAuthToken
} from '@/lib/testimonials'

export const dynamic = 'force-dynamic'

// GET /api/testimonials?status=(published|pending|archived|all)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = (searchParams.get('status') || 'published') as 'published' | 'pending' | 'archived' | 'all'
    const items = await getTestimonials({ status: statusParam })

    // Check if the current requester is authorized to edit live site
    const token = await getAuthToken()

    // Provide stats for the admin manager
    const all = await readTestimonials()
    const stats = {
      total: all.length,
      published: all.filter((t) => t.status === 'published').length,
      pending: all.filter((t) => t.status === 'pending').length,
      archived: all.filter((t) => t.status === 'archived').length,
      averageRating:
        all.length > 0
          ? Number((all.reduce((acc, curr) => acc + (curr.rating || 5), 0) / all.length).toFixed(1))
          : 5.0
    }

    return NextResponse.json({ success: true, items, stats, authorized: Boolean(token) })
  } catch (error) {
    console.error('Error in GET /api/testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve testimonials' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials
// Public review submission (pending) OR admin creation (published)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      location,
      rating,
      stayOrVisitDate,
      title,
      content,
      source = 'direct_submission',
      status = 'pending',
      verifiedStay = false
    } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your name.' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your review comments.' },
        { status: 400 }
      )
    }

    const numericRating = Number(rating) || 5
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5 stars.' },
        { status: 400 }
      )
    }

    const all = await readTestimonials()
    const newId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`

    const newTestimonial: Testimonial = {
      id: newId,
      name: name.trim(),
      location: location?.trim() || undefined,
      rating: numericRating,
      stayOrVisitDate: stayOrVisitDate?.trim() || undefined,
      title: title?.trim() || undefined,
      content: content.trim(),
      source: ['google', 'tripadvisor', 'direct_submission', 'in_person'].includes(source)
        ? source
        : 'direct_submission',
      status: ['published', 'pending', 'archived'].includes(status) ? status : 'pending',
      createdAt: new Date().toISOString(),
      verifiedStay: Boolean(verifiedStay)
    }

    all.unshift(newTestimonial)

    const commitMsg =
      newTestimonial.status === 'published'
        ? `feat(testimonials): add review from ${newTestimonial.name}`
        : `feat(testimonials): new pending review from ${newTestimonial.name}`

    const syncRes = await writeTestimonials(all, commitMsg)

    if (!syncRes.savedLocally && !syncRes.githubCommitted) {
      return NextResponse.json(
        {
          success: false,
          error:
            syncRes.error ||
            'Review saved in session, but could not commit live to GitHub. Please click "Setup GitHub Sync" in the top bar to connect your GitHub token.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      testimonial: newTestimonial,
      savedLocally: syncRes.savedLocally,
      githubCommitted: syncRes.githubCommitted,
      message:
        newTestimonial.status === 'pending'
          ? 'Thank you! Your review has been submitted and will appear on the site once approved by our team.'
          : `Review from ${newTestimonial.name} published successfully.`
    })
  } catch (error) {
    console.error('Error in POST /api/testimonials:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save review' },
      { status: 500 }
    )
  }
}

// PATCH /api/testimonials
// Update review status (approve, archive, publish), rating, or content
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      status,
      rating,
      title,
      content,
      name,
      location,
      stayOrVisitDate,
      verifiedStay,
      photos,
      stayType
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required.' },
        { status: 400 }
      )
    }

    const all = await readTestimonials()
    const index = all.findIndex((t) => t.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found.' },
        { status: 404 }
      )
    }

    const current = all[index]

    if (status !== undefined) {
      current.status = status
    }
    if (rating !== undefined) {
      current.rating = Number(rating)
    }
    if (title !== undefined) {
      current.title = title.trim()
    }
    if (content !== undefined) {
      current.content = content.trim()
      current.reviewText = content.trim()
    }
    if (name !== undefined) {
      current.name = name.trim()
    }
    if (location !== undefined) {
      current.location = location.trim()
    }
    if (stayOrVisitDate !== undefined) {
      current.stayOrVisitDate = stayOrVisitDate.trim()
    }
    if (verifiedStay !== undefined) {
      current.verifiedStay = Boolean(verifiedStay)
    }
    if (photos !== undefined && Array.isArray(photos)) {
      current.photos = photos
    }
    if (stayType !== undefined) {
      current.stayType = stayType
    }

    all[index] = current

    const syncRes = await writeTestimonials(
      all,
      `chore(testimonials): update review ${id} (${current.status})`
    )

    if (!syncRes.savedLocally && !syncRes.githubCommitted) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Review updated, but could not commit live to GitHub. Please click "Setup GitHub Sync" in the top bar to connect your GitHub token.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      testimonial: current,
      savedLocally: syncRes.savedLocally,
      githubCommitted: syncRes.githubCommitted,
      message: `Review updated successfully.`
    })
  } catch (error) {
    console.error('Error in PATCH /api/testimonials:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials?id=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required.' },
        { status: 400 }
      )
    }

    const all = await readTestimonials()
    const filtered = all.filter((t) => t.id !== id)

    if (filtered.length === all.length) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found.' },
        { status: 404 }
      )
    }

    const syncRes = await writeTestimonials(
      filtered,
      `chore(testimonials): delete review ${id}`
    )

    if (!syncRes.savedLocally && !syncRes.githubCommitted) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Review removed from list, but could not commit live to GitHub. Please click "Setup GitHub Sync" in the top bar to connect your GitHub token.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      savedLocally: syncRes.savedLocally,
      githubCommitted: syncRes.githubCommitted,
      message: 'Review deleted successfully.'
    })
  } catch (error) {
    console.error('Error in DELETE /api/testimonials:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete review' },
      { status: 500 }
    )
  }
}

