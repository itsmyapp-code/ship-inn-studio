'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { compressImage } from '@/lib/imageCompressor'

interface BandSocialLinks {
  instagram?: string
  facebook?: string
  spotify?: string
  youtube?: string
  website?: string
}

interface FestivalBandItem {
  id: string
  bandName: string
  genre: string
  day: 'Friday' | 'Saturday' | 'Sunday' | string
  stage: string
  timeSlot: string
  isHeadline?: boolean
  description: string
  photoUrl: string
  sampleAudioUrl?: string
  sampleAudioTitle?: string
  socialLinks?: BandSocialLinks
  ctaText?: string
  ctaLink?: string
  publishedAt?: string
}

const INITIAL_BANDS: FestivalBandItem[] = [
  {
    id: 'band-longest-johns',
    bandName: 'The Longest Johns',
    genre: 'Maritime Folk & Modern Shanties',
    day: 'Saturday',
    stage: 'The Quay Stage',
    timeSlot: 'Saturday · 8:30 PM - 10:30 PM',
    isHeadline: true,
    description: 'World-famous sea shanty trailblazers bringing roaring maritime harmonies, foot-stomping rhythm, and traditional sea songs to Porlock Weir quay under the stars.',
    photoUrl: '/images/Ship -new-thatch.webp',
    sampleAudioUrl: '/videos/shipwreck-theme.mp3',
    sampleAudioTitle: 'Wellerman & Harbour Hornpipe (Live Festival Mix)',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/5p7n5UeJ6N0Zq41EZZ93sY',
      instagram: 'https://www.instagram.com/thelongestjohns/',
      facebook: 'https://www.facebook.com/TheLongestJohns/',
      youtube: 'https://www.youtube.com/@TheLongestJohns'
    },
    ctaText: 'Reserve Quayside Table',
    ctaLink: '/contact',
    publishedAt: '2026-11-26T12:00:00Z'
  },
  {
    id: 'band-blackbeards-tea-party',
    bandName: "Blackbeard's Tea Party",
    genre: 'High-Octane Pirate Folk-Rock',
    day: 'Sunday',
    stage: 'The Quay Stage',
    timeSlot: 'Sunday · 8:00 PM - 9:45 PM',
    isHeadline: true,
    description: 'Electrifying festival favorites fusing traditional folk melodies with driving rock drums, blistering electric fiddle solos, and infectious pirate energy.',
    photoUrl: '/images/bar-area.webp',
    sampleAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    sampleAudioTitle: 'Loose Cannons & High Seas Jig',
    socialLinks: {
      spotify: 'https://open.spotify.com/',
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      website: 'https://blackbeardsteaparty.com'
    },
    ctaText: 'Book Dining Table',
    ctaLink: '/contact',
    publishedAt: '2026-11-26T11:00:00Z'
  },
  {
    id: 'band-exmoor-fiddlers',
    bandName: 'The Harbour Lights Fiddle Trio',
    genre: 'Celtic & West Country Fiddle',
    day: 'Friday',
    stage: 'Fireside Saloon Sessions',
    timeSlot: 'Friday · 7:00 PM - 9:00 PM',
    isHeadline: false,
    description: 'Intimate candlelit acoustic jigs, reels, and Somerset hornpipes inside the 15th-century saloon bar beside the roaring open hearth.',
    photoUrl: '/images/bar-area2.webp',
    sampleAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    sampleAudioTitle: 'Porlock Weir Hornpipe & Tide Reel',
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      youtube: 'https://www.youtube.com/'
    },
    ctaText: 'Fireside Table Booking',
    ctaLink: '/contact',
    publishedAt: '2026-11-26T10:00:00Z'
  },
  {
    id: 'band-salts',
    bandName: 'The Salts',
    genre: 'Raucous Maritime Folk & Shanties',
    day: 'Saturday',
    stage: 'The Quay Stage',
    timeSlot: 'Saturday · 5:30 PM - 7:00 PM',
    isHeadline: false,
    description: 'Five seasoned musicians singing stirring shanties and high-energy folk with tight 5-part vocal harmonies and banjos roaring across the harbour water.',
    photoUrl: '/images/bbq board.webp',
    sampleAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    sampleAudioTitle: 'Drunken Sailor (Full Sea Blast)',
    socialLinks: {
      spotify: 'https://open.spotify.com/',
      facebook: 'https://www.facebook.com/',
      instagram: 'https://www.instagram.com/'
    },
    ctaText: 'Book Harbour Lawn',
    ctaLink: '/contact',
    publishedAt: '2026-11-26T09:00:00Z'
  },
  {
    id: 'band-coastal-drift',
    bandName: 'Coastal Drift Acoustic',
    genre: 'Acoustic Indie & Coastal Bluegrass',
    day: 'Sunday',
    stage: 'Harbour Lawn Acoustic Tent',
    timeSlot: 'Sunday · 2:00 PM - 4:00 PM',
    isHeadline: false,
    description: 'Warm afternoon acoustic vibes, mandolin solos, and vocal duets accompanying cold West Country cider and fresh Porlock Bay oysters on the quayside lawn.',
    photoUrl: '/images/IMG_4414.webp',
    sampleAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    sampleAudioTitle: 'Severn Sea Breeze',
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      spotify: 'https://open.spotify.com/'
    },
    ctaText: 'Sunday Lunch Booking',
    ctaLink: '/food-drink',
    publishedAt: '2026-11-26T08:00:00Z'
  }
]

