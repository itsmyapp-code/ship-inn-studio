import React from 'react'
import { Testimonial } from '@/lib/testimonials'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, location, rating, stayOrVisitDate, title, content, source, verifiedStay } = testimonial

  const renderSourceBadge = () => {
    switch (source) {
      case 'google':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <span className="text-blue-500 font-bold">G</span> Google Review
          </span>
        )
      case 'tripadvisor':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="text-emerald-600 font-bold">◎</span> TripAdvisor
          </span>
        )
      case 'in_person':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span>✍</span> Guestbook
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <span>✓</span> Direct Guest Review
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col justify-between h-full relative group">
      <div>
        {/* Top Meta: Stars & Source */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Star Rating */}
          <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Source badge */}
          {renderSourceBadge()}
        </div>

        {/* Optional Title */}
        {title && (
          <h4 className="font-serif font-bold text-slate-900 text-lg sm:text-xl mb-2 line-clamp-2">
            &ldquo;{title}&rdquo;
          </h4>
        )}

        {/* Review Quote Content */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 italic">
          &ldquo;{content}&rdquo;
        </p>
      </div>

      {/* Author & Stay Details Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div>
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span>{name}</span>
            {verifiedStay && (
              <span
                title="Verified Stay / Dine Guest"
                className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded"
              >
                Verified Guest
              </span>
            )}
          </div>
          {location && <span className="text-slate-500 font-medium">{location}</span>}
        </div>

        {stayOrVisitDate && (
          <span className="text-slate-400 font-medium whitespace-nowrap">{stayOrVisitDate}</span>
        )}
      </div>
    </div>
  )
}

