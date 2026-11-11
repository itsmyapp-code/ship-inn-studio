export type StayType = 'Dine' | 'Stay' | 'Drink & Fire' | 'Walking / Dog Break'

export interface Testimonial {
  id: string
  name: string
  location?: string
  rating: number // 1 to 5
  stayType?: StayType
  stayOrVisitDate?: string
  visitDate?: string
  title?: string
  content: string
  reviewText?: string
  photos?: string[] // array of paths e.g. ["/images/testimonials/xyz.webp"]
  source?: 'google' | 'tripadvisor' | 'direct_submission' | 'in_person'
  status: 'pending' | 'published' | 'archived' | 'draft'
  createdAt: string
  publishedAt?: string
  verified?: boolean
  verifiedStay?: boolean
  featured?: boolean
}

// Pure helper functions safe for both Client and Server components
export function getReviewText(t: Testimonial): string {
  return t.reviewText || t.content || ''
}

export function isVerifiedGuest(t: Testimonial): boolean {
  return Boolean(t.verified || t.verifiedStay)
}