export default function ShipwreckFestivalClient() {
  const [bands, setBands] = useState<FestivalBandItem[]>(INITIAL_BANDS)
  const [activeDay, setActiveDay] = useState<string>('All')
  const [activeStage, setActiveStage] = useState<string>('All')

  // Hero Video State
  const [videoVariant, setVideoVariant] = useState<'logo' | 'sailing'>('logo')
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Audio Preview Player State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [audioProgress, setAudioProgress] = useState<number>(0)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Composer Modal State
  const [showComposer, setShowComposer] = useState(false)
  const [formBandName, setFormBandName] = useState('')
  const [formGenre, setFormGenre] = useState('Maritime Folk & Sea Shanties')
  const [formDay, setFormDay] = useState<'Friday' | 'Saturday' | 'Sunday'>('Saturday')
  const [formStage, setFormStage] = useState('The Quay Stage')
  const [formTimeSlot, setFormTimeSlot] = useState('8:00 PM - 10:00 PM')
  const [formIsHeadline, setFormIsHeadline] = useState(false)
  const [formDescription, setFormDescription] = useState('')
  const [formPhotoUrl, setFormPhotoUrl] = useState('/images/bar-area.webp')
  const [formAudioUrl, setFormAudioUrl] = useState('/videos/shipwreck-theme.mp3')
  const [formAudioTitle, setFormAudioTitle] = useState('Sample Track')
  const [formSpotify, setFormSpotify] = useState('')
  const [formInstagram, setFormInstagram] = useState('')
  const [formFacebook, setFormFacebook] = useState('')
  const [formYoutube, setFormYoutube] = useState('')
  const [formWebsite, setFormWebsite] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Fetch bands from API on mount
  useEffect(() => {
    fetch('/api/demo-shipwreck')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setBands(data.items)
        }
      })
      .catch((err) => console.warn('Could not load shipwreck items:', err))
  }, [])

  // Audio playback handler
  const handleTogglePlayAudio = (band: FestivalBandItem) => {
    if (!band.sampleAudioUrl) return

    // If currently playing this band's track, pause it
    if (playingTrackId === band.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
      setPlayingTrackId(null)
      return
    }

    // Stop existing audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }

    // Start new audio
    const audio = new Audio(band.sampleAudioUrl)
    audio.volume = 0.85
    audio.play().catch((e) => console.warn('Audio play error:', e))

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    audio.onended = () => {
      setPlayingTrackId(null)
      setAudioProgress(0)
    }

    currentAudioRef.current = audio
    setPlayingTrackId(band.id)
  }

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
    }
  }, [])

  // Switch hero video
  const currentVideoSrc =
    videoVariant === 'sailing'
      ? '/videos/Ship_Wreck_Sailing_Boat.mp4'
      : '/videos/Ship_Wreck_with_Logo.mp4'

  const currentPoster =
    videoVariant === 'sailing'
      ? '/videos/Ship_Wreck_Sailing_Boat-poster.webp'
      : '/videos/Ship_Wreck_with_Logo-poster.webp'

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsVideoMuted(videoRef.current.muted)
    }
  }

  const handleTogglePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsVideoPlaying(true)
      } else {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      }
    }
  }

  // Photo file upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await compressImage(file, {
        maxWidthOrHeight: 1400,
        quality: 0.8,
        maxSizeKB: 300
      })
      setFormPhotoUrl(res.dataUrl)
    } catch {
      alert('Photo optimization failed')
    }
  }

  // Submit new band
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formBandName.trim()) return

    setIsSubmitting(true)
    const newBand: FestivalBandItem = {
      id: `band-${Date.now()}`,
      bandName: formBandName.trim(),
      genre: formGenre.trim(),
      day: formDay,
      stage: formStage,
      timeSlot: `${formDay} · ${formTimeSlot.trim()}`,
      isHeadline: formIsHeadline,
      description:
        formDescription.trim() ||
        'Live festival performance at The Ship Inn Porlock Weir on the historic quayside.',
      photoUrl: formPhotoUrl,
      sampleAudioUrl: formAudioUrl.trim() || undefined,
      sampleAudioTitle: formAudioTitle.trim() || `${formBandName} Live Preview`,
      socialLinks: {
        spotify: formSpotify.trim() || undefined,
        instagram: formInstagram.trim() || undefined,
        facebook: formFacebook.trim() || undefined,
        youtube: formYoutube.trim() || undefined,
        website: formWebsite.trim() || undefined
      },
      ctaText: 'Reserve Table for Set',
      ctaLink: '/contact',
      publishedAt: new Date().toISOString()
    }

    try {
      const res = await fetch('/api/demo-shipwreck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: newBand })
      })
      const data = await res.json()
      if (data.success) {
        setBands((prev) => [newBand, ...prev])
        setShowComposer(false)
        setSuccessMsg(`"${newBand.bandName}" added to the ShipWreck Festival Lineup!`)
        setTimeout(() => setSuccessMsg(null), 5000)
        // Reset form
        setFormBandName('')
        setFormDescription('')
        setFormSpotify('')
        setFormInstagram('')
        setFormFacebook('')
        setFormYoutube('')
        setFormWebsite('')
        setFormIsHeadline(false)
      }
    } catch (err) {
      console.error('Error adding band:', err)
      alert('Could not save band. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete band item (for demo testing)
  const handleDeleteBand = async (bandId: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from the ShipWreck schedule?`)) return
    setBands((prev) => prev.filter((b) => b.id !== bandId))
    try {
      await fetch('/api/demo-shipwreck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: bandId })
      })
    } catch (err) {
      console.error('Error deleting band:', err)
    }
  }

  // Filter bands
  const filteredBands = bands.filter((b) => {
    const matchesDay = activeDay === 'All' || b.day === activeDay
    const matchesStage = activeStage === 'All' || b.stage.toLowerCase().includes(activeStage.toLowerCase())
    return matchesDay && matchesStage
  })

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Staged Demo Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 px-4 py-3 sticky top-0 z-50 shadow-md border-b border-amber-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-300 font-bold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
              Private Client Demo
            </span>
            <span className="font-bold">
              ShipWreck Music Festival Experience &amp; Dedicated Band Lineup Engine
            </span>
            <span className="hidden sm:inline text-amber-950 font-medium text-xs">
              • Updates ONLY the ShipWreck Festival Page
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComposer(true)}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold px-3 py-1.5 rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>+</span>
              <span>Create Band Post</span>
            </button>
            <Link
              href="/demo-posh-7924"
              className="bg-amber-800/80 hover:bg-amber-900 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs"
            >
              Pub Feed Demo
            </Link>
            <Link
              href="/"
              className="bg-white/90 hover:bg-white text-slate-900 font-semibold px-3 py-1.5 rounded-lg transition text-xs"
            >
              Live Site ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="bg-emerald-600 text-white text-sm font-semibold py-3 px-4 text-center sticky top-12 z-40 shadow-lg flex items-center justify-center gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Hero Section: Cinematic Video Spotlight */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-amber-900/40">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Header Title & Festival Meta */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs uppercase tracking-widest font-bold px-4 py-1.5 rounded-full mb-4">
              <span>⚓</span>
              <span>The Ship Inn • Porlock Weir Quayside</span>
              <span>⚓</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-tight leading-tight mb-4">
              ShipWreck Music Festival
            </h1>

            <p className="text-slate-300 text-base sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Three days of roaring sea shanties, high-energy Celtic folk rock, West Country cider, and acoustic quayside sessions under the Exmoor cliffs.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-amber-300/90 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                <span className="text-amber-400">📅</span> Bank Holiday Weekend
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                <span className="text-amber-400">📍</span> Porlock Weir Harbour, TA24 8PB
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                <span className="text-emerald-400">🎟️</span> Free Quayside Admission
              </span>
            </div>
          </div>

          {/* Cinematic Festival Video Frame */}
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-slate-900 group">
            {/* Aspect ratio container */}
            <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full bg-slate-950 flex items-center justify-center">
              <video
                key={currentVideoSrc}
                ref={videoRef}
                src={currentVideoSrc}
                poster={currentPoster}
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-contain"
              />

              {/* Video Overlay Controls */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlayVideo}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition shadow-lg cursor-pointer"
                    title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isVideoPlaying ? '❚❚' : '▶'}
                  </button>
                  <button
                    onClick={handleToggleMute}
                    className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold border border-white/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isVideoMuted ? '🔇' : '🔊'}</span>
                    <span>{isVideoMuted ? 'Unmute Festival Music' : 'Mute'}</span>
                  </button>
                </div>

                {/* Video Intro Variant Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/20 text-[11px] sm:text-xs">
                  <span className="text-slate-400 px-2 hidden sm:inline">Intro:</span>
                  <button
                    onClick={() => setVideoVariant('logo')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${videoVariant === 'logo'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                      }`}
                  >
                    Standard Logo
                  </button>
                  <button
                    onClick={() => setVideoVariant('sailing')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${videoVariant === 'sailing'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                      }`}
                  >
                    ⛵ Sailing Boat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowComposer(true)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-xl flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              <span className="text-lg">🎸</span>
              <span>+ Add Band / Update Lineup (ShipWreck Only)</span>
            </button>

            <Link
              href="/contact"
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>🍺</span>
              <span>Reserve Quayside Festival Table</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Festival Stages & Quick Stats Strip */}
      <div className="bg-slate-900/90 border-y border-amber-500/20 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-400 block">3 Stages</span>
            <span className="text-xs text-slate-400 mt-1 block">Quay, Saloon &amp; Lawn</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-400 block">18+ Acts</span>
            <span className="text-xs text-slate-400 mt-1 block">Shanties, Folk-Rock, Jigs</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-400 block">16 Guest Ales</span>
            <span className="text-xs text-slate-400 mt-1 block">Exmoor Ales &amp; Farm Cider</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-emerald-400 block">Free Entry</span>
            <span className="text-xs text-slate-400 mt-1 block">Quayside &amp; Lawn Stages</span>
          </div>
        </div>
      </div>

      {/* 4. Band Lineup & Stage Schedule Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-slate-800">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Official Schedule &amp; Artist Showcase
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              Band Lineup &amp; Sample Music
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Listen to preview tracks, follow the artists on social media, and plan your festival weekend at The Ship Inn.
            </p>
          </div>

          {/* Interactive Day Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            {['All', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${activeDay === day
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {day === 'All' ? 'All Days' : day}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-semibold text-slate-400">
          <span>Filter Stage:</span>
          {['All', 'The Quay Stage', 'Fireside Saloon', 'Harbour Lawn'].map((stg) => (
            <button
              key={stg}
              onClick={() => setActiveStage(stg)}
              className={`px-3 py-1 rounded-lg border transition cursor-pointer ${activeStage === stg
                ? 'bg-slate-800 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
            >
              {stg}
            </button>
          ))}
        </div>

        {/* Band Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBands.map((band) => {
            const isPlayingThis = playingTrackId === band.id

            return (
              <div
                key={band.id}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Band Photo Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <SmartImage
                      src={band.photoUrl}
                      alt={band.bandName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Headline Badge */}
                    {band.isHeadline && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        ⭐ Headline Act
                      </span>
                    )}

                    {/* Stage & Time Pill */}
                    <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30">
                      {band.timeSlot}
                    </span>

                    {/* Delete button (for demo testing) */}
                    <button
                      onClick={() => handleDeleteBand(band.id, band.bandName)}
                      className="absolute top-3 right-3 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs px-2.5 py-1 rounded-lg border border-red-500/30 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove from demo"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                        {band.bandName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                        {band.genre}
                      </span>
                      <span className="text-xs text-slate-400">
                        📍 {band.stage}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {band.description}
                    </p>

                    {/* Interactive Audio Preview Player */}
                    {band.sampleAudioUrl && (
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePlayAudio(band)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition shadow-md shrink-0 cursor-pointer ${isPlayingThis
                              ? 'bg-amber-500 text-slate-950 scale-105'
                              : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white'
                              }`}
                          >
                            {isPlayingThis ? '❚❚' : '▶'}
                          </button>

                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">
                              {isPlayingThis ? 'Now Playing Sample' : 'Listen to Sample Music'}
                            </span>
                            <span className="text-xs text-slate-300 truncate block">
                              {band.sampleAudioTitle || 'Festival Sample Clip'}
                            </span>
                          </div>

                          {/* Sound wave visualizer */}
                          {isPlayingThis && (
                            <div className="flex items-end gap-1 h-5 shrink-0 px-2">
                              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" />
                              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-2 [animation-delay:0.2s]" />
                              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-5 [animation-delay:0.4s]" />
                              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3 [animation-delay:0.1s]" />
                            </div>
                          )}
                        </div>

                        {/* Audio Progress Bar */}
                        {isPlayingThis && (
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                            <div
                              className="bg-amber-400 h-full transition-all duration-200"
                              style={{ width: `${audioProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Social Profiles & CTA */}
                <div className="p-6 pt-0 border-t border-slate-800/80 mt-auto">
                  <div className="flex items-center justify-between gap-3 pt-4">
                    {/* Social Media Links (Opening strictly in a new window) */}
                    <div className="flex items-center gap-2">
                      {band.socialLinks?.spotify && (
                        <a
                          href={band.socialLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center text-xs transition cursor-pointer"
                          title="Open Spotify (New Window)"
                        >
                          🎧
                        </a>
                      )}
                      {band.socialLinks?.instagram && (
                        <a
                          href={band.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center text-xs transition cursor-pointer"
                          title="Open Instagram (New Window)"
                        >
                          📸
                        </a>
                      )}
                      {band.socialLinks?.facebook && (
                        <a
                          href={band.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center text-xs transition cursor-pointer"
                          title="Open Facebook (New Window)"
                        >
                          f
                        </a>
                      )}
                      {band.socialLinks?.youtube && (
                        <a
                          href={band.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center text-xs transition cursor-pointer"
                          title="Open YouTube (New Window)"
                        >
                          ▶
                        </a>
                      )}
                      {band.socialLinks?.website && (
                        <a
                          href={band.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-600 text-white flex items-center justify-center text-xs transition cursor-pointer"
                          title="Open Official Website (New Window)"
                        >
                          🌐
                        </a>
                      )}
                    </div>

                    {/* Direct Booking CTA */}
                    <Link
                      href={band.ctaLink || '/contact'}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
                    >
                      <span>{band.ctaText || 'Reserve Table'}</span>
                      <span>➔</span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. Festival Atmosphere & Practical Harbour Guide */}
      <section className="bg-slate-900 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Food, Drink &amp; Harbour Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              The Festival Experience at Porlock Weir
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <span className="text-3xl block mb-3">🍺</span>
              <h3 className="text-lg font-bold text-amber-300 mb-2">Exmoor Ales &amp; Farm Cider</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy 16+ guest ales, traditional West Country cloudy scrumpy, and craft beers on tap across our outdoor quayside bars and saloon hearth.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <span className="text-3xl block mb-3">🦪</span>
              <h3 className="text-lg font-bold text-amber-300 mb-2">Harbour BBQ &amp; Porlock Oysters</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Freshly shucked Porlock Bay oysters, whole spit-roasted Exmoor lamb, gourmet burgers, and local seafood served right along the seawall.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <span className="text-3xl block mb-3">🌊</span>
              <h3 className="text-lg font-bold text-amber-300 mb-2">High Tide Evening Sessions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                As the high tide rolls into the harbour basin, the main acts kick off with torches and maritime lanterns reflecting across the salt water.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Composer Modal ("Add Band / Lineup Announcement") */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                  Dedicated ShipWreck Composer
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Add Band / Artist Announcement
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Updates <strong>only</strong> the ShipWreck Music Festival page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Band Name & Headline Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Band / Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBandName}
                    onChange={(e) => setFormBandName(e.target.value)}
                    placeholder="e.g. Cutlass Jack & The Shantymen"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 w-full cursor-pointer hover:border-amber-500/50">
                    <input
                      type="checkbox"
                      checked={formIsHeadline}
                      onChange={(e) => setFormIsHeadline(e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    <span className="text-slate-200 font-bold text-xs">⭐ Headline Act</span>
                  </label>
                </div>
              </div>

              {/* Genre & Day & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Musical Genre
                  </label>
                  <input
                    type="text"
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    placeholder="e.g. Celtic Rock"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Festival Day
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Stage
                  </label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="The Quay Stage">The Quay Stage</option>
                    <option value="Fireside Saloon Sessions">Fireside Saloon Sessions</option>
                    <option value="Harbour Lawn Acoustic Tent">Harbour Lawn Acoustic</option>
                  </select>
                </div>
              </div>

              {/* Time Slot & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    placeholder="e.g. 7:30 PM - 9:30 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Band Description / Performance Highlights
                  </label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief bio or what to expect..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Photo & Audio Sample */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Band Photo / Poster
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Preset:</span>
                    <button
                      type="button"
                      onClick={() => setFormPhotoUrl('/images/bar-area.webp')}
                      className="underline hover:text-amber-300"
                    >
                      Saloon
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormPhotoUrl('/images/bbq board.webp')}
                      className="underline hover:text-amber-300"
                    >
                      BBQ Quay
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormPhotoUrl('/images/Ship -new-thatch.webp')}
                      className="underline hover:text-amber-300"
                    >
                      Inn Front
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sample Music Audio URL (.mp3)
                  </label>
                  <input
                    type="text"
                    value={formAudioUrl}
                    onChange={(e) => setFormAudioUrl(e.target.value)}
                    placeholder="https://.../song.mp3"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Quick Clip:</span>
                    <button
                      type="button"
                      onClick={() => setFormAudioUrl('/videos/shipwreck-theme.mp3')}
                      className="underline hover:text-amber-300"
                    >
                      Festival Theme
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setFormAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3')}
                      className="underline hover:text-amber-300"
                    >
                      Hornpipe Reel
                    </button>
                  </div>
                </div>
              </div>

              {/* Band Social Profiles (Opens in new window only) */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                  Band Social Profiles (Opens in new window only)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={formSpotify}
                    onChange={(e) => setFormSpotify(e.target.value)}
                    placeholder="Spotify Profile URL"
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="url"
                    value={formInstagram}
                    onChange={(e) => setFormInstagram(e.target.value)}
                    placeholder="Instagram Profile URL"
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="url"
                    value={formFacebook}
                    onChange={(e) => setFormFacebook(e.target.value)}
                    placeholder="Facebook Profile URL"
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="url"
                    value={formYoutube}
                    onChange={(e) => setFormYoutube(e.target.value)}
                    placeholder="YouTube Video / Channel URL"
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to ShipWreck Festival'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
