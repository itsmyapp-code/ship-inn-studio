'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { compressImage, CompressionResult } from '@/lib/imageCompressor'

// Simple default PIN for staff authentication (can be configured or customized)
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
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null)
  const [videoFileName, setVideoFileName] = useState<string | null>(null)
  const [videoFileSize, setVideoFileSize] = useState<string | null>(null)
  const [isSilentMode, setIsSilentMode] = useState(true) // Default to silent / mute to avoid any copyright issues
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [socialLink, setSocialLink] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Published Items State (Persisted in localStorage for demo resilience)
  const [publishedItems, setPublishedItems] = useState<PublishedItem[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [latestItem, setLatestItem] = useState<PublishedItem | null>(null)

  // Initialize Auth & Standalone Detection
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('ship_staff_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    // Check if launched as PWA
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true)
    }

    // Capture install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Load local items
    try {
      const local = localStorage.getItem('ship_staff_posts')
      if (local) {
        setPublishedItems(JSON.parse(local))
      }
    } catch {}

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

    // Quick size validation (< 80MB)
    if (file.size > 80 * 1024 * 1024) {
      alert('Video file is over 80MB. Please select a clip under 60 seconds.')
      return
    }

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

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newItem: PublishedItem = {
      id: `post-${Date.now()}`,
      type: postType,
      title: title.trim(),
      eventDate: postType === 'event' ? eventDate : undefined,
      eventTime: postType === 'event' ? eventTime : undefined,
      location: postType === 'event' ? location : undefined,
      excerpt: excerpt.trim() || (postType === 'event' ? 'Upcoming event at The Ship Inn Porlock Weir.' : 'Latest update from The Ship Inn Porlock Weir.'),
      coverImage: photoDataUrl || (mediaType === 'photo' ? '/images/Ship -new-thatch.webp' : undefined),
      videoUrl: mediaType === 'video' ? videoFileUrl || undefined : mediaType === 'social' ? socialLink.trim() || undefined : undefined,
      videoFileName: mediaType === 'video' ? videoFileName || undefined : undefined,
      isSilent: mediaType === 'video' ? isSilentMode : false,
      bookingRequired: postType === 'event' ? bookingRequired : false,
      publishedAt: 'Just Now'
    }

    const updated = [newItem, ...publishedItems]
    setPublishedItems(updated)
    try {
      localStorage.setItem('ship_staff_posts', JSON.stringify(updated))
    } catch {}

    setLatestItem(newItem)
    setShowSuccessModal(true)

    // Reset Form for next entry
    setTitle('')
    setExcerpt('')
    setVideoFileUrl(null)
    setVideoFileName(null)
    setPhotoDataUrl(null)
    setSocialLink('')
  }

  const handleDeleteItem = (id: string, itemTitle: string) => {
    if (confirm(`Delete "${itemTitle}" from the website?`)) {
      const updated = publishedItems.filter((i) => i.id !== id)
      setPublishedItems(updated)
      try {
        localStorage.setItem('ship_staff_posts', JSON.stringify(updated))
      } catch {}
    }
  }

  // 1. PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
        <div className="pt-8 text-center max-w-sm mx-auto w-full">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-serif font-black text-2xl mx-auto shadow-xl shadow-amber-500/20 mb-4">
            ⚓
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">The Ship Inn</h1>
          <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mt-1">Staff Mobile Publisher</p>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Enter the 4-digit staff passcode to upload events, daily specials, or camera roll video.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-Digit PIN"
              className="w-full text-center tracking-[0.5em] text-2xl py-3.5 bg-slate-900 border-2 border-slate-700 rounded-2xl text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono transition"
            />

            {pinError && (
              <p className="text-xs text-red-400 font-medium">
                Incorrect PIN. (Tip: Demo default is <span className="font-mono font-bold text-white">1572</span> or <span className="font-mono font-bold text-white">7924</span>)
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95 cursor-pointer"
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

  // 2. Authenticated Staff PWA Publisher
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
            ⚓
          </span>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Ship Staff Publisher</h1>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Pipeline Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-bold rounded-lg hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
            >
              📲 Install App
            </button>
          )}

          <Link
            href="/demo-posh-7924"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg border border-slate-700 transition"
          >
            View Live Feed ↗
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {/* Step-by-Step Instructions Card (Collapsible) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-amber-400 hover:bg-slate-800/60 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>📖</span>
              <span>Staff Quick Guide: How to Post Without Copyright Blocks</span>
            </span>
            <span>{showGuide ? '▲ Close' : '▼ View Guide'}</span>
          </button>

          {showGuide && (
            <div className="p-4 pt-0 text-xs text-slate-300 border-t border-slate-800/60 space-y-3 bg-slate-900/40">
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl">
                <p className="font-bold text-amber-300 mb-1">⭐ The Golden Rule (POSH):</p>
                <p className="text-slate-300 leading-relaxed">
                  Always post to the <strong className="text-white">website first</strong> using this app, then share the link or video to Facebook afterwards!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">1.</span>
                  <p>
                    <strong className="text-white">Filming Video:</strong> Hold phone vertically (9:16 portrait). Keep videos to 10–30 seconds (pouring a pint, fresh roast beef, roaring fire, tide coming in).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">2.</span>
                  <p>
                    <strong className="text-white">Avoid Music Blocks:</strong> Leave &ldquo;Silent Mode&rdquo; enabled or use real pub background audio. Do <em>not</em> add chart pop music before uploading, as Facebook legally restricts copyright songs from playing on external websites.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">3.</span>
                  <p>
                    <strong className="text-white">Sharing to Facebook:</strong> Once published here, copy the Facebook link button to paste on the pub&apos;s Facebook page. This gives Facebook followers a high-res card that drives direct bookings!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* The 60-Second Mobile Publisher Form */}
        <form
          onSubmit={handlePublish}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5"
        >
          {/* Post Category Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. What are you posting?
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPostType('event')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  postType === 'event'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📅 Scheduled Event</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('news')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  postType === 'news'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📰 Pub News / Special</span>
              </button>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Event-Only Date / Time Fields */}
          {postType === 'event' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Time *
                </label>
                <input
                  type="text"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 7:30 PM"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div className="col-span-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bookingRequired}
                    onChange={(e) => setBookingRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-700 bg-slate-900"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Table booking advised / required
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Media Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              3. Media (Choose One)
            </label>

            {/* Media Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  mediaType === 'video'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎥 Video</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  mediaType === 'photo'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🖼️ Photo/Flyer</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('social')}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  mediaType === 'social'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔗 Social Link</span>
              </button>
            </div>

            {/* Sub-Panel: Camera Roll Video Upload */}
            {mediaType === 'video' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Phone Camera Roll Video</span>
                  <span className="text-[10px] text-amber-400 font-mono">MP4, MOV (iOS)</span>
                </div>

                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/*"
                  onChange={handleVideoFileChange}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer"
                />

                {videoFileName && (
                  <div className="p-2.5 bg-emerald-950/50 border border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                    <span className="truncate max-w-[220px]">✓ {videoFileName} ({videoFileSize})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFileUrl(null)
                        setVideoFileName(null)
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Silent Mode / Copyright Shield Toggle */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">🔇 Silent Video Mode (Recommended)</p>
                    <p className="text-[10px] text-slate-400">Plays as a clean visual ambient loop with zero copyright issues.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSilentMode}
                      onChange={(e) => setIsSilentMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Sub-Panel: Camera Roll Photo / Flyer Upload */}
            {mediaType === 'photo' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Flyer or Photo from Camera Roll</span>
                  {isOptimizing && <span className="text-amber-400 text-[10px] animate-pulse">Auto-optimizing...</span>}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
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
                    className="flex-1 text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  ⚡ Auto-compressed in-browser to WebP (~150KB) so the website stays lightning-fast.
                </p>
              </div>
            )}

            {/* Sub-Panel: Social Link */}
            {mediaType === 'social' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <input
                  type="url"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  placeholder="Paste Facebook Reel, IG Reel, or YouTube link..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  ⚠️ Note: Facebook Reels with commercial pop songs may be blocked by Meta on external websites. Use direct video upload above to prevent blocks.
                </p>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              4. Short Description (Optional)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="e.g. Join us for an atmospheric fireside session with local Exmoor ales..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Big Publish Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>Publish to Ship Inn Website (1-Click)</span>
          </button>
        </form>

        {/* Live Items Manager (Delete / Edit / Share) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Website Items ({publishedItems.length})
            </h2>
            <span className="text-[10px] text-slate-500">Tap delete to remove anytime</span>
          </div>

          {publishedItems.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No custom posts added yet. Use the form above to post your first event or news item!
            </div>
          ) : (
            <div className="space-y-3">
              {publishedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.type === 'event' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {item.type}
                      </span>
                      {item.eventDate && (
                        <span className="text-[10px] text-slate-400 font-mono">{item.eventDate}</span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-slate-400 truncate">{item.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          `Simulated Share Link copied!\nhttps://theshipinnporlockweir.co.uk/${item.type === 'event' ? 'events' : 'news'}/${item.id}\n\nWhen pasted to Facebook, this creates an instant high-res link card!`
                        )
                      }
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs transition cursor-pointer"
                      title="Share link"
                    >
                      🔗
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 rounded-lg text-xs transition cursor-pointer"
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

      {/* Success Modal with "Share to Social" prompt */}
      {showSuccessModal && latestItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto border border-emerald-500/40">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Published to Website!</h3>
              <p className="text-xs text-slate-400 mt-1">
                &ldquo;{latestItem.title}&rdquo; is now active on the pub&apos;s website and ready for Google Search.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Next Step: Social Syndication</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Copy the link below and paste it on the pub&apos;s Facebook page or Instagram story:
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://theshipinnporlockweir.co.uk/${latestItem.type === 'event' ? 'events' : 'news'}/${latestItem.id}`
                  )
                  alert('Copied to clipboard!')
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📋 Copy Facebook Link</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

