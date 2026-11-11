'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Testimonial, getReviewText, isVerifiedGuest } from '@/lib/testimonials-types'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
}

export default function TestimonialCarousel({
  testimonials,
  title = 'What Our Guests Say',
  subtitle = 'Real reviews and stories from travellers, sailors, and locals at Porlock Weir'
}: TestimonialCarouselProps) {
  // Only display published testimonials, take up to 6 for carousel rotation
  const published = testimonials.filter((t) => t.status === 'published').slice(0, 6)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const total = published.length

  const nextSlide = useCallback(() => {
    if (total <= 1) return
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    if (total <= 1) return
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Autoplay every 7 seconds unless hovered/paused
  useEffect(() => {
    if (total <= 1 || isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 7000)
    return () => clearInterval(timer)
  }, [total, isPaused, nextSlide])

  if (total === 0) return null

  const averageRating = (
    published.reduce((sum, t) => sum + (t.rating || 5), 0) / (total || 1)
  ).toFixed(1)

  return (
    <section
      className="py-16 sm:py-24 bg-slate-50 border-t border-b border-slate-200/80 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                Guest Reviews &amp; Stories
              </span>
              <div className="flex items-center text-amber-500 text-sm">
                {'★'.repeat(5)}
                <span className="text-slate-800 font-bold ml-2 text-xs">
                  {averageRating} / 5.0
                </span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls & Link to Full Reviews */}
          <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
            {/* Prev / Next Arrows */}
            {total > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer shadow-xs"
                  aria-label="Previous review"
                >
                  ←
                </button>
                <span className="text-xs font-mono font-semibold text-slate-500 px-1">
                  {currentIndex + 1} / {total}
                </span>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer shadow-xs"
                  aria-label="Next review"
                >
                  →
                </button>
              </div>
            )}

            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-xs group"
            >
              <span>Read All Guest Reviews</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Carousel Showcase Card (Responsive: 1 featured on mobile, 3-card grid on wide screens with active indicator) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {published.map((rev, idx) => {
            const verified = isVerifiedGuest(rev)
            const text = getReviewText(rev)
            const photos = rev.photos || []
            const isSlideActive = idx === currentIndex

            return (
              <div
                key={rev.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between shadow-xs ${
                  isSlideActive
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Stars + Stay Type + Verified */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center text-amber-500 text-base">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= (rev.rating || 5) ? '★' : '☆'}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {rev.stayType && (
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {rev.stayType}
                        </span>
                      )}
                      {verified && (
                        <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Title / Headline */}
                  {rev.title && (
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                      “{rev.title}”
                    </h3>
                  )}

                  {/* Review Text with Expand / Read More toggle */}
                  <div className="mb-4">
                    <p
                      className={`text-slate-600 text-sm leading-relaxed font-light ${
                        expandedReviews[rev.id] ? 'whitespace-pre-line' : 'line-clamp-4'
                      }`}
                    >
                      {text}
                    </p>
                    {text.length > 180 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(rev.id)}
                        className="text-xs font-bold text-amber-800 hover:text-amber-900 mt-1.5 cursor-pointer transition inline-flex items-center gap-1"
                      >
                        {expandedReviews[rev.id] ? 'Show less ↑' : 'Read full review ↓'}
                      </button>
                    )}
                  </div>

                  {/* Customer Photos: single photo or 2-column grid */}
                  {photos.length > 0 && (
                    <div
                      className={`mb-4 gap-2 ${
                        photos.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2'
                      }`}
                    >
                      {photos.map((src, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setSelectedPhoto(src)}
                          className={`relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer shadow-2xs hover:opacity-95 transition ${
                            photos.length === 1 ? 'aspect-16/9' : 'aspect-4/3'
                          }`}
                          title="Click to view full photo"
                        >
                          <img
                            src={src}
                            alt={`Photo by ${rev.name} (${pIdx + 1})`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-semibold backdrop-blur-2xs">
                            🔍 View
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Guest Name, Location & Date */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{rev.name}</span>
                    {rev.location && <span className="text-slate-500">{rev.location}</span>}
                  </div>
                  {(rev.stayOrVisitDate || rev.visitDate) && (
                    <span className="text-slate-400 text-[11px]">
                      {rev.stayOrVisitDate || rev.visitDate}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel Dots & Leave Review Link */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
          <div className="flex items-center gap-2">
            {published.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-8 h-2.5 bg-amber-500'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to review ${dotIdx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-500">Recently visited us?</span>
            <Link
              href="/review"
              className="font-bold text-amber-800 hover:text-amber-900 underline underline-offset-4 transition"
            >
              + Share your experience
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md cursor-pointer transition"
              title="Close photo"
            >
              ✕
            </button>
            <img
              src={selectedPhoto}
              alt="Guest review photo"
              className="max-h-[80vh] w-auto rounded-2xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  )
}

