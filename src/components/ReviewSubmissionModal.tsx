'use client'

import React, { useState } from 'react'

interface ReviewSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ReviewSubmissionModal({
  isOpen,
  onClose,
  onSuccess
}: ReviewSubmissionModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [stayOrVisitDate, setStayOrVisitDate] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [verifiedStay, setVerifiedStay] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('Please provide your name.')
      return
    }

    if (!content.trim()) {
      setErrorMessage('Please share a few words about your visit or stay.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim() || undefined,
          stayOrVisitDate: stayOrVisitDate.trim() || undefined,
          rating,
          title: title.trim() || undefined,
          content: content.trim(),
          source: 'direct_submission',
          status: 'pending',
          verifiedStay
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review.')
      }

      setSubmittedMessage(
        data.message ||
          'Thank you! Your review has been submitted and will appear on the site once approved by our team.'
      )

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetAndClose = () => {
    setName('')
    setLocation('')
    setStayOrVisitDate('')
    setTitle('')
    setContent('')
    setRating(5)
    setSubmittedMessage(null)
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submittedMessage ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{submittedMessage}</p>
            <button
              onClick={handleResetAndClose}
              className="bg-ship-blue-600 hover:bg-ship-blue-700 text-white font-bold px-6 py-2.5 rounded-full text-sm transition"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                Guest Feedback
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900">
                Leave a Review for The Ship Inn
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                We value your thoughts on our food, ales, rooms, or fireside atmosphere.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    aria-label={`${star} star rating`}
                  >
                    <svg
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-600 ml-2">
                  {hoverRating || rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Name and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John &amp; Mary Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bristol, London, Local"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                />
              </div>
            </div>

            {/* Visit Date & Headline Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  When Did You Visit?
                </label>
                <input
                  type="text"
                  placeholder="e.g. October 2026"
                  value={stayOrVisitDate}
                  onChange={(e) => setStayOrVisitDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Review Headline (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fantastic weekend break"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                />
              </div>
            </div>

            {/* Content Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell us about your experience, food, room, staff, or atmosphere..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
              />
            </div>

            {/* Verified Stay Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                checked={verifiedStay}
                onChange={(e) => setVerifiedStay(e.target.checked)}
                className="w-4 h-4 rounded text-ship-blue-600 focus:ring-ship-blue-500 border-slate-300"
              />
              <span>I stayed overnight or dined at The Ship Inn</span>
            </label>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold px-7 py-2.5 rounded-xl text-sm shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

