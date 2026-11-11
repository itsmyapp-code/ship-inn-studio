'use client'

import React, { useState, useEffect } from 'react'
import { Testimonial } from '@/lib/testimonials-types'
import TestimonialCard from './TestimonialCard'
import ReviewSubmissionModal from './ReviewSubmissionModal'

interface TestimonialsSectionProps {
  initialTestimonials?: Testimonial[]
  title?: string
  subtitle?: string
  badgeText?: string
  showSubmissionButton?: boolean
}

export default function TestimonialsSection({
  initialTestimonials = [],
  title = 'What Our Guests Say',
  subtitle = 'Honest words from visitors, locals, and travellers resting their sea legs at The Ship Inn Porlock Weir.',
  badgeText = 'Guest Experiences & Reviews',
  showSubmissionButton = true
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Revalidate reviews on mount
  useEffect(() => {
    refreshReviews()
  }, [])

  // Calculate average rating
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length
        ).toFixed(1)
      : '5.0'

  const refreshReviews = async () => {
    try {
      const res = await fetch('/api/testimonials?status=published')
      if (res.ok) {
        const data = await res.json()
        if (data.items) {
          setTestimonials(data.items)
        }
      }
    } catch (err) {
      console.error('Error refreshing reviews:', err)
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            {badgeText && (
              <span className="inline-block bg-yellow-100 text-yellow-900 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3 border border-yellow-200">
                {badgeText}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3">{subtitle}</p>
          </div>

          {/* Right Meta Stats & Review Submission CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
            {/* Rating Pill */}
            {testimonials.length > 0 && (
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-5 h-5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900 text-sm">{averageRating}</span> / 5.0 (
                  {testimonials.length} reviews)
                </div>
              </div>
            )}

            {/* Leave a Review Trigger Button */}
            {showSubmissionButton && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-ship-blue-600 hover:bg-ship-blue-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-sm hover:shadow transition inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Leave a Review</span>
              </button>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No reviews published yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Modal Popup for Public Review Submission */}
        <ReviewSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={refreshReviews}
        />
      </div>
    </section>
  )
}

