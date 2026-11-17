'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { compressImage } from '@/lib/imageCompressor'
import { upload } from '@vercel/blob/client'
import SocialVideoEmbed from '@/components/SocialVideoEmbed'
import { normalizeSocialUrl, NormalizedSocial } from '@/lib/socialUrlHelper'

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
  platform?: 'facebook' | 'instagram'
  embedUrl?: string
  isSilent?: boolean
  bookingRequired?: boolean
  pdfUrl?: string
  pdfFileName?: string
  ctaText?: string
  ctaLink?: string
  publishedAt: string
  createdAt?: string
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Recently'
  try {
    const now = Date.now()
    const then = new Date(dateString).getTime()
    if (isNaN(then)) return dateString // If it's already 'Just Now' or formatted
    const diffSec = Math.floor((now - then) / 1000)
    if (diffSec < 60) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return new Date(dateString).toLocaleDateString('en-GB')
  } catch {
    return dateString || 'Recently'
  }
}

export default function StaffPwaClient() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // Facebook Composer State
  const [caption, setCaption] = useState('')
  const [extendedSummary, setExtendedSummary] = useState('')
  const [mediaTab, setMediaTab] = useState<'social' | 'photo' | 'video'>('social')

  // Media Inputs
  const [socialLink, setSocialLink] = useState('')
  const [normalizedSocial, setNormalizedSocial] = useState<NormalizedSocial | null>(null)
  const [socialParseError, setSocialParseError] = useState<string | null>(null)

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null)
  const [videoFileSize, setVideoFileSize] = useState<string | null>(null)
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState<string | null>(null)

  // Secondary Options Drawer
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [postType, setPostType] = useState<'event' | 'news'>('news')
  const [eventDate, setEventDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [eventTime, setEventTime] = useState('7:30 PM')
  const [location, setLocation] = useState('The Ship Inn, Porlock Weir')
  const [bookingRequired, setBookingRequired] = useState(false)
  const [isSilentMode, setIsSilentMode] = useState(true)

  // Optional PDF Attachment
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string | null>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // CTA Link State
  const [ctaPreset, setCtaPreset] = useState<string>('none')
  const [ctaCustomText, setCtaCustomText] = useState('')
  const [ctaCustomLink, setCtaCustomLink] = useState('')

  // Submission & Feed State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatusText, setUploadStatusText] = useState('')
  const [postSuccessMessage, setPostSuccessMessage] = useState(false)
  const [publishedItems, setPublishedItems] = useState<PublishedItem[]>([])
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  // Two-Tap Safe Delete State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Auth & Load Feed
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('ship_staff_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    fetch('/api/demo-posh')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setPublishedItems(data.items)
        }
      })
      .catch(() => {})

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

  // 1-Tap Paste from Clipboard
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          handleSocialUrlChange(text.trim())
        }
      } else {
        alert('Clipboard access not permitted. Please paste the URL into the box manually.')
      }
    } catch {
      alert('Could not read clipboard. Please paste the URL into the box manually.')
    }
  }

  // Social URL Change & Real-Time Normalization
  const handleSocialUrlChange = (val: string) => {
    setSocialLink(val)
    const trimmed = val.trim()
    if (!trimmed) {
      setNormalizedSocial(null)
      setSocialParseError(null)
      return
    }

    try {
      const norm = normalizeSocialUrl(trimmed)
      setNormalizedSocial(norm)
      setSocialParseError(null)
    } catch (err: any) {
      setNormalizedSocial(null)
      setSocialParseError(err.message || 'Please enter a valid Facebook or Instagram Reel URL.')
    }
  }

  // Photo Selection with WebP compression
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    setIsCompressingPhoto(true)
    try {
      const res = await compressImage(file, { maxWidthOrHeight: 1200, quality: 0.8 })
      setPhotoDataUrl(res.dataUrl)
    } catch (err: any) {
      const objUrl = URL.createObjectURL(file)
      setPhotoDataUrl(objUrl)
    } finally {
      setIsCompressingPhoto(false)
    }
  }

  // Video Selection & Canvas Frame Extraction
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    setVideoFile(file)
    setVideoFileSize(`${sizeMB} MB`)

    const blobUrl = URL.createObjectURL(file)
    setVideoFileUrl(blobUrl)

    // Extract frame for preview thumbnail
    const video = document.createElement('video')
    video.src = blobUrl
    video.muted = true
    video.playsInline = true
    video.currentTime = 1.0

    video.onloadeddata = () => {
      video.currentTime = Math.min(1.0, video.duration / 2)
    }

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbUrl = canvas.toDataURL('image/jpeg', 0.85)
          setVideoThumbnailPreview(thumbUrl)
        }
      } catch (err) {
        console.warn('Frame capture fallback:', err)
      }
    }
  }

  // PDF File Selection
  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
      setPdfFileName(file.name)
    }
  }

  // Resolve CTA Button
  const resolveCta = () => {
    if (ctaPreset === 'book') return { text: 'Reserve Table', link: '/contact' }
    if (ctaPreset === 'rooms') return { text: 'View Rooms & Stay', link: '/rooms' }
    if (ctaPreset === 'xmas') return { text: 'Festive & Christmas', link: '/xmas-preview-7924' }
    if (ctaPreset === 'menu') return { text: 'Explore Food & Drink', link: '/eat-drink' }
    if (ctaPreset === 'gallery') return { text: 'View Photo Gallery', link: '/gallery' }
    if (ctaPreset === 'custom' && ctaCustomText.trim()) return { text: ctaCustomText.trim(), link: ctaCustomLink.trim() || '#' }
    return { text: undefined, link: undefined }
  }

  // Can Submit Check
  const isPostReady = Boolean(
    (mediaTab === 'social' && normalizedSocial) ||
    (mediaTab === 'photo' && (photoFile || photoDataUrl)) ||
    (mediaTab === 'video' && videoFile)
  )

  // Submit Post
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPostReady) {
      alert('Please add a valid Reel link, Flyer image, or Video clip.')
      return
    }

    setIsSubmitting(true)
    setUploadStatusText('Preparing update...')

    try {
      let finalMediaUrl = ''
      let finalCoverImage = photoDataUrl || videoThumbnailPreview || '/images/Ship -new-thatch.webp'
      let finalPdfUrl: string | undefined = undefined

      // 1. Direct Video Upload via Vercel Blob
      if (mediaTab === 'video' && videoFile) {
        setUploadStatusText('Uploading video to Edge CDN...')
        const newBlob = await upload(videoFile.name, videoFile, {
          access: 'public',
          handleUploadUrl: '/api/upload-video',
        })
        finalMediaUrl = newBlob.url
      } else if (mediaTab === 'photo' && photoFile) {
        setUploadStatusText('Uploading flyer image...')
        try {
          const uniqueFilename = `flyer-${Date.now()}-${photoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const newBlob = await upload(uniqueFilename, photoFile, {
            access: 'public',
            handleUploadUrl: '/api/upload-video',
          })
          finalCoverImage = newBlob.url
          finalMediaUrl = newBlob.url
        } catch {
          finalCoverImage = photoDataUrl || ''
        }
      } else if (mediaTab === 'social' && normalizedSocial) {
        finalMediaUrl = normalizedSocial.url
      }

      // 2. Upload PDF if attached
      if (pdfFile) {
        setUploadStatusText('Uploading menu PDF...')
        setIsUploadingPdf(true)
        try {
          const uniquePdfName = `menu-${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const newPdfBlob = await upload(uniquePdfName, pdfFile, {
            access: 'public',
            handleUploadUrl: '/api/upload-menu',
          })
          finalPdfUrl = newPdfBlob.url
        } catch (pdfErr) {
          console.warn('PDF upload fallback:', pdfErr)
        } finally {
          setIsUploadingPdf(false)
        }
      }

      setUploadStatusText('Publishing post to website...')
      const cta = resolveCta()

      const titleText = caption.trim()
        ? caption.trim().length > 65
          ? `${caption.trim().slice(0, 62)}...`
          : caption.trim()
        : postType === 'event'
        ? 'Upcoming Event at The Ship Inn'
        : 'Update from The Ship Inn'

      const excerptText =
        extendedSummary.trim() ||
        caption.trim() ||
        (postType === 'event'
          ? 'Upcoming event at The Ship Inn Porlock Weir.'
          : 'Latest news and updates from The Ship Inn Porlock Weir.')

      const newItem: PublishedItem = {
        id: `post-${Date.now()}`,
        type: postType,
        title: titleText,
        eventDate: postType === 'event' ? eventDate : undefined,
        eventTime: postType === 'event' ? eventTime : undefined,
        location: postType === 'event' ? location : undefined,
        excerpt: excerptText,
        coverImage: finalCoverImage,
        videoUrl: finalMediaUrl || undefined,
        videoFileName: mediaTab === 'video' && videoFile ? videoFile.name : undefined,
        platform: normalizedSocial?.platform,
        embedUrl: normalizedSocial?.embedUrl,
        isSilent: mediaTab === 'video' ? isSilentMode : false,
        bookingRequired: postType === 'event' ? bookingRequired : false,
        pdfUrl: finalPdfUrl,
        pdfFileName: pdfFile ? pdfFile.name : undefined,
        ctaText: cta.text,
        ctaLink: cta.link,
        publishedAt: 'Just Now',
        createdAt: new Date().toISOString(),
      }

      const res = await fetch('/api/demo-posh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: newItem }),
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

      setPostSuccessMessage(true)

      // Reset Composer Form
      setCaption('')
      setExtendedSummary('')
      setSocialLink('')
      setNormalizedSocial(null)
      setPhotoFile(null)
      setPhotoDataUrl(null)
      setVideoFile(null)
      setVideoFileUrl(null)
      setVideoThumbnailPreview(null)
      setPdfFile(null)
      setPdfFileName(null)
      setCtaPreset('none')
      setCtaCustomText('')
      setCtaCustomLink('')
      setTimeout(() => setPostSuccessMessage(false), 5000)
    } catch (err: any) {
      alert('Error publishing post: ' + err.message)
    } finally {
      setIsSubmitting(false)
      setUploadStatusText('')
    }
  }

  // Safe Two-Tap Delete Handler
  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current)
      setConfirmDeleteId(null)
      executeDelete(id)
    } else {
      setConfirmDeleteId(id)
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = setTimeout(() => {
        setConfirmDeleteId(null)
      }, 4000)
    }
  }

  const executeDelete = async (id: string) => {
    setIsDeletingId(id)
    try {
      const res = await fetch('/api/demo-posh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete')
      }
      setPublishedItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err: any) {
      alert('Delete failed: ' + err.message)
    } finally {
      setIsDeletingId(null)
    }
  }

  // One-Tap Social Syndication Helper
  const copyFormattedSocialPost = (item: PublishedItem) => {
    const slug = (item.title || 'post')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 45)
    const shareUrl = `https://www.theshipinnporlockweir.co.uk/demo-posh-7924?post=${item.id}&utm_source=facebook&utm_medium=reel&utm_campaign=${slug || 'reel'}`

    const text = `⚓ ${item.title}

${item.excerpt}

${item.ctaText && item.ctaLink ? `👉 ${item.ctaText}: https://www.theshipinnporlockweir.co.uk${item.ctaLink}\n` : ''}
⚡ View on our Website: ${shareUrl}
#TheShipInn #PorlockWeir #Exmoor #SomersetPub`

    navigator.clipboard.writeText(text)
    setCopyFeedback(item.id)
    setTimeout(() => setCopyFeedback(null), 3000)
  }

  // 1. PIN LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-6">
        <div className="pt-8 text-center max-w-sm mx-auto w-full">
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
            Enter the 4-digit staff passcode to upload events, chalkboard flyers, or phone videos.
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
              className="w-full min-h-[44px] py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm rounded-2xl shadow-md transition transform active:scale-95 cursor-pointer"
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

  // 2. MAIN COMPOSER & TIMELINE VIEW (Strictly 360px+ responsive, zero horizontal clipping)
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 font-sans overflow-x-hidden">
      {/* Top Header: 2-Row Responsive Layout */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Row 1: Logo & Brand */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <SmartImage
                src="/images/the_ship_inn2.webp"
                alt="The Ship Inn Logo"
                className="h-9 w-auto shrink-0"
              />
              <div>
                <h1 className="text-sm font-serif font-bold text-blue-950 leading-tight">The Ship Inn</h1>
                <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Staff Publisher</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Row 2 on mobile: Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/demo-posh-7924"
              target="_blank"
              className="min-h-[38px] text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 font-semibold px-2.5 py-1.5 rounded-lg border border-amber-200 transition flex items-center gap-1"
            >
              <span>⚡</span>
              <span>Public Feed ↗</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="min-h-[38px] text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center"
            >
              Live Site ↗
            </Link>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('ship_staff_auth')
                setIsAuthenticated(false)
              }}
              className="min-h-[38px] text-xs text-slate-500 hover:text-red-600 px-2 py-1.5 transition flex items-center cursor-pointer"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 pt-4 space-y-6">
        {/* ============================================================== */}
        {/* FACEBOOK-STYLE CREATE POST COMPOSER CARD                      */}
        {/* ============================================================== */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
          {/* Composer Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden p-1.5">
              <SmartImage
                src="/images/the_ship_inn2.webp"
                alt="The Ship Inn Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Post an update to the website</h2>
              <p className="text-[11px] text-slate-500">Facebook-style mobile composer for The Ship Inn</p>
            </div>
          </div>

          {/* Facebook-Style Status Caption Box */}
          <div>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a short headline or caption (optional)..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* 3-Button Facebook-Style Action Bar */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMediaTab('social')}
              className={`min-h-[44px] py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mediaTab === 'social'
                  ? 'bg-white text-amber-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔗</span>
              <span className="truncate">Social Link</span>
            </button>

            <button
              type="button"
              onClick={() => setMediaTab('photo')}
              className={`min-h-[44px] py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mediaTab === 'photo'
                  ? 'bg-white text-amber-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🖼️</span>
              <span className="truncate">Flyer</span>
            </button>

            <button
              type="button"
              onClick={() => setMediaTab('video')}
              className={`min-h-[44px] py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mediaTab === 'video'
                  ? 'bg-white text-amber-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎥</span>
              <span className="truncate">Video</span>
            </button>
          </div>

          {/* Contextual Input & Live Preview Area */}
          <div className="space-y-3">
            {/* 1. SOCIAL LINK TAB */}
            {mediaTab === 'social' && (
              <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Paste Facebook or Instagram Reel Link
                  </span>
                  {normalizedSocial && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        normalizedSocial.platform === 'instagram'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-[#1877F2] text-white'
                      }`}
                    >
                      {normalizedSocial.platform === 'instagram' ? '📸 Instagram Reel' : '📘 Facebook Reel'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={socialLink}
                    onChange={(e) => handleSocialUrlChange(e.target.value)}
                    placeholder="Paste Facebook or Instagram Reel link..."
                    className="flex-1 min-h-[44px] bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="min-h-[44px] px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-1 cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <span>📋</span>
                    <span>Paste</span>
                  </button>
                </div>

                {socialParseError && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 font-medium">
                    {socialParseError}
                  </p>
                )}

                {/* Instant Live 9:16 Preview */}
                {normalizedSocial && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Live 9:16 Preview
                    </span>
                    <SocialVideoEmbed url={normalizedSocial.url} />
                  </div>
                )}
              </div>
            )}

            {/* 2. FLYER / PHOTO TAB */}
            {mediaTab === 'photo' && (
              <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs font-bold text-slate-800 block">
                  Upload Flyer, Chalkboard Special, or Photo (.PNG, .JPG, .WebP)
                </span>

                <label className="flex flex-col items-center justify-center min-h-[110px] border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl bg-white p-4 cursor-pointer transition">
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-xs font-bold text-slate-700">Tap to choose flyer or photo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Optimized automatically to lightweight WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>

                {isCompressingPhoto && (
                  <p className="text-xs text-amber-600 font-semibold animate-pulse">Compressing flyer image...</p>
                )}

                {photoDataUrl && (
                  <div className="relative mt-2 max-w-[260px] mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={photoDataUrl} alt="Flyer Preview" className="w-full h-auto object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null)
                        setPhotoDataUrl(null)
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/75 hover:bg-black text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. DIRECT VIDEO TAB */}
            {mediaTab === 'video' && (
              <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Direct Video (.MP4 / .MOV)</span>
                  {videoFileSize && <span className="text-[10px] text-amber-700 font-mono font-bold">{videoFileSize}</span>}
                </div>

                <label className="flex flex-col items-center justify-center min-h-[110px] border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl bg-white p-4 cursor-pointer transition">
                  <span className="text-2xl mb-1">📱</span>
                  <span className="text-xs font-bold text-slate-700">Tap to choose video from phone</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Vertical 9:16 videos display best</span>
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </label>

                {videoFileUrl && (
                  <div className="relative mt-2 max-w-[260px] mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null)
                        setVideoFileUrl(null)
                        setVideoThumbnailPreview(null)
                      }}
                      className="absolute top-2 right-2 z-30 w-7 h-7 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                      title="Remove video"
                    >
                      ×
                    </button>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Live Video Preview
                    </span>
                    <SocialVideoEmbed url={videoFileUrl} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* EXPANDABLE "MORE OPTIONS (EVENT DETAILS, PDF, LINKS & EXTRAS)" */}
          {/* ============================================================== */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/60">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-700 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>⚙️</span>
                <span>More Options (Event Details, Menu PDF &amp; Links)</span>
              </span>
              <span>{showMoreOptions ? '▲' : '▼'}</span>
            </button>

            {showMoreOptions && (
              <div className="p-4 border-t border-slate-200 space-y-4 bg-white text-xs">
                {/* Event vs News Type Selector */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Post Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPostType('news')}
                      className={`min-h-[40px] py-2 rounded-xl text-xs font-bold border transition ${
                        postType === 'news'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      📰 Pub News / Announcement
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostType('event')}
                      className={`min-h-[40px] py-2 rounded-xl text-xs font-bold border transition ${
                        postType === 'event'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      📅 Calendar Event
                    </button>
                  </div>
                </div>

                {/* Event Details if postType === 'event' */}
                {postType === 'event' && (
                  <div className="space-y-3 p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Event Date</label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Event Time</label>
                        <input
                          type="text"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          placeholder="e.g. 7:30 PM"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={bookingRequired}
                        onChange={(e) => setBookingRequired(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-700 font-semibold">
                        Table / Ticket Booking Required
                      </span>
                    </label>
                  </div>
                )}

                {/* Extended Details */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Extended Summary / Description
                  </label>
                  <textarea
                    rows={2}
                    value={extendedSummary}
                    onChange={(e) => setExtendedSummary(e.target.value)}
                    placeholder="Additional details for the post..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                  />
                </div>

                {/* PDF Menu / Wine List Attachment */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Attach Menu or PDF (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfSelect}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 file:cursor-pointer"
                  />
                  {pdfFileName && <p className="text-[10px] text-emerald-700 font-mono mt-1">✓ Attached: {pdfFileName}</p>}
                </div>

                {/* Call to Action Button Preset */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Call to Action Button
                  </label>
                  <select
                    value={ctaPreset}
                    onChange={(e) => setCtaPreset(e.target.value)}
                    className="w-full min-h-[40px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="none">No button</option>
                    <option value="book">Reserve Table (/contact)</option>
                    <option value="rooms">View Rooms &amp; Stay (/rooms)</option>
                    <option value="xmas">Festive &amp; Christmas Menu (/xmas-preview-7924)</option>
                    <option value="menu">Explore Food &amp; Drink (/eat-drink)</option>
                    <option value="gallery">View Photo Gallery (/gallery)</option>
                    <option value="custom">Custom Button Label &amp; URL</option>
                  </select>

                  {ctaPreset === 'custom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={ctaCustomText}
                        onChange={(e) => setCtaCustomText(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                      />
                      <input
                        type="url"
                        placeholder="Button Link (/page or https://)"
                        value={ctaCustomLink}
                        onChange={(e) => setCtaCustomLink(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Silent Ambient Mode Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isSilentMode}
                    onChange={(e) => setIsSilentMode(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700">
                    Silent Ambient Mode (Strictly muted by default for smooth website autoplay)
                  </span>
                </label>

                {/* POSH Tips & PIN Info */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-slate-700 space-y-1">
                  <p className="font-bold text-amber-900">⚡ POSH Strategy &amp; Passcode Notice</p>
                  <p>Publish updates here on the pub website first, then tap &ldquo;Copy for FB&rdquo; below to share directly into Facebook with full branding.</p>
                  <p className="font-mono text-[10px] text-slate-500">Staff Passcode: 1572 • Fallback: 7924</p>
                </div>
              </div>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="button"
            onClick={handlePostSubmit}
            disabled={!isPostReady || isSubmitting}
            className="w-full min-h-[48px] py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold uppercase tracking-wider text-xs rounded-2xl transition-all shadow-md shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⚓</span>
            <span>{isSubmitting ? uploadStatusText || 'Publishing Update...' : 'Post to Website'}</span>
          </button>

          {/* Post Confirmation Toast */}
          {postSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-slate-800 space-y-2 shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-green-800 font-bold text-xs">
                <span>✓</span>
                <span>Posted to website! Your update is live on the pub website.</span>
              </div>
              {publishedItems[0] && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => copyFormattedSocialPost(publishedItems[0])}
                    className="min-h-[40px] px-3 py-1.5 bg-[#1877F2] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📋</span>
                    <span>Copy Facebook Post</span>
                  </button>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <span>📘</span>
                    <span>Open FB ↗</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* TIMELINE FEED MANAGEMENT BELOW COMPOSER                       */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>⚓</span>
              <span>Timeline Feed ({publishedItems.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500">Live on The Ship Inn</span>
          </div>

          {publishedItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs">
              <span className="text-3xl mb-2 block">⚓</span>
              <p className="font-semibold text-slate-700">No posts published yet.</p>
              <p className="text-[11px] mt-0.5">Use the composer card above to post your first video, reel or flyer!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {publishedItems.map((item) => {
                const isInstagramReel =
                  item.platform === 'instagram' ||
                  (item.videoUrl && item.videoUrl.includes('instagram.com'))
                const isFacebookReel =
                  item.platform === 'facebook' ||
                  (item.videoUrl && (item.videoUrl.includes('facebook.com') || item.videoUrl.includes('fb.watch')))

                const badgeLabel = isInstagramReel
                  ? 'Instagram Reel'
                  : isFacebookReel
                  ? 'Facebook Reel'
                  : item.videoUrl
                  ? 'Video'
                  : item.type === 'event'
                  ? 'Calendar Event'
                  : 'Flyer'

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3"
                  >
                    {/* Post Meta Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            badgeLabel === 'Instagram Reel'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : badgeLabel === 'Facebook Reel'
                              ? 'bg-[#1877F2] text-white'
                              : badgeLabel === 'Calendar Event'
                              ? 'bg-amber-600 text-white'
                              : badgeLabel === 'Flyer'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {badgeLabel}
                        </span>

                        {item.eventDate && (
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            📅 {item.eventDate} {item.eventTime ? `@ ${item.eventTime}` : ''}
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(item.createdAt || item.publishedAt)}
                        </span>
                      </div>

                      {/* Two-Tap Safe Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)}
                        disabled={isDeletingId === item.id}
                        className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                          confirmDeleteId === item.id
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200'
                        }`}
                      >
                        {isDeletingId === item.id
                          ? 'Deleting...'
                          : confirmDeleteId === item.id
                          ? 'Tap again to confirm'
                          : 'Delete'}
                      </button>
                    </div>

                    {/* Post Title & Excerpt */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                      {item.excerpt && item.excerpt !== item.title && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                      )}
                    </div>

                    {/* Visual Media Preview */}
                    {item.videoUrl ? (
                      <div className="max-w-[280px]">
                        <SocialVideoEmbed url={item.videoUrl} />
                      </div>
                    ) : item.coverImage ? (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-[280px]">
                        <img src={item.coverImage} alt={item.title} className="w-full h-auto object-cover" />
                      </div>
                    ) : null}

                    {/* Action Bar (Syndication & Share) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => copyFormattedSocialPost(item)}
                        className="min-h-[38px] px-3 py-1.5 bg-[#1877F2] hover:bg-blue-700 text-xs font-bold text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📋</span>
                        <span>{copyFeedback === item.id ? 'Copied for Facebook!' : 'Copy for FB'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/demo-posh-7924?post=${item.id}`}
                          target="_blank"
                          className="min-h-[38px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1"
                        >
                          <span>⚡</span>
                          <span>Drop Link</span>
                        </Link>
                        <a
                          href="https://www.facebook.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[38px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1"
                        >
                          <span>📘</span>
                          <span>Open FB</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Brand */}
        <div className="pt-4 pb-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2 border-t border-slate-200">
          <SmartImage
            src="/images/the_ship_inn2.webp"
            alt="The Ship Inn Logo"
            className="h-6 w-auto opacity-70"
          />
          <span>The Ship Inn Porlock Weir • Staff Mobile Tool</span>
        </div>
      </main>
    </div>
  )
}
