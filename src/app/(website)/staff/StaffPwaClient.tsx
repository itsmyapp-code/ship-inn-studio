'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { compressImage, CompressionResult } from '@/lib/imageCompressor'
import { upload } from '@vercel/blob/client'

// Simple default PIN for staff authentication
const STAFF_DEFAULT_PIN = '1572'

interface PublishedItem {
  id: string
  type: 'event' | 'news'
  title: string
  eventDate?: string
  eventTime?: string
  location?: string
  excerpt: string
  coverImage?: string
  videoUrl?: string
  videoFileName?: string
  isSilent?: boolean
  bookingRequired?: boolean
  pdfUrl?: string
  pdfFileName?: string
  ctaText?: string
  ctaLink?: string
  publishedAt: string
}

export default function StaffPwaClient() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // App Install / PWA prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isStandalone, setIsStandalone] = useState(false)

  // Quick Guide collapsible
  const [showGuide, setShowGuide] = useState(false)

  // Publisher Form State
  const [postType, setPostType] = useState<'event' | 'news'>('event')
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [eventTime, setEventTime] = useState('7:30 PM')
  const [location, setLocation] = useState('The Ship Inn, Porlock Weir')
  const [excerpt, setExcerpt] = useState('')
  const [bookingRequired, setBookingRequired] = useState(false)

  // Media state
  const [mediaType, setMediaType] = useState<'video' | 'photo' | 'social'>('video')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null)
  const [videoFileName, setVideoFileName] = useState<string | null>(null)
  const [videoFileSize, setVideoFileSize] = useState<string | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isSilentMode, setIsSilentMode] = useState(true)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [socialLink, setSocialLink] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Optional PDF Attachment State (e.g. Menu, Wine List)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string | null>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // Optional CTA Link State (Direct link to another page on the website)
  const [ctaPreset, setCtaPreset] = useState<string>('none')
  const [ctaCustomText, setCtaCustomText] = useState('')
  const [ctaCustomLink, setCtaCustomLink] = useState('')

  // Published Items State
  const [publishedItems, setPublishedItems] = useState<PublishedItem[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [latestItem, setLatestItem] = useState<PublishedItem | null>(null)
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  const [modalCopied, setModalCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    let copied = false
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        copied = true
      }
    } catch {
      // Fallback below
    }

    if (!copied) {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        copied = document.execCommand('copy')
        textArea.remove()
      } catch (err) {
        console.error('Fallback copy error:', err)
      }
    }
    return copied
  }

  // Initialize Auth & Load Items
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('ship_staff_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true)
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Load items from shared /api/demo-posh endpoint
    fetch('/api/demo-posh')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setPublishedItems(data.items)
        }
      })
      .catch(() => { })

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinInput.trim() === STAFF_DEFAULT_PIN || pinInput.trim() === '7924') {
      setIsAuthenticated(true)
      sessionStorage.setItem('ship_staff_auth', 'true')
      setPinError(false)
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      alert(
        'To install on iPhone:\n1. Tap the Share button at the bottom of Safari.\n2. Tap "Add to Home Screen".\n\nTo install on Android:\n1. Tap the 3 dots in Chrome.\n2. Tap "Install App" or "Add to Home screen".'
      )
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 80 * 1024 * 1024) {
      alert('Video file is over 80MB. Please select a clip under 60 seconds.')
      return
    }

    setVideoFile(file)
    const blobUrl = URL.createObjectURL(file)
    setVideoFileUrl(blobUrl)
    setVideoFileName(file.name)
    setVideoFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB')
  }

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsOptimizing(true)
    try {
      const result: CompressionResult = await compressImage(file, {
        maxWidthOrHeight: 1600,
        quality: 0.82,
        maxSizeKB: 300
      })
      setPhotoDataUrl(result.dataUrl)
    } catch (err) {
      alert('Could not compress photo. Please try another image.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    let finalVideoUrl = videoFileUrl || undefined

    // 1. Direct Client-to-Blob Upload (Bypasses the 4.5MB Serverless limit, supports camera roll videos up to 500MB!)
    if (mediaType === 'video' && videoFile) {
      setIsUploadingVideo(true)
      try {
        const uniqueFilename = `video-${Date.now()}-${videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const newBlob = await upload(uniqueFilename, videoFile, {
          access: 'public',
          handleUploadUrl: '/api/upload-video'
        })
        if (newBlob && newBlob.url) {
          finalVideoUrl = newBlob.url
        } else {
          throw new Error('No URL returned from Blob storage')
        }
      } catch (err: any) {
        console.error('Video upload error:', err)
        alert('Video upload error: ' + (err.message || 'Upload failed'))
        setIsUploadingVideo(false)
        return
      } finally {
        setIsUploadingVideo(false)
      }
    }

    // 2. Direct Client-to-Blob Upload for PDF Attachment (e.g. Menu, Wine List)
    let finalPdfUrl: string | undefined = undefined
    if (pdfFile) {
      setIsUploadingPdf(true)
      try {
        const uniquePdfFilename = `menu-${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const newPdfBlob = await upload(uniquePdfFilename, pdfFile, {
          access: 'public',
          handleUploadUrl: '/api/upload-video'
        })
        if (newPdfBlob && newPdfBlob.url) {
          finalPdfUrl = newPdfBlob.url
        }
      } catch (err: any) {
        console.error('PDF upload error:', err)
        alert('PDF upload error: ' + (err.message || 'Upload failed'))
        setIsUploadingPdf(false)
        return
      } finally {
        setIsUploadingPdf(false)
      }
    }

    // 3. Determine CTA Button link & text
    let finalCtaText: string | undefined = undefined
    let finalCtaLink: string | undefined = undefined
    if (ctaPreset === 'table') {
      finalCtaText = 'Reserve Table'
      finalCtaLink = '/contact'
    } else if (ctaPreset === 'rooms') {
      finalCtaText = 'View Rooms & Stay'
      finalCtaLink = '/rooms'
    } else if (ctaPreset === 'xmas') {
      finalCtaText = 'Festive & Christmas'
      finalCtaLink = '/xmas-preview-7924'
    } else if (ctaPreset === 'menu') {
      finalCtaText = 'Explore Food & Drink'
      finalCtaLink = '/eat-drink'
    } else if (ctaPreset === 'gallery') {
      finalCtaText = 'View Photo Gallery'
      finalCtaLink = '/gallery'
    } else if (ctaPreset === 'custom' && ctaCustomText.trim() && ctaCustomLink.trim()) {
      finalCtaText = ctaCustomText.trim()
      finalCtaLink = ctaCustomLink.trim()
    }

    const newItem: PublishedItem = {
      id: `post-${Date.now()}`,
      type: postType,
      title: title.trim(),
      eventDate: postType === 'event' ? eventDate : undefined,
      eventTime: postType === 'event' ? eventTime : undefined,
      location: postType === 'event' ? location : undefined,
      excerpt:
        excerpt.trim() ||
        (postType === 'event'
          ? 'Upcoming event at The Ship Inn Porlock Weir.'
          : 'Latest update from The Ship Inn Porlock Weir.'),
      coverImage: photoDataUrl || (mediaType === 'photo' ? '/images/Ship -new-thatch.webp' : undefined),
      videoUrl:
        mediaType === 'video'
          ? finalVideoUrl
          : mediaType === 'social'
            ? socialLink.trim() || undefined
            : undefined,
      videoFileName: mediaType === 'video' ? videoFileName || undefined : undefined,
      isSilent: mediaType === 'video' ? isSilentMode : false,
      bookingRequired: postType === 'event' ? bookingRequired : false,
      pdfUrl: finalPdfUrl,
      pdfFileName: pdfFile ? pdfFile.name : undefined,
      ctaText: finalCtaText,
      ctaLink: finalCtaLink,
      publishedAt: 'Just Now'
    }

    try {
      const res = await fetch('/api/demo-posh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: newItem })
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Server failed to save post')
      }

      if (Array.isArray(data.items)) {
        setPublishedItems(data.items)
      } else {
        setPublishedItems([newItem, ...publishedItems])
      }

      setLatestItem(newItem)
      setShowSuccessModal(true)

      // Reset Form
      setTitle('')
      setExcerpt('')
      setVideoFile(null)
      setVideoFileUrl(null)
      setVideoFileName(null)
      setPhotoDataUrl(null)
      setSocialLink('')
      setPdfFile(null)
      setPdfFileName(null)
      setCtaPreset('none')
      setCtaCustomText('')
      setCtaCustomLink('')
      setPdfFile(null)
      setPdfFileName(null)
      setCtaPreset('none')
      setCtaCustomText('')
      setCtaCustomLink('')
    } catch (err: any) {
      console.error('Failed to sync to demo API', err)
      alert('Error publishing item: ' + (err.message || 'Server error'))
    }
  }

  const handleDeleteItem = async (id: string, itemTitle: string) => {
    if (confirm(`Delete "${itemTitle}" from the website?`)) {
      const updated = publishedItems.filter((i) => i.id !== id)
      setPublishedItems(updated)

      try {
        await fetch('/api/demo-posh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id })
        })
      } catch (err) {
        console.error('Failed to sync delete to demo API', err)
      }
    }
  }

  // 1. PIN Lock Screen - Clean Heritage Maritime Styling (Off-White Warm Background)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-6">
        <div className="pt-8 text-center max-w-sm mx-auto w-full">
          {/* Proper The Ship Inn Official Logo */}
          <div className="mb-4 flex justify-center">
            <SmartImage
              src="/images/the_ship_inn2.webp"
              alt="The Ship Inn Logo"
              className="h-20 w-auto"
            />
          </div>

          <h1 className="text-2xl font-serif font-bold text-blue-950 tracking-wide">The Ship Inn</h1>
          <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mt-1">Staff Mobile Publisher</p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Enter the 4-digit staff passcode to upload events, daily chalkboard specials, or phone video.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              className="w-full text-center tracking-[0.5em] text-2xl py-3.5 bg-white border-2 border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-mono shadow-sm transition"
            />

            {pinError && (
              <p className="text-xs text-red-600 font-medium">
                Incorrect PIN. (Tip: Demo default is <span className="font-mono font-bold">1572</span> or <span className="font-mono font-bold">7924</span>)
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm rounded-2xl shadow-md transition transform active:scale-95 cursor-pointer"
            >
              Unlock Staff App →
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-slate-500 pb-4">
          The Ship Inn, Porlock Weir • Internal Staff Tool
        </div>
      </div>
    )
  }

  // 2. Authenticated Staff Publisher - Clean Warm Heritage Styling (No Black Background)
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 font-sans">
      {/* Top Mobile App Header with Official Logo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <SmartImage
            src="/images/the_ship_inn2.webp"
            alt="The Ship Inn Logo"
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-sm font-serif font-bold text-blue-950 leading-tight">The Ship Inn</h1>
            <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Staff Publisher Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold rounded-lg hover:bg-amber-100 transition cursor-pointer"
            >
              📲 Install App
            </button>
          )}

          <Link
            href="/demo-posh-7924"
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-300 transition"
          >
            View Live Feed ↗
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {/* Step-by-Step Instructions Card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-amber-900 hover:bg-slate-50 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>📖</span>
              <span>Staff Quick Guide: How to Post Without Copyright Blocks</span>
            </span>
            <span>{showGuide ? '▲ Close' : '▼ View Guide'}</span>
          </button>

          {showGuide && (
            <div className="p-4 pt-0 text-xs text-slate-700 border-t border-slate-100 space-y-3 bg-amber-50/40">
              <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl">
                <p className="font-bold text-amber-950 mb-1">⭐ The Golden Rule (POSH):</p>
                <p className="text-slate-800 leading-relaxed">
                  Always post to <strong>The Ship Inn website first</strong> using this app, then share the link or video to Facebook afterwards!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-800">1.</span>
                  <p>
                    <strong className="text-slate-900">Filming Video:</strong> Hold phone vertically (9:16 portrait). Keep videos to 10–30 seconds (pouring a pint, fresh roast beef, roaring fire, tide coming in).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-800">2.</span>
                  <p>
                    <strong className="text-slate-900">Avoid Music Blocks:</strong> Leave &ldquo;Silent Mode&rdquo; enabled or use real pub background audio. Do <em>not</em> add chart pop music before uploading, as Facebook legally restricts copyright songs from playing on external websites.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-800">3.</span>
                  <p>
                    <strong className="text-slate-900">Sharing to Facebook:</strong> Once published here, copy the Facebook link button to paste on the pub&apos;s Facebook page. This gives Facebook followers a high-res card that drives direct bookings!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* The 60-Second Mobile Publisher Form */}
        <form
          onSubmit={handlePublish}
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5"
        >
          {/* Post Category Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              1. What are you posting?
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPostType('event')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${postType === 'event'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                <span>📅 Scheduled Event</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('news')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${postType === 'news'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                <span>📰 Pub News / Special</span>
              </button>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              2. {postType === 'event' ? 'Event Headline *' : 'News Headline *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'event'
                  ? 'e.g. Live Sea Shanties & Fireside Pints'
                  : 'e.g. Fresh Porlock Oysters & New Winter Ales on Tap'
              }
              className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Event-Only Date / Time Fields */}
          {postType === 'event' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Time *
                </label>
                <input
                  type="text"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 7:30 PM"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="col-span-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bookingRequired}
                    onChange={(e) => setBookingRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Table booking advised / required
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Media Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              3. Media (Choose One)
            </label>

            {/* Media Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${mediaType === 'video'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                <span>🎥 Video</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${mediaType === 'photo'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                <span>🖼️ Photo/Flyer</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('social')}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${mediaType === 'social'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                <span>🔗 Social Link</span>
              </button>
            </div>

            {/* Sub-Panel: Camera Roll Video Upload */}
            {mediaType === 'video' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Phone Camera Roll Video</span>
                  <span className="text-[10px] text-amber-800 font-mono">MP4, MOV (iOS)</span>
                </div>

                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/*"
                  onChange={handleVideoFileChange}
                  className="w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600 file:cursor-pointer"
                />

                {videoFileName && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                    <span className="truncate max-w-[220px]">✓ {videoFileName} ({videoFileSize})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFileUrl(null)
                        setVideoFileName(null)
                      }}
                      className="text-red-600 hover:text-red-800 text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Silent Mode / Copyright Shield Toggle */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">🔇 Silent Video Mode (Recommended)</p>
                    <p className="text-[10px] text-slate-500">Plays as a clean visual ambient loop with zero copyright issues.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSilentMode}
                      onChange={(e) => setIsSilentMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Sub-Panel: Camera Roll Photo / Flyer Upload */}
            {mediaType === 'photo' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Flyer or Photo from Camera Roll</span>
                  {isOptimizing && <span className="text-amber-700 text-[10px] animate-pulse">Auto-optimizing...</span>}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {photoDataUrl ? (
                      <img src={photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🖼️</span>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="flex-1 text-xs text-slate-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600 file:cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  ⚡ Auto-compressed in-browser to WebP (~150KB) so the website stays lightning-fast.
                </p>
              </div>
            )}

            {/* Sub-Panel: Social Link */}
            {mediaType === 'social' && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input
                  type="url"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  placeholder="Paste Facebook Reel, IG Reel, or YouTube link..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  ⚠️ Note: Facebook Reels with commercial pop songs may be blocked by Meta on external websites. Use direct video upload above to prevent blocks.
                </p>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              4. Short Description (Optional)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="e.g. Join us for an atmospheric fireside session with local Exmoor ales..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* 5. Optional PDF Attachment (Menus, Wine Lists, Schedules) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>5. Attach Menu or Flyer (Optional PDF)</span>
              <span className="text-[10px] text-slate-400 font-normal">Menus, Wine Lists, Schedules</span>
            </label>
            {!pdfFile ? (
              <label className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 border-dashed rounded-xl cursor-pointer transition">
                <span className="text-lg">📄</span>
                <span className="text-xs font-semibold text-slate-700">Choose PDF Document (Menu/Flyer)...</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPdfFile(file)
                      setPdfFileName(file.name)
                    }
                  }}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-red-50/80 border border-red-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">PDF</span>
                  <span className="font-semibold text-slate-800 truncate">{pdfFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null)
                    setPdfFileName(null)
                  }}
                  className="text-red-600 hover:text-red-800 font-bold text-[11px] px-2 py-1 cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          {/* 6. Optional Direct Link / Call-to-Action (CTA) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>6. Button Link to Website Page (Optional CTA)</span>
              <span className="text-[10px] text-slate-400 font-normal">Table, Rooms, Menus, Xmas</span>
            </label>
            <select
              value={ctaPreset}
              onChange={(e) => setCtaPreset(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              <option value="none">No Button Link</option>
              <option value="table">🍽️ &ldquo;Reserve Table&rdquo; ➔ /contact</option>
              <option value="xmas">🎄 &ldquo;Festive &amp; Christmas&rdquo; ➔ /xmas-preview-7924</option>
              <option value="rooms">🛏️ &ldquo;View Rooms &amp; Stay&rdquo; ➔ /rooms</option>
              <option value="menu">🍻 &ldquo;Explore Food &amp; Drink&rdquo; ➔ /eat-drink</option>
              <option value="gallery">📸 &ldquo;View Photo Gallery&rdquo; ➔ /gallery</option>
              <option value="custom">✏️ Custom Button &amp; Link...</option>
            </select>

            {ctaPreset === 'custom' && (
              <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  value={ctaCustomText}
                  onChange={(e) => setCtaCustomText(e.target.value)}
                  placeholder="Button label (e.g. Order Takeaway, Book Gig)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition"
                />
                <input
                  type="text"
                  value={ctaCustomLink}
                  onChange={(e) => setCtaCustomLink(e.target.value)}
                  placeholder="Destination URL (e.g. /contact or https://...)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            )}
          </div>

          {/* 5. Optional PDF Attachment (Menus, Wine Lists, Schedules) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>5. Attach Menu or Flyer (Optional PDF)</span>
              <span className="text-[10px] text-slate-400 font-normal">Menus, Wine Lists, Schedules</span>
            </label>
            {!pdfFile ? (
              <label className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 border-dashed rounded-xl cursor-pointer transition">
                <span className="text-lg">📄</span>
                <span className="text-xs font-semibold text-slate-700">Choose PDF Document (Menu/Flyer)...</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPdfFile(file)
                      setPdfFileName(file.name)
                    }
                  }}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-red-50/80 border border-red-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">PDF</span>
                  <span className="font-semibold text-slate-800 truncate">{pdfFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null)
                    setPdfFileName(null)
                  }}
                  className="text-red-600 hover:text-red-800 font-bold text-[11px] px-2 py-1 cursor-pointer"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          {/* 6. Optional Direct Link / Call-to-Action (CTA) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>6. Button Link to Website Page (Optional CTA)</span>
              <span className="text-[10px] text-slate-400 font-normal">Table, Rooms, Menus, Xmas</span>
            </label>
            <select
              value={ctaPreset}
              onChange={(e) => setCtaPreset(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              <option value="none">No Button Link</option>
              <option value="table">🍽️ &ldquo;Reserve Table&rdquo; ➔ /contact</option>
              <option value="xmas">🎄 &ldquo;Festive &amp; Christmas&rdquo; ➔ /xmas-preview-7924</option>
              <option value="rooms">🛏️ &ldquo;View Rooms &amp; Stay&rdquo; ➔ /rooms</option>
              <option value="menu">🍻 &ldquo;Explore Food &amp; Drink&rdquo; ➔ /eat-drink</option>
              <option value="gallery">📸 &ldquo;View Photo Gallery&rdquo; ➔ /gallery</option>
              <option value="custom">✏️ Custom Button &amp; Link...</option>
            </select>

            {ctaPreset === 'custom' && (
              <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <input
                  type="text"
                  value={ctaCustomText}
                  onChange={(e) => setCtaCustomText(e.target.value)}
                  placeholder="Button label (e.g. Order Takeaway, Book Gig)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition"
                />
                <input
                  type="text"
                  value={ctaCustomLink}
                  onChange={(e) => setCtaCustomLink(e.target.value)}
                  placeholder="Destination URL (e.g. /contact or https://...)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            )}
          </div>

          {/* Big Publish Button */}
          <button
            type="submit"
            disabled={isUploadingVideo || isUploadingPdf}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-sm rounded-xl shadow-md transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isUploadingVideo ? (
              <>⏳ Uploading Video to CDN...</>
            ) : isUploadingPdf ? (
              <>⏳ Uploading PDF Menu...</>
            ) : (
              <>
                <span>🚀</span>
                <span>Publish to The Ship Inn (1-Click)</span>
              </>
            )}
          </button>
        </form>

        {/* Live Items Manager */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Website Items ({publishedItems.length})
            </h2>
            <span className="text-[10px] text-slate-500">Tap delete to remove anytime</span>
          </div>

          {publishedItems.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              No custom posts added yet. Use the form above to post your first event or news item!
            </div>
          ) : (
            <div className="space-y-3">
              {publishedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${item.type === 'event' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                        {item.type}
                      </span>
                      {item.eventDate && (
                        <span className="text-[10px] text-slate-500 font-mono">{item.eventDate}</span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 truncate">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{item.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        const targetUrl = `https://www.theshipinnporlockweir.co.uk/demo-posh-7924#${item.id}`
                        await copyToClipboard(targetUrl)
                        setCopiedItemId(item.id)
                        setTimeout(() => setCopiedItemId(null), 2500)
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                        copiedItemId === item.id
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 hover:bg-slate-300 text-blue-700'
                      }`}
                      title="Copy link for Facebook or WhatsApp"
                    >
                      {copiedItemId === item.id ? (
                        <>
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <span>🔗</span>
                          <span className="text-[11px]">Link</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-xs transition cursor-pointer"
                      title="Delete post"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && latestItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto border border-emerald-300">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-900">Published to Website!</h3>
              <p className="text-xs text-slate-600 mt-1">
                &ldquo;{latestItem.title}&rdquo; is now active on the demo feed and ready for Facebook.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Next Step: Social Syndication</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Copy the link below and paste it on the pub&apos;s Facebook page or Instagram story:
              </p>
              <button
                type="button"
                onClick={async () => {
                  const targetUrl = `https://www.theshipinnporlockweir.co.uk/demo-posh-7924#${latestItem.id}`
                  await copyToClipboard(targetUrl)
                  setModalCopied(true)
                  setTimeout(() => setModalCopied(false), 3000)
                }}
                className={`w-full py-2.5 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalCopied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-700 hover:bg-blue-600 text-white shadow-sm'
                }`}
              >
                <span>{modalCopied ? '✓ Link Copied to Clipboard!' : '📋 Copy Facebook Link'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
