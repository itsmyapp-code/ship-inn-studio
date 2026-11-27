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
  day: 'Friday' | 'Saturday' | 'Sunday' | 'TBC' | string
  stage: string
  timeSlot: string
  isHeadline?: boolean
  isTbc?: boolean
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
    isTbc: false,
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
    isTbc: false,
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
    isTbc: false,
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
    isTbc: false,
    description: 'Five seasoned musicians singing stirring shanties and high-energy folk with tight 5-part vocal harmonies and banjos roaring across the harbour water.',
    photoUrl: '/images/bbq board.webp',
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
    day: 'TBC',
    stage: 'Harbour Lawn Acoustic Tent',
    timeSlot: 'Date & Time TBC',
    isHeadline: false,
    isTbc: true,
    description: 'Warm afternoon acoustic vibes, mandolin solos, and vocal duets accompanying cold West Country cider and fresh Porlock Bay oysters on the quayside lawn.',
    photoUrl: '/images/IMG_4414.webp',
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

  // Composer Modal State (Add or Edit)
  const [showComposer, setShowComposer] = useState(false)
  const [editingBandId, setEditingBandId] = useState<string | null>(null)

  const [formBandName, setFormBandName] = useState('')
  const [formGenre, setFormGenre] = useState('Maritime Folk & Sea Shanties')
  const [formDay, setFormDay] = useState<string>('Saturday')
  const [formStage, setFormStage] = useState('The Quay Stage')
  const [formTimeSlot, setFormTimeSlot] = useState('8:00 PM - 10:00 PM')
  const [formIsHeadline, setFormIsHeadline] = useState(false)
  const [formIsTbc, setFormIsTbc] = useState(false)
  const [formDescription, setFormDescription] = useState('')
  const [formPhotoUrl, setFormPhotoUrl] = useState('/images/bar-area.webp')
  const [formAudioUrl, setFormAudioUrl] = useState('')
  const [formAudioTitle, setFormAudioTitle] = useState('')
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
    if (!band.sampleAudioUrl || band.sampleAudioUrl.trim() === '') return

    if (playingTrackId === band.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
      setPlayingTrackId(null)
      return
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }

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

  // Open modal for NEW band
  const handleOpenAddModal = () => {
    setEditingBandId(null)
    setFormBandName('')
    setFormGenre('Maritime Folk & Sea Shanties')
    setFormDay('Saturday')
    setFormStage('The Quay Stage')
    setFormTimeSlot('8:00 PM - 10:00 PM')
    setFormIsHeadline(false)
    setFormIsTbc(false)
    setFormDescription('')
    setFormPhotoUrl('/images/bar-area.webp')
    setFormAudioUrl('')
    setFormAudioTitle('')
    setFormSpotify('')
    setFormInstagram('')
    setFormFacebook('')
    setFormYoutube('')
    setFormWebsite('')
    setShowComposer(true)
  }

  // Open modal for EDIT band
  const handleOpenEditModal = (band: FestivalBandItem) => {
    setEditingBandId(band.id)
    setFormBandName(band.bandName || '')
    setFormGenre(band.genre || 'Maritime Folk & Sea Shanties')
    setFormDay(band.day || 'Saturday')
    setFormStage(band.stage || 'The Quay Stage')
    const rawTime = (band.timeSlot || '').replace(/^(Friday|Saturday|Sunday|TBC)\s*·\s*/i, '')
    setFormTimeSlot(rawTime)
    setFormIsHeadline(Boolean(band.isHeadline))
    setFormIsTbc(band.day === 'TBC' || Boolean(band.isTbc) || (band.timeSlot || '').includes('TBC'))
    setFormDescription(band.description || '')
    setFormPhotoUrl(band.photoUrl || '/images/bar-area.webp')
    setFormAudioUrl(band.sampleAudioUrl || '')
    setFormAudioTitle(band.sampleAudioTitle || '')
    setFormSpotify(band.socialLinks?.spotify || '')
    setFormInstagram(band.socialLinks?.instagram || '')
    setFormFacebook(band.socialLinks?.facebook || '')
    setFormYoutube(band.socialLinks?.youtube || '')
    setFormWebsite(band.socialLinks?.website || '')
    setShowComposer(true)
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

  // Submit band (Create or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formBandName.trim()) return

    setIsSubmitting(true)

    // Calculate timeSlot string based on TBC
    let finalDay = formIsTbc ? 'TBC' : formDay
    let finalTimeSlot = formIsTbc
      ? 'Date & Time TBC'
      : formTimeSlot.trim()
        ? `${formDay} · ${formTimeSlot.trim()}`
        : `${formDay} · Schedule TBC`

    const targetId = editingBandId || `band-${Date.now()}`

    const updatedBand: FestivalBandItem = {
      id: targetId,
      bandName: formBandName.trim(),
      genre: formGenre.trim(),
      day: finalDay,
      stage: formStage,
      timeSlot: finalTimeSlot,
      isHeadline: formIsHeadline,
      isTbc: formIsTbc,
      description:
        formDescription.trim() ||
        'Live festival performance at The Ship Inn Porlock Weir on the historic quayside.',
      photoUrl: formPhotoUrl,
      sampleAudioUrl: formAudioUrl.trim() || undefined,
      sampleAudioTitle: formAudioUrl.trim()
        ? formAudioTitle.trim() || `${formBandName} Live Preview`
        : undefined,
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
        body: JSON.stringify({ item: updatedBand })
      })
      const data = await res.json()
      if (data.success) {
        if (editingBandId) {
          setBands((prev) => prev.map((b) => (b.id === editingBandId ? updatedBand : b)))
          setSuccessMsg(`"${updatedBand.bandName}" updated successfully!`)
        } else {
          setBands((prev) => [updatedBand, ...prev])
          setSuccessMsg(`"${updatedBand.bandName}" added to the ShipWreck Festival Lineup!`)
        }
        setShowComposer(false)
        setEditingBandId(null)
        setTimeout(() => setSuccessMsg(null), 5000)
      }
    } catch (err) {
      console.error('Error saving band:', err)
      alert('Could not save band. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete band item
  const handleDeleteBand = async (bandId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the ShipWreck schedule?`)) {
      return
    }
    setBands((prev) => prev.filter((b) => b.id !== bandId))
    setSuccessMsg(`"${name}" was removed from the festival lineup.`)
    setTimeout(() => setSuccessMsg(null), 4000)
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
    const isBandTbc = b.day === 'TBC' || Boolean(b.isTbc) || (b.timeSlot || '').includes('TBC')
    let matchesDay = true
    if (activeDay === 'All') {
      matchesDay = true
    } else if (activeDay === 'TBC') {
      matchesDay = isBandTbc
    } else {
      matchesDay = b.day === activeDay
    }

    const matchesStage =
      activeStage === 'All' || b.stage.toLowerCase().includes(activeStage.toLowerCase())
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
              ShipWreck Music Festival Hub &amp; Dedicated Lineup Engine
            </span>
            <span className="hidden sm:inline text-amber-950 font-medium text-xs">
              • Updates ONLY ShipWreck
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold px-3 py-1.5 rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>+</span>
              <span>Create Band Post</span>
            </button>

            <a
              href="/docs/ShipWreck_Festival_Lineup_Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/90 hover:bg-slate-900 text-white font-semibold px-3 py-1.5 rounded-lg transition text-xs flex items-center gap-1.5 border border-white/20"
              title="Download printable A4 timetable"
            >
              <span>📄</span>
              <span>Download PDF Guide</span>
            </a>

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

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="bg-emerald-600 text-white text-sm font-semibold py-3 px-4 text-center sticky top-12 z-40 shadow-lg flex items-center justify-center gap-2 animate-fade-in">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Hero Section: Cinematic Video Spotlight */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-amber-900/40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
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
                <span className="text-amber-400">📅</span> 3-Day Music Festival
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
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-6 py-3 rounded-2xl transition shadow-xl flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              <span className="text-lg">🎸</span>
              <span>+ Add Band / Announcement (ShipWreck Only)</span>
            </button>

            <a
              href="/docs/ShipWreck_Festival_Lineup_Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>📄</span>
              <span>Download Printable Pocket Schedule (PDF)</span>
            </a>

            <Link
              href="/contact"
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold px-6 py-3 rounded-2xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>🍺</span>
              <span>Reserve Quayside Table</span>
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
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-400 block">{bands.length} Acts</span>
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
            {['All', 'Friday', 'Saturday', 'Sunday', 'TBC'].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${activeDay === day
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {day === 'All' ? 'All Days' : day === 'TBC' ? '⏳ TBC / Upcoming' : day}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
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

          <a
            href="/docs/ShipWreck_Festival_Lineup_Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition"
          >
            <span>📥 Download Printable Pocket Schedule (PDF)</span>
            <span>↗</span>
          </a>
        </div>

        {/* Band Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBands.map((band) => {
            const isPlayingThis = playingTrackId === band.id
            const isTbcBand =
              band.day === 'TBC' ||
              Boolean(band.isTbc) ||
              (band.timeSlot && band.timeSlot.includes('TBC'))
            const hasAudio = Boolean(band.sampleAudioUrl && band.sampleAudioUrl.trim() !== '')

            return (
              <div
                key={band.id}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Band Photo Container: Adaptive, uncropped fitting with ambient blurred background */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    {/* Ambient blurred backdrop */}
                    <div className="absolute inset-0 overflow-hidden">
                      <SmartImage
                        src={band.photoUrl}
                        alt=""
                        fill
                        className="object-cover blur-xl scale-125 opacity-35"
                      />
                    </div>

                    {/* Crisp uncropped foreground image */}
                    <SmartImage
                      src={band.photoUrl}
                      alt={band.bandName}
                      fill
                      className="object-contain relative z-10 p-2 group-hover:scale-[1.02] transition-transform duration-300"
                    />

                    {/* Subtle gradient vignette at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10 pointer-events-none" />

                    {/* Headline Badge */}
                    {band.isHeadline && (
                      <span className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        ⭐ Headline Act
                      </span>
                    )}

                    {/* Stage & Time Pill */}
                    <span
                      className={`absolute bottom-3 left-3 z-20 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border shadow-md ${isTbcBand
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950/80 text-amber-300 border-amber-500/30'
                        }`}
                    >
                      {isTbcBand ? '⏳ Date & Time TBC' : band.timeSlot}
                    </span>

                    {/* Management Action Bar (Edit & Delete) */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(band)}
                        className="bg-slate-950/90 hover:bg-amber-500 text-slate-200 hover:text-slate-950 text-xs px-2.5 py-1 rounded-lg border border-white/20 transition cursor-pointer flex items-center gap-1 font-semibold shadow-md"
                        title="Edit band details"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteBand(band.id, band.bandName)}
                        className="bg-slate-950/90 hover:bg-red-600 text-slate-200 hover:text-white text-xs px-2.5 py-1 rounded-lg border border-white/20 transition cursor-pointer flex items-center gap-1 font-semibold shadow-md"
                        title="Delete act"
                      >
                        <span>🗑️</span>
                      </button>
                    </div>
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

                    {/* Interactive Audio Preview Player: ONLY shown if audio URL exists */}
                    {hasAudio && (
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

      {/* 6. Composer Modal (Add OR Edit Band Announcement) */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                  Dedicated ShipWreck Composer
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {editingBandId ? 'Edit Band / Artist Announcement' : 'Add Band / Artist Announcement'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Updates <strong>only</strong> the ShipWreck Music Festival page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowComposer(false)
                  setEditingBandId(null)
                }}
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

              {/* TBC Schedule Checkbox Option */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/30">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsTbc}
                    onChange={(e) => setFormIsTbc(e.target.checked)}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-amber-300 font-bold text-xs block">
                      ⏳ Date &amp; Time to be confirmed (TBC / TBA)
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Check this if set times aren&apos;t finalized yet. You can easily edit it later once confirmed.
                    </span>
                  </div>
                </label>
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
                    disabled={formIsTbc}
                    value={formIsTbc ? 'TBC' : formDay}
                    onChange={(e) => setFormDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="TBC">TBC / Not yet set</option>
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
                    disabled={formIsTbc}
                    value={formIsTbc ? 'Date & Time TBC' : formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    placeholder="e.g. 7:30 PM - 9:30 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">
                      Sample Music Audio (.mp3) <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    {formAudioUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormAudioUrl('')
                          setFormAudioTitle('')
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 underline"
                      >
                        Clear Audio
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formAudioUrl}
                    onChange={(e) => setFormAudioUrl(e.target.value)}
                    placeholder="Leave blank if no audio clip available"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Quick Clip:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormAudioUrl('/videos/shipwreck-theme.mp3')
                        setFormAudioTitle('Festival Theme Mix')
                      }}
                      className="underline hover:text-amber-300"
                    >
                      Festival Theme
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3')
                        setFormAudioTitle('High Seas Hornpipe')
                      }}
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
                  onClick={() => {
                    setShowComposer(false)
                    setEditingBandId(null)
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingBandId
                      ? 'Save Changes'
                      : 'Publish to ShipWreck Festival'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
