'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import SocialVideoEmbed from '@/components/SocialVideoEmbed'
import { compressImage, CompressionResult } from '@/lib/imageCompressor'

interface DemoPostItem {
  id: string
  type: 'event' | 'news'
  title: string
  eventDate?: string
  eventTime?: string
  location?: string
  excerpt: string
  coverImage: string
  videoUrl?: string
  bookingRequired?: boolean
  isPast?: boolean
  publishedAt?: string
}

const INITIAL_EVENTS: DemoPostItem[] = [
  {
    id: 'shanties-nov-2026',
    type: 'event',
    title: 'Live Sea Shanties & Fireside Pints',
    eventDate: '2026-11-28',
    eventTime: '7:30 PM - 10:30 PM',
    location: 'Main Saloon & Fireside Bar',
    excerpt: 'Join us for an atmospheric evening of maritime folk and traditional West Country sea shanties by the roaring hearth.',
    coverImage: '/images/Ship -new-thatch.webp',
    videoUrl: 'https://youtube.com/shorts/5O9Yw7sZf7Q',
    bookingRequired: true,
    isPast: false
  },
  {
    id: 'news-winter-fire',
    type: 'news',
    title: 'The Fires Are Lit & New Winter Ale on Tap',
    excerpt: 'Winter has arrived at the harbour. Come warm up by our 15th-century open fireplace with pints of Exmoor Ale and our fresh local game pie.',
    coverImage: '/images/Ship -new-thatch.webp',
    videoUrl: 'https://youtube.com/shorts/5O9Yw7sZf7Q',
    publishedAt: 'Today',
    isPast: false
  },
  {
    id: 'sunday-roast-special',
    type: 'event',
    title: 'Exmoor Beef & Fresh Local Catch Sunday Lunch',
    eventDate: '2026-11-22',
    eventTime: '12:00 PM - 3:30 PM',
    location: 'The Galley Restaurant',
    excerpt: 'Locally farmed Exmoor beef, giant Yorkshire puddings, seasonal vegetables, and fresh Porlock oysters.',
    coverImage: '/images/shipinn-031.webp',
    videoUrl: 'https://youtube.com/shorts/5O9Yw7sZf7Q',
    bookingRequired: true,
    isPast: false
  },
  {
    id: 'summer-beer-fest',
    type: 'event',
    title: 'Harbour Ale & Craft Cider Showcase',
    eventDate: '2026-08-15',
    eventTime: 'All Weekend',
    location: 'Harbour Beer Garden',
    excerpt: 'Over 16 guest ales and farm ciders from across Devon and Somerset with live acoustic sets on the quayside.',
    coverImage: '/images/Ship -new-thatch.webp',
    bookingRequired: false,
    isPast: true
  },
  {
    id: 'folk-night-autumn',
    type: 'event',
    title: 'Autumn Acoustic Folk & Fiddle Night',
    eventDate: '2026-10-10',
    eventTime: '8:00 PM',
    location: 'The Ship Inn Bar',
    excerpt: 'Intimate candlelit acoustic session with local folk musicians and seasonal mulled cider.',
    coverImage: '/images/IMG_4414.webp',
    bookingRequired: false,
    isPast: true
  }
]

