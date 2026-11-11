'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { compressImage, CompressionResult } from '@/lib/imageCompressor'
import { StayType } from '@/lib/testimonials-types'

const STAY_CATEGORIES: { label: string; value: StayType; icon: string; desc: string }[] = [
  { label: 'Dinner / Lunch', value: 'Dine', icon: '🍽️', desc: 'Galley seafood, pub classics & seasonal specials' },
  { label: 'Overnight Stay', value: 'Stay', icon: '🛏️', desc: 'Coastal cabins & historic harbour-view rooms' },
  { label: 'Drinks & Atmosphere', value: 'Drink & Fire', icon: '🍺', desc: 'Local ales, fireside pints & live music' },
  { label: 'Walking / Dog Break', value: 'Walking / Dog Break', icon: '🐾', desc: 'South West Coast Path & Exmoor trails' }
]

export default function GuestReviewPortalPage() {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [stayType, setStayType] = useState<StayType>('Stay')
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [reviewText, setReviewText] = useState('')

  // Photos state
  const [compressedPhotos, setCompressedPhotos] = useState<CompressionResult[]>([])
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionError, setCompressionError] = useState<string | null>(null)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setCompressionError(null)

    const availableSlots = 2 - compressedPhotos.length
    if (availableSlots <= 0) {
      setCompressionError('You can upload a maximum of 2 photos.')
      return
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots)
    setIsCompressing(true)

    try {
      const results: CompressionResult[] = []
      for (const file of filesToProcess) {
        const compressed = await compressImage(file, {
          maxWidthOrHeight: 1600,
          quality: 0.8,
          maxSizeKB: 350
        })
        results.push(compressed)
      }
      setCompressedPhotos((prev) => [...prev, ...results].slice(0, 2))
    } catch (err) {
      setCompressionError(err instanceof Error ? err.message : 'Failed to compress image.')
    } finally {
      setIsCompressing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemovePhoto = (index: number) => {
    setCompressedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!name.trim()) {
      setSubmitError('Please enter your name.')
      return
    }

    if (!title.trim()) {
      setSubmitError('Please enter a headline or title for your review.')
      return
    }

    if (reviewText.trim().length < 50) {
      setSubmitError(`Please write at least 50 characters (currently ${reviewText.trim().length} characters).`)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title: title.trim(),
        name: name.trim(),
        location: location.trim() || undefined,
        rating,
        stayType,
        visitDate: visitDate.trim() || undefined,
        reviewText: reviewText.trim(),
        photos: compressedPhotos.map((p) => ({
          dataUrl: p.dataUrl,
          fileName: p.fileName
        }))
      }

      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        setSubmittedSuccess(true)
      } else {
        throw new Error(data.error || 'Failed to submit review.')
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error submitting review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-amber-800 hover:text-amber-900 transition flex items-center gap-1.5"
          >
            ← Back to The Ship Inn
          </Link>
          <Link
            href="/reviews"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            Read all guest reviews ↗
          </Link>
        </div>

        {/* Header with Proper The Ship Inn Logo */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white rounded-full p-2.5 mx-auto mb-4 shadow-md border border-slate-200/80 flex items-center justify-center overflow-hidden">
            <SmartImage
              src="/images/the_ship_inn2.webp"
              alt="The Ship Inn Logo"
              width={96}
              height={96}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-2">
            The Ship Inn • Porlock Weir
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Whether you joined us for fresh Exmoor seafood, rested in our historic cabins, or enjoyed a fireside pint by the harbour—we’d love to hear your story.
          </p>
        </div>

        {/* Success State Notification (Warm Pub Aesthetic with Proper Logo) */}
        {submittedSuccess ? (
          <div className="bg-white border border-amber-200 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            {/* Circular Badge with The Ship Inn Logo */}
            <div className="w-28 h-28 bg-amber-50/80 rounded-full p-3 mx-auto mb-6 shadow-md border-2 border-amber-300 flex items-center justify-center overflow-hidden">
              <SmartImage
                src="/images/the_ship_inn2.webp"
                alt="The Ship Inn Porlock Weir"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <span>✓ Review Received</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
              Thank You for Your Review!
            </h2>
            <p className="text-slate-600 text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Your words mean the world to our small coastal team. Your review has been received and will appear on our website shortly following moderation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reviews"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md shadow-amber-500/20"
              >
                View Live Guest Reviews →
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
          >
            {/* 1. Overall Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Your Overall Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating)
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <span
                        className={`text-4xl transition-colors ${
                          active ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  )
                })}
                <span className="text-sm font-semibold text-slate-600 ml-3">
                  {rating === 5
                    ? 'Exceptional (5/5)'
                    : rating === 4
                    ? 'Very Good (4/5)'
                    : rating === 3
                    ? 'Good (3/5)'
                    : rating === 2
                    ? 'Fair (2/5)'
                    : 'Disappointing (1/5)'}
                </span>
              </div>
            </div>

            {/* 2. Visit Category */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. What was the main reason for your visit? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STAY_CATEGORIES.map((cat) => {
                  const isSelected = stayType === cat.value
                  return (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setStayType(cat.value)}
                      className={`text-left p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm ring-1 ring-amber-500/20'
                          : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{cat.icon}</span>
                      <div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-amber-900' : 'text-slate-800'}`}>
                          {cat.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{cat.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Home Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bristol, UK"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  When did you visit?
                </label>
                <input
                  type="text"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            {/* 4. Review Title / Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Review Title / Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. A proper, honest West Country pub escape"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            {/* 5. Review Comments (50 char min) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Review * (Minimum 50 characters)
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    reviewText.trim().length >= 50 ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {reviewText.trim().length} / 50 min
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about the atmosphere, the food, your room, or the local Exmoor walking trails..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 leading-relaxed transition"
              ></textarea>
            </div>

            {/* 6. In-Browser Optimized Photo Uploader */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Guest Photos (Optional, Max 2)
                </label>
                <span className="text-[11px] text-slate-500">
                  Compressed automatically to WebP (&lt;350KB) • EXIF &amp; GPS stripped
                </span>
              </div>

              {/* Photo Preview Strip */}
              {compressedPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {compressedPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group shadow-md"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-3">
                        <span className="text-[11px] font-mono bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-slate-900 font-bold border border-slate-200">
                          {photo.sizeKB} KB (WebP)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition cursor-pointer shadow"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Drop Area */}
              {compressedPhotos.length < 2 && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                    id="guest-photo-input"
                  />
                  <label
                    htmlFor="guest-photo-input"
                    className={`block border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50 hover:bg-amber-50/30 ${
                      isCompressing ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div className="text-3xl mb-2">📸</div>
                    <span className="text-sm font-semibold text-slate-800 block">
                      {isCompressing
                        ? 'Optimizing and compressing photos in browser...'
                        : 'Tap or drop up to 2 photos from your stay'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 block">
                      JPEG, PNG, HEIC from iPhone or Android — automatically converted to WebP
                    </span>
                  </label>
                </div>
              )}

              {compressionError && (
                <p className="text-red-600 text-xs mt-2 font-medium">{compressionError}</p>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className={`w-full py-4 rounded-2xl font-bold text-base transition shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:shadow-amber-500/30'
              }`}
            >
              {isSubmitting ? (
                <span>Submitting Your Review...</span>
              ) : (
                <>
                  <span>Submit Guest Review for Moderation</span>
                  <span className="text-lg leading-none">→</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
