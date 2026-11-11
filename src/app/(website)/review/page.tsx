'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
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

    if (reviewText.trim().length < 50) {
      setSubmitError(`Please write at least 50 characters (currently ${reviewText.trim().length} characters).`)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
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
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5"
          >
            ← Back to The Ship Inn
          </Link>
          <Link
            href="/reviews"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Read all guest reviews ↗
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-amber-500/10">
            ⚓
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
            The Ship Inn • Porlock Weir
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Whether you joined us for fresh Exmoor seafood, rested in our historic cabins, or enjoyed a fireside pint by the harbour—we’d love to hear your story.
          </p>
        </div>

        {/* Success State Notification */}
        {submittedSuccess ? (
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-emerald-500/40">
              ✓
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
              Thank You for Your Review!
            </h2>
            <p className="text-slate-300 text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Your words mean the world to our small coastal team. Your review has been received and will be published live on our website shortly following moderation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reviews"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
              >
                View Live Guest Reviews →
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8"
          >
            {/* 1. Overall Star Rating */}
            <div>
              <label className="block text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
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
                          active ? 'text-amber-400' : 'text-slate-700'
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  )
                })}
                <span className="text-sm font-semibold text-slate-400 ml-3">
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
              <label className="block text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
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
                          ? 'bg-amber-400/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{cat.icon}</span>
                      <div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
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
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Home Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bristol, UK"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  When did you visit?
                </label>
                <input
                  type="text"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* 4. Review Comments (50 char min) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Your Review * (Minimum 50 characters)
                </label>
                <span
                  className={`text-xs font-mono ${
                    reviewText.trim().length >= 50 ? 'text-emerald-400' : 'text-slate-500'
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
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              ></textarea>
            </div>

            {/* 5. In-Browser Optimized Photo Uploader */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
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
                      className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 group shadow-lg"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
                        <span className="text-[11px] font-mono bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-amber-300 border border-amber-400/20">
                          {photo.sizeKB} KB (WebP)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="bg-red-600/90 hover:bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition cursor-pointer"
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
                    className={`block border-2 border-dashed border-slate-800 hover:border-amber-400/50 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-900/40 hover:bg-slate-900/80 ${
                      isCompressing ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div className="text-3xl mb-2">📸</div>
                    <span className="text-sm font-semibold text-white block">
                      {isCompressing
                        ? 'Optimizing and compressing photos in browser...'
                        : 'Tap or drop up to 2 photos from your stay'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 block">
                      JPEG, PNG, HEIC from iPhone or Android — automatically compressed to WebP
                    </span>
                  </label>
                </div>
              )}

              {compressionError && (
                <p className="text-red-400 text-xs mt-2 font-medium">{compressionError}</p>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-950/50 border border-red-500/40 text-red-200 text-sm rounded-xl">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className={`w-full py-4 rounded-2xl font-bold text-base transition shadow-xl cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
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

