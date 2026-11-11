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
  pdfUrl?: string
  pdfFileName?: string
  ctaText?: string
  ctaLink?: string
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
      .catch(() => { })
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
            <Link
              href="/staff"
              className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs"
            >
              Staff Studio ➔
            </Link>
            <Link
              href="/"
              className="bg-white/80 hover:bg-white text-slate-900 font-semibold px-3 py-1.5 rounded-lg transition text-xs"
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
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      title={item.pdfFileName || 'View PDF Attachment'}
                    >
                      <span className="text-sm">📄</span>
                      <span>View Menu (PDF)</span>
                    </a>
                  )}

                  {item.ctaLink && item.ctaText ? (
                    <Link
                      href={item.ctaLink}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
                    >
                      <span>{item.ctaText}</span>
                      <span>→</span>
                    </Link>
                  ) : item.bookingRequired ? (
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

      {/* Staff Publisher Banner (Replaces inline simulator & direct booking preview) */}
      <section className="bg-slate-100 border-t border-slate-200 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Staff Mobile Access
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-900 mt-2">
              Ready to post a new event or daily special?
            </h3>
            <p className="text-xs text-slate-600">
              Use the dedicated staff mobile publisher with direct camera roll video and photo uploading.
            </p>
          </div>
          <Link
            href="/staff"
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow text-center shrink-0"
          >
            Open Staff App (/staff) →
          </Link>
        </div>
      </section>

      {/* Roadmap & Next Steps */}
      <section className="bg-amber-500/10 border-t border-amber-300/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
            Ready to Price &amp; Deploy to the Live Site
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Everything shown on this demo page is ready to replace the public news and events page whenever approved.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow"
            >
              Return to Public Website →
            </Link>
            <Link
              href="/staff"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow"
            >
              Open Staff App →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
