'use client'

import React, { useState } from 'react'
import { Testimonial, StayType, getReviewText, isVerifiedGuest } from '@/lib/testimonials-types'
import Link from 'next/link'

interface ReviewsGalleryListProps {
  initialReviews: Testimonial[]
}

const CATEGORIES: { label: string; filter: string }[] = [
  { label: 'All Reviews', filter: 'all' },
  { label: 'Stays & Cabins', filter: 'Stay' },
  { label: 'Galley Dining', filter: 'Dine' },
  { label: 'Pub & Fireside', filter: 'Drink & Fire' },
  { label: 'Dog & Walking Breaks', filter: 'Walking / Dog Break' }
]

export default function ReviewsGalleryList({ initialReviews }: ReviewsGalleryListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activePhoto, setActivePhoto] = useState<string | null>(null)

  const filteredReviews = initialReviews.filter((r) => {
    if (activeCategory === 'all') return true
    return r.stayType === activeCategory
  })

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => {
          const count =
            cat.filter === 'all'
              ? initialReviews.length
              : initialReviews.filter((r) => r.stayType === cat.filter).length
          const isSelected = activeCategory === cat.filter
          return (
            <button
              key={cat.filter}
              onClick={() => setActiveCategory(cat.filter)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Review Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <div className="text-4xl mb-3">⚓</div>
          <h3 className="text-xl font-serif font-bold text-slate-800">
            No reviews yet in this category
          </h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto mb-6">
            Be the first to share your experience with other travellers and locals!
          </p>
          <Link
            href="/review"
            className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition shadow"
          >
            Leave a Review →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReviews.map((rev) => {
            const verified = isVerifiedGuest(rev)
            const text = getReviewText(rev)
            const photos = rev.photos || []

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Stars & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= (rev.rating || 5) ? 'text-amber-500' : 'text-slate-200'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      {rev.stayType && (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {rev.stayType}
                        </span>
                      )}
                      {verified && (
                        <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Title */}
                  {rev.title && (
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 leading-snug">
                      “{rev.title}”
                    </h3>
                  )}

                  {/* Review Quote Text */}
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-4 font-light">
                    {text}
                  </p>

                  {/* Guest Photos Strip */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4 pt-2 border-t border-slate-100">
                      {photos.map((src, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setActivePhoto(src)}
                          className="relative rounded-xl overflow-hidden group cursor-pointer border border-slate-200 aspect-4/3 bg-slate-100 hover:opacity-95 transition"
                        >
                          <img
                            src={src}
                            alt={`Photo by ${rev.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold backdrop-blur-2xs">
                            🔍 Expand
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Guest Info & Date */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-sans">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{rev.name}</span>
                    {rev.location && <span className="text-slate-500">{rev.location}</span>}
                  </div>
                  {(rev.stayOrVisitDate || rev.visitDate) && (
                    <span className="text-slate-500 text-xs font-sans font-medium tabular-nums">
                      {rev.stayOrVisitDate || rev.visitDate}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Accessible Photo Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl cursor-default"
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-950/80 text-white hover:bg-slate-900 rounded-full flex items-center justify-center text-lg transition border border-white/20 cursor-pointer"
              title="Close image"
            >
              ✕
            </button>
            <img
              src={activePhoto}
              alt="Guest Review Photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