export default function DemoPoshPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'news'>('upcoming')
  const [eventsList, setEventsList] = useState<DemoPostItem[]>(INITIAL_EVENTS)

  // Fetch shared demo items from /api/demo-posh so updates made from /staff immediately show here!
  useEffect(() => {
    fetch('/api/demo-posh')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setEventsList(data.items)
        }
      })
      .catch(() => {})
  }, [])

  // Simulator Form State: Post Type ("event" or "news")
  const [simPostType, setSimPostType] = useState<'event' | 'news'>('event')
  const [simTitle, setSimTitle] = useState('')
  const [simDate, setSimDate] = useState('2026-12-05')
  const [simTime, setSimTime] = useState('7:00 PM')
  const [simLocation, setSimLocation] = useState('The Ship Inn, Porlock Weir')
  const [simExcerpt, setSimExcerpt] = useState('')
  const [simVideoUrl, setSimVideoUrl] = useState('')
  const [videoMode, setVideoMode] = useState<'link' | 'upload'>('link')
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null)
  const [uploadedVideoSize, setUploadedVideoSize] = useState<string | null>(null)
  const [simBooking, setSimBooking] = useState(false)
  const [simPhotoUrl, setSimPhotoUrl] = useState<string>('/images/shipinn-197.webp')
  const [isCompressing, setIsCompressing] = useState(false)
  const [simSuccess, setSimSuccess] = useState(false)

  // Manual Delete Handler
  const handleDeleteItem = async (id: string, itemTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}"? This will remove it immediately.`)) {
      setEventsList((prev) => prev.filter((item) => item.id !== id))
      try {
        await fetch('/api/demo-posh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id })
        })
      } catch (err) {
        console.error('Delete sync error', err)
      }
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const blobUrl = URL.createObjectURL(file)
    setSimVideoUrl(blobUrl)
    setUploadedVideoName(file.name)
    setUploadedVideoSize((file.size / (1024 * 1024)).toFixed(1) + ' MB')
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsCompressing(true)
    try {
      const res: CompressionResult = await compressImage(file, {
        maxWidthOrHeight: 1600,
        quality: 0.8,
        maxSizeKB: 350
      })
      setSimPhotoUrl(res.dataUrl)
    } catch (err) {
      alert('Photo optimization failed')
    } finally {
      setIsCompressing(false)
    }
  }

  const handleSimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!simTitle.trim()) return

    const newItem: DemoPostItem = {
      id: `sim-${Date.now()}`,
      type: simPostType,
      title: simTitle.trim(),
      eventDate: simPostType === 'event' ? simDate : undefined,
      eventTime: simPostType === 'event' ? simTime : undefined,
      location: simPostType === 'event' ? simLocation : undefined,
      publishedAt: simPostType === 'news' ? 'Just Now' : undefined,
      excerpt: simExcerpt.trim() || (simPostType === 'event' ? 'A special upcoming event at The Ship Inn Porlock Weir.' : 'Latest update from The Ship Inn Porlock Weir.'),
      coverImage: simPhotoUrl,
      videoUrl: simVideoUrl.trim() || undefined,
      bookingRequired: simPostType === 'event' ? simBooking : false,
      isPast: false
    }

    setEventsList((prev) => [newItem, ...prev])
    setSimSuccess(true)
    setActiveTab(simPostType === 'event' ? 'upcoming' : 'news')

    try {
      await fetch('/api/demo-posh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: newItem })
      })
    } catch (err) {
      console.error('Error posting item to demo API', err)
    }

    setTimeout(() => setSimSuccess(false), 5000)
  }

  const upcomingEvents = eventsList.filter((e) => e.type === 'event' && !e.isPast)
  const pastEvents = eventsList.filter((e) => e.type === 'event' && e.isPast)
  const newsItems = eventsList.filter((e) => e.type === 'news')

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. Private Client Demo Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 px-4 py-3 sticky top-0 z-50 shadow-md border-b border-amber-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-300 font-bold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
              Private Client Demo
            </span>
            <span className="font-bold">
              Mobile CMS &amp; Facebook Reels Pipeline (&ldquo;POSH&rdquo;)
            </span>
            <span className="hidden sm:inline text-amber-950 font-medium text-xs">
              • Staged Preview (Not on live site)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#simulator"
              className="bg-slate-950 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs"
            >
              📱 Try 60s Publisher ↓
            </a>
            <a
              href="#google-preview"
              className="bg-white/80 hover:bg-white text-slate-900 font-bold px-3 py-1.5 rounded-lg transition text-xs"
            >
              🔍 Google &amp; FB Previews ↓
            </a>
            <Link
              href="/"
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs"
            >
              Live Site ↗
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Hero Section: The Executive Pitch */}
      <section className="relative bg-gradient-to-b from-slate-950 via-ship-blue-900 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl p-3 mx-auto mb-6 border border-white/20 flex items-center justify-center">
            <SmartImage
              src="/images/the_ship_inn2.webp"
              alt="The Ship Inn"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>

          <span className="inline-block bg-amber-400/20 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-amber-400/30">
            Publish on Site, Share to Social (POSH)
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-4">
            Mobile CMS &amp; Facebook Reels Engine
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-8">
            How bar staff can publish event flyers and embed **Facebook Reels** in under 60 seconds from their phone—driving direct bookings while saving 10+ hours every month.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-bold text-amber-400 block font-serif">⚡ &lt; 60 Seconds</span>
              <span className="text-xs text-slate-300 mt-1 block">
                Direct camera-roll upload from the bar phone without desktop PC logins.
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-bold text-amber-400 block font-serif">🎬 Facebook Reels</span>
              <span className="text-xs text-slate-300 mt-1 block">
                Simply paste a Facebook Reel link; renders an interactive 9:16 vertical video with zero storage cost.
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-bold text-amber-400 block font-serif">🛡️ Zero-Maintenance</span>
              <span className="text-xs text-slate-300 mt-1 block">
                Events auto-archive the minute their date passes. The website never looks stagnant.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Demo Feed: Upcoming vs. Past Archive Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
              Public Display Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
              Events &amp; Social Video Feed
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Notice how Facebook Reels play directly in the event card without slowing down the page.
            </p>
          </div>

          {/* Dynamic Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${activeTab === 'upcoming'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <span>Upcoming Events</span>
              <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-mono">
                {upcomingEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${activeTab === 'news'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <span>📰 News &amp; Updates</span>
              <span className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full font-mono">
                {newsItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${activeTab === 'past'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <span>Past Events (Auto-Archive)</span>
              <span className="bg-slate-300 text-slate-700 text-xs px-2 py-0.5 rounded-full font-mono">
                {pastEvents.length}
              </span>
            </button>
          </div>
        </div>

        {/* Event / News Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(activeTab === 'upcoming' ? upcomingEvents : activeTab === 'news' ? newsItems : pastEvents).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Media Container: Either Facebook Reel or Flyer Image */}
                {item.videoUrl ? (
                  <div className="p-4 bg-slate-900 border-b border-slate-800">
                    <SocialVideoEmbed url={item.videoUrl} title={item.title} />
                  </div>
                ) : (
                  <div className="relative h-72 sm:h-84 w-full bg-slate-950 overflow-hidden flex items-center justify-center group">
                    {/* Ambient Blurred Background to frame flyer with no awkward empty voids */}
                    <img
                      src={item.coverImage}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                    />
                    {/* Full, Uncropped Flyer - preserves circular, square (1:1), portrait (4:5) or landscape (16:9) */}
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="relative z-10 max-h-full max-w-full object-contain p-3 drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                      {item.type === 'news' ? '📰 News Photo' : '📷 Full Event Flyer'}
                    </div>
                  </div>
                )}

                {/* Event or News Details */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    {item.type === 'event' ? (
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        📅 {item.eventDate} {item.eventTime ? `• ${item.eventTime}` : ''}
                      </span>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        📰 Pub News • {item.publishedAt || 'Latest'}
                      </span>
                    )}

                    {item.bookingRequired && (
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                        ✓ Booking Advised
                      </span>
                    )}

                    {item.isPast && (
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        Archived
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {item.location && (
                    <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </p>
                  )}

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Manual Delete Button */}
              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {item.bookingRequired ? (
                    <Link
                      href="/contact"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow text-center"
                    >
                      Reserve Table →
                    </Link>
                  ) : item.type === 'event' ? (
                    <span className="text-xs text-slate-500 font-medium">Free Entry • All Welcome</span>
                  ) : (
                    <span className="text-xs text-blue-600 font-medium">Pub Update</span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Simulated Share Link copied!\nhttps://theshipinnporlockweir.co.uk/${item.type === 'event' ? 'events' : 'news'}/${item.id}\n\nWhen pasted to Facebook, this creates an instant high-res link card!`
                      )
                    }
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 fill-blue-600" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>

                {/* Staff Delete Button (Manual Item Removal) */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id, item.title)}
                  className="w-full sm:w-auto px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  title="Remove this post"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Post</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive "Try It" 60-Second Mobile Event & Reel Publisher */}
      <section id="simulator" className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 inline-block mb-3">
              Staff Experience Simulator
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              The 60-Second Mobile Publisher
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Test creating an event right now: pick a title, select a photo from your phone or PC, paste a Facebook Reel link, and watch it instantly appear in the feed above!
            </p>
          </div>

          {simSuccess && (
            <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-emerald-200 text-center text-sm font-semibold animate-pulse">
              ✓ Event published to the preview feed above! Scroll up to see it live with the embedded Reel.
            </div>
          )}

          <form
            onSubmit={handleSimSubmit}
            className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6"
          >
            {/* Post Category Toggle: Event vs News / Update */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Post Category
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSimPostType('event')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    simPostType === 'event'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📅 Scheduled Event</span>
                  <span className="text-[11px] opacity-80">(With date &amp; time)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimPostType('news')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    simPostType === 'news'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📰 Pub News / Update</span>
                  <span className="text-[11px] opacity-80">(Food specials, ales, weather)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                1. {simPostType === 'event' ? 'Event Headline / Title *' : 'News Headline *'}
              </label>
              <input
                type="text"
                required
                value={simTitle}
                onChange={(e) => setSimTitle(e.target.value)}
                placeholder={
                  simPostType === 'event'
                    ? 'e.g. Stumpy Oak Live Acoustic & Cider Night'
                    : 'e.g. Fresh Porlock Bay Oysters & New Winter Game Pie on the Board'
                }
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Event-Only Fields: Date, Time, Location */}
            {simPostType === 'event' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={simDate}
                    onChange={(e) => setSimDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Time
                  </label>
                  <input
                    type="text"
                    value={simTime}
                    onChange={(e) => setSimTime(e.target.value)}
                    placeholder="e.g. 7:30 PM"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={simLocation}
                    onChange={(e) => setSimLocation(e.target.value)}
                    placeholder="e.g. Saloon Bar or Garden"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>
            )}

            {/* Media Selector: Either Paste Social Reel/Post Link OR Directly Upload a Video */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  3. Video / Media (Optional)
                </label>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setVideoMode('link')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      videoMode === 'link'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔗 Paste Social Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoMode('upload')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      videoMode === 'upload'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎥 Upload Video File
                  </button>
                </div>
              </div>

              {videoMode === 'link' ? (
                <div>
                  <input
                    type="text"
                    value={simVideoUrl}
                    onChange={(e) => setSimVideoUrl(e.target.value)}
                    placeholder="Paste Facebook Reel, Facebook Photo, or YouTube link..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSimVideoUrl('https://www.facebook.com/photo/?fbid=122145032073039461&set=a.122102688105039461')
                      }
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      + Use Your Facebook Photo Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimVideoUrl('https://youtube.com/shorts/5O9Yw7sZf7Q')}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      + Use Sample YouTube Short
                    </button>
                    {simVideoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSimVideoUrl('')
                          setUploadedVideoName(null)
                          setUploadedVideoSize(null)
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                      >
                        Clear Media
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    💡 Automatically routes Facebook Reels to the video player, and Facebook Photos/Posts to the interactive post card!
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/*"
                    onChange={handleVideoUpload}
                    className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer"
                  />
                  {uploadedVideoName && (
                    <div className="mt-3 flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800">
                      <span>✓ Video Attached: {uploadedVideoName} ({uploadedVideoSize})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSimVideoUrl('')
                          setUploadedVideoName(null)
                          setUploadedVideoSize(null)
                        }}
                        className="text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-2">
                    Supports MP4, MOV (iPhone), and WebM files directly from your phone camera roll.
                  </p>
                </div>
              )}
            </div>

            {/* Camera Roll Flyer Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                4. Flyer or Photo (Direct from Camera Roll)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  <img
                    src={simPhotoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isCompressing
                      ? '⚡ Compressing to WebP (<300KB)...'
                      : 'Auto-converted client-side to WebP. Strips EXIF metadata.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Short Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                5. Quick Summary / Notes (For Google &amp; Facebook Preview)
              </label>
              <textarea
                rows={3}
                value={simExcerpt}
                onChange={(e) => setSimExcerpt(e.target.value)}
                placeholder="Set times, ticket info, or kitchen specials..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Booking Required Toggle */}
            <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                id="bookingToggle"
                checked={simBooking}
                onChange={(e) => setSimBooking(e.target.checked)}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="bookingToggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                Require Table Reservation? (Displays &ldquo;Book a Table&rdquo; button linking to booking page)
              </label>
            </div>

            <button
              type="submit"
              disabled={isCompressing}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/20 text-sm transition transform hover:scale-[1.01] cursor-pointer"
            >
              🚀 Publish Event Preview (Watch It Render Above!)
            </button>
          </form>
        </div>
      </section>

      {/* 5. Google Knowledge Panel & Facebook Feed Link Previews */}
      <section id="google-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
            Search &amp; Social Syndication
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
            Why This Drives Revenue &amp; Direct Bookings
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Posting directly on the website first powers automatic Google Event rich snippets and Facebook link cards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card A: Google Event Search Result Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <span className="text-xl font-bold text-blue-600">G</span>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Google Search Knowledge Panel
              </span>
              <span className="ml-auto text-[11px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-full">
                schema.org/Event
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-xl p-2.5 text-center shadow-xs border border-slate-200 w-16 shrink-0">
                  <span className="text-xs font-bold uppercase text-red-600 block">NOV</span>
                  <span className="text-2xl font-bold text-slate-900 block font-serif">28</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-blue-800 hover:underline cursor-pointer">
                    Live Sea Shanties &amp; Fireside Pints
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    The Ship Inn • Porlock Weir, Minehead (TA24 8PB)
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Sat, 28 Nov, 19:30 – 22:30. Traditional West Country sea shanties by the roaring hearth with local Exmoor ales.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-block bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      Tickets / Book Table
                    </span>
                    <span className="text-[11px] text-slate-400">theshipinnporlockweir.co.uk</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              ⭐ <strong>Benefit:</strong> When tourists or locals search Google for <em>&ldquo;events in Porlock Weir&rdquo;</em>, your pub appears in the top event carousel above standard search results.
            </p>
          </div>

          {/* Card B: Facebook Social Link Preview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <svg className="w-5 h-5 fill-blue-600" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Facebook Post Link Preview
              </span>
              <span className="ml-auto text-[11px] bg-blue-50 text-blue-700 font-mono font-bold px-2 py-0.5 rounded-full">
                Open Graph Meta
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
              <div className="aspect-16/9 bg-slate-200 relative overflow-hidden">
                <img
                  src="/images/Ship -new-thatch.webp"
                  alt="Facebook link card preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-200">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
                  theshipinnporlockweir.co.uk
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  Live Sea Shanties &amp; Fireside Pints • The Ship Inn
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Traditional maritime folk by the fireside at Porlock Weir. Reserve your table early.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              ⭐ <strong>Benefit:</strong> Staff only spend 30 seconds pasting the website link into Facebook. Every click leads patrons straight to table and room reservations!
            </p>
          </div>
        </div>
      </section>

      {/* 6. Pricing & Implementation Blueprint Card */}
      <section className="bg-amber-500/10 border-t border-amber-300/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-200 px-3 py-1 rounded-full mb-3 inline-block">
            Commercial Roadmap
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
            Ready to Price &amp; Deploy to the Live Site
          </h2>
          <p className="text-slate-700 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Everything shown on this demo page is built modularly. When the client approves the feature, we can turn it live on the main navigation in minutes.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/"
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition shadow"
            >
              Return to Public Website →
            </Link>
            <a
              href="#simulator"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow"
            >
              Test Mobile Simulator Again ↑
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

