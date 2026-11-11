'use client'

import React from 'react'
import Link from 'next/link'
import { Testimonial, getReviewText, isVerifiedGuest } from '@/lib/testimonials-types'

interface TestimonialStripProps {
  testimonials: Testimonial[]
  showLinkToReviews?: boolean
}

export default function TestimonialStrip({
  testimonials,
  showLinkToReviews = true
}: TestimonialStripProps) {
  // Only display published testimonials, take top 3
  const published = testimonials.filter((t) => t.status === 'published').slice(0, 3)

  if (published.length === 0) return null

  const averageRating = (
    testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / (testimonials.length || 1)
  ).toFixed(1)

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strip Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-yellow-100 text-yellow-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-200">
                Guest Reviews &amp; Stories
              </span>
              <div className="flex items-center text-amber-500 text-sm">
                {'★'.repeat(5)}
                <span className="text-slate-700 font-bold ml-1.5 text-xs">{averageRating} / 5</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Honest Words from Our Guests
            </h2>
          </div>

          {showLinkToReviews && (
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 transition group self-start md:self-auto"
            >
              <span>Read all guest reviews</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {published.map((rev) => {
            const verified = isVerifiedGuest(rev)
            const text = getReviewText(rev)
            const photo = rev.photos && rev.photos.length > 0 ? rev.photos[0] : null

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-amber-400 text-base">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= (rev.rating || 5) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    {verified && (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {rev.title && (
                    <h3 className="font-serif font-bold text-slate-900 text-base mb-2 line-clamp-1">
                      “{rev.title}”
                    </h3>
                  )}

                  <p className="text-slate-600 text-sm leading-relaxed font-light line-clamp-4 mb-4">
                    {text}
                  </p>

                  {photo && (
                    <div className="mb-4 rounded-xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200">
                      <img
                        src={photo}
                        alt={`Photo by ${rev.name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <span className="font-bold text-slate-900 block">{rev.name}</span>
                    {rev.location && <span>{rev.location}</span>}
                  </div>
                  {rev.stayType && (
                    <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                      {rev.stayType}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-sm text-slate-600">Stayed or dined with us recently?</span>
          <Link
            href="/review"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs"
          >
            Leave Your Review →
          </Link>
        </div>
      </div>
    </section>
  )
}

