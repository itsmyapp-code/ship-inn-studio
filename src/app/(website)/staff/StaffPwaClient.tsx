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
  const [showSocialInput, setShowSocialInput] = useState(false)
  const [showSummaryInput, setShowSummaryInput] = useState(false)
  const [showPdfDrawer, setShowPdfDrawer] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isLockHovered, setIsLockHovered] = useState(false)
  const [postType, setPostType] = useState<'event' | 'news'>('news')
  const unifiedFileInputRef = useRef<HTMLInputElement | null>(null)
  const photoOnlyInputRef = useRef<HTMLInputElement | null>(null)
  const videoOnlyInputRef = useRef<HTMLInputElement | null>(null)
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

  // Unified File Handler (Photos OR Videos via click or drag-and-drop)
  const processUnifiedFile = async (file: File) => {
    if (!file) return
    setShowSocialInput(false)
    setSocialLink('')
    setNormalizedSocial(null)
    setSocialParseError(null)

    if (file.type.startsWith('image/')) {
      setMediaTab('photo')
      setVideoFile(null)
      setVideoFileUrl(null)
      setVideoThumbnailPreview(null)
      setVideoFileSize(null)
      setPhotoFile(file)
      setIsCompressingPhoto(true)
      try {
        const res = await compressImage(file, { maxWidthOrHeight: 1200, quality: 0.8 })
        setPhotoDataUrl(res.dataUrl)
      } catch {
        setPhotoDataUrl(URL.createObjectURL(file))
      } finally {
        setIsCompressingPhoto(false)
      }
      return
    }

    if (file.type.startsWith('video/')) {
      setMediaTab('video')
      setPhotoFile(null)
      setPhotoDataUrl(null)
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setVideoFile(file)
      setVideoFileSize(`${sizeMB} MB`)
      const blobUrl = URL.createObjectURL(file)
      setVideoFileUrl(blobUrl)

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
            setVideoThumbnailPreview(canvas.toDataURL('image/jpeg', 0.85))
          }
        } catch {}
      }
    }
  }

  // Photo Selection with WebP compression
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processUnifiedFile(file)
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

⚡ Watch on our Website: ${shareUrl}
${item.ctaText && item.ctaLink ? `\n👉 ${item.ctaText}: https://www.theshipinnporlockweir.co.uk${item.ctaLink}` : ''}

#TheShipInn #PorlockWeir #Exmoor #SomersetPub`

    navigator.clipboard.writeText(text)
    setCopyFeedback(item.id)
    setTimeout(() => setCopyFeedback(null), 3000)
  }

  // 1. PIN LOCK SCREEN (with clear Red Closed Padlock)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-7 shadow-lg text-center">
          <div className="mb-4 flex justify-center">
            <SmartImage
              src="/images/the_ship_inn2.webp"
              alt="The Ship Inn Logo"
              className="h-20 w-auto"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Locked • Staff Access</span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-blue-950 tracking-wide">The Ship Inn</h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Enter your 4-digit staff passcode to post photos, videos, or events.
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
              placeholder="••••"
              className="w-full text-center tracking-[0.5em] text-2xl py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition"
            />

            {pinError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-medium">
                Incorrect PIN. (Tip: Demo default is <span className="font-mono font-bold">1572</span> or <span className="font-mono font-bold">7924</span>)
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[46px] py-3.5 bg-[#1877F2] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
            >
              Unlock Staff Publisher
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-slate-400 mt-6">
          The Ship Inn, Porlock Weir • Internal Staff Tool
        </div>
      </div>
    )
  }

  // 2. MAIN COMPOSER & TIMELINE VIEW (Facebook-Style Clean Light-Mode UI)
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans overflow-x-hidden py-5 px-3 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Clean Minimal Header (No Live Site clutter, Large Green Open / Red Closed Padlock) */}
        <header className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <SmartImage
              src="/images/the_ship_inn2.webp"
              alt="The Ship Inn Logo"
              className="h-9 w-auto shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
                Create Post
              </h1>
              <p className="text-[11px] text-slate-500 truncate">The Ship Inn, Porlock Weir</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/demo-posh-7924"
              target="_blank"
              className="min-h-[44px] px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-slate-200 hover:border-blue-200 transition flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">Public Feed</span>
              <span className="sm:hidden">Feed</span>
            </Link>

            {/* Large Visual Padlock Button: Green Open when unlocked, Red Closed on hover/lock */}
            <button
              type="button"
              onMouseEnter={() => setIsLockHovered(true)}
              onMouseLeave={() => setIsLockHovered(false)}
              onClick={() => {
                sessionStorage.removeItem('ship_staff_auth')
                setIsAuthenticated(false)
              }}
              title="Unlocked — Click to lock Staff Publisher"
              aria-label="Lock Staff Publisher"
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border-2 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isLockHovered
                  ? 'bg-red-50 border-red-400 text-red-600'
                  : 'bg-emerald-50 border-emerald-400 text-emerald-700'
              }`}
            >
              {isLockHovered ? (
                <>
                  <svg className="w-5 h-5 text-red-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Lock</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  <span className="hidden sm:inline">Unlocked</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Composer Card */}
        <main className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4">
              {/* Top Facebook-Style Pill Bar (Post Type) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPostType('news')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                    postType === 'news'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>Pub News</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('event')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                    postType === 'event'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>Calendar Event</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfDrawer(!showPdfDrawer)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                    pdfFileName || showPdfDrawer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{pdfFileName ? 'PDF Attached ✓' : 'Attach Menu PDF'}</span>
                </button>
              </div>

              {/* Event Details Drawer (shown cleanly when Calendar Event is selected) */}
              {postType === 'event' && (
                <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Event Date</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Event Time</label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        placeholder="e.g. 7:30 PM"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={bookingRequired}
                        onChange={(e) => setBookingRequired(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>Booking Required</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Optional Menu PDF Drawer */}
              {showPdfDrawer && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-slate-800">Attach Menu or Wine List PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfSelect}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                  />
                  {pdfFileName && <p className="text-[11px] text-emerald-700 font-semibold">✓ Attached: {pdfFileName}</p>}
                </div>
              )}

              {/* Facebook-Style Main Status / Caption Box */}
              <div className="rounded-2xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition">
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on at The Ship Inn today?"
                  className="w-full bg-transparent px-4 pt-3.5 pb-2 text-base sm:text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                />
                {showSummaryInput && (
                  <div className="px-4 pb-3 pt-1 border-t border-slate-100">
                    <textarea
                      rows={2}
                      value={extendedSummary}
                      onChange={(e) => setExtendedSummary(e.target.value)}
                      placeholder="Add extra description or menu notes..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={unifiedFileInputRef}
                type="file"
                accept="image/*,video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) processUnifiedFile(file)
                  e.target.value = ''
                }}
                className="hidden"
              />
              <input
                ref={photoOnlyInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) processUnifiedFile(file)
                  e.target.value = ''
                }}
                className="hidden"
              />
              <input
                ref={videoOnlyInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) processUnifiedFile(file)
                  e.target.value = ''
                }}
                className="hidden"
              />

              {/* Unified Drag-and-Drop Media Zone (Facebook "Add photos or videos / or drag and drop") */}
              {!photoDataUrl && !videoFileUrl && !showSocialInput && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => unifiedFileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') unifiedFileInputRef.current?.click()
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const file = e.dataTransfer.files?.[0]
                    if (file) processUnifiedFile(file)
                  }}
                  className={`flex flex-col items-center justify-center min-h-[148px] rounded-2xl border-2 border-dashed transition-all cursor-pointer p-6 text-center ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                      : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-400'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 mb-2.5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-900">Add photos or videos</span>
                  <span className="text-xs text-slate-500 mt-0.5">or drag and drop</span>
                </div>
              )}

              {isCompressingPhoto && (
                <p className="text-xs text-blue-600 font-semibold animate-pulse text-center py-2">
                  Optimizing photo to lightweight WebP...
                </p>
              )}

              {photoDataUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 flex justify-center">
                  <img
                    src={photoDataUrl}
                    alt="Attached preview"
                    className="max-h-[340px] w-auto rounded-xl object-contain shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoFile(null)
                      setPhotoDataUrl(null)
                    }}
                    aria-label="Remove photo"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 shadow-sm flex items-center justify-center font-bold cursor-pointer transition"
                  >
                    ×
                  </button>
                </div>
              )}

              {videoFileUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-slate-700">
                      Video Ready {videoFileSize ? `(${videoFileSize})` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null)
                        setVideoFileUrl(null)
                        setVideoThumbnailPreview(null)
                        setVideoFileSize(null)
                      }}
                      aria-label="Remove video"
                      className="w-7 h-7 rounded-full bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 flex items-center justify-center font-bold cursor-pointer transition"
                    >
                      ×
                    </button>
                  </div>
                  <div className="max-w-[260px] mx-auto">
                    <SocialVideoEmbed url={videoFileUrl} />
                  </div>
                </div>
              )}

              {showSocialInput && (
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Paste Facebook or Instagram Reel Link
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSocialInput(false)
                        setSocialLink('')
                        setNormalizedSocial(null)
                        setSocialParseError(null)
                      }}
                      className="text-slate-400 hover:text-slate-700 px-1.5 font-bold cursor-pointer"
                      aria-label="Close social link input"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={socialLink}
                      onChange={(e) => {
                        setMediaTab('social')
                        handleSocialUrlChange(e.target.value)
                      }}
                      placeholder="https://www.facebook.com/reel/..."
                      className="flex-1 min-h-[42px] bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTab('social')
                        handlePasteFromClipboard()
                      }}
                      className="min-h-[42px] px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer"
                    >
                      Paste
                    </button>
                  </div>

                  {socialParseError && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-medium">
                      {socialParseError}
                    </p>
                  )}

                  {normalizedSocial && (
                    <div className="pt-1 max-w-[260px] mx-auto">
                      <SocialVideoEmbed url={normalizedSocial.url} />
                    </div>
                  )}
                </div>
              )}

              {/* Facebook-Style 4-Tile Quick Action Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => photoOnlyInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    mediaTab === 'photo' && photoDataUrl
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span>Photo / Flyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => videoOnlyInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    mediaTab === 'video' && videoFileUrl
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="m10 8 6 4-6 4V8Z" />
                  </svg>
                  <span>Video / Reel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSocialInput(true)
                    setMediaTab('social')
                    setPhotoFile(null)
                    setPhotoDataUrl(null)
                    setVideoFile(null)
                    setVideoFileUrl(null)
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    showSocialInput
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>Social Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSummaryInput(!showSummaryInput)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    showSummaryInput || extendedSummary
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                  </svg>
                  <span>Extra Details</span>
                </button>
              </div>

              {/* Facebook-Style Post Settings Rows */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-900 px-1 pb-1">Post settings</p>

                {/* Silent Ambient Mode Toggle Switch */}
                <div className="flex items-center justify-between gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Start videos muted</p>
                    <p className="text-[11px] text-slate-500">Clean playback without sudden sound</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isSilentMode}
                    onClick={() => setIsSilentMode(!isSilentMode)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      isSilentMode ? 'bg-[#1877F2]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        isSilentMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Call-to-Action Button Expandable Row */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="w-full flex items-center justify-between gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">Call-to-action button</p>
                      <p className="text-[11px] text-slate-500">
                        {ctaPreset === 'none'
                          ? 'No button'
                          : ctaPreset === 'book'
                          ? 'Reserve Table (/contact)'
                          : ctaPreset === 'rooms'
                          ? 'View Rooms & Stay (/rooms)'
                          : ctaPreset === 'xmas'
                          ? 'Festive & Christmas Menu'
                          : ctaPreset === 'menu'
                          ? 'Explore Food & Drink'
                          : ctaPreset === 'gallery'
                          ? 'View Photo Gallery'
                          : ctaCustomText || 'Custom button link'}
                      </p>
                    </div>
                    <span className="text-slate-400 text-xs">{showMoreOptions ? '▾' : '▸'}</span>
                  </button>

                  {showMoreOptions && (
                    <div className="mt-1 mb-2 mx-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <select
                        value={ctaPreset}
                        onChange={(e) => setCtaPreset(e.target.value)}
                        className="w-full min-h-[40px] bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Button Text"
                            value={ctaCustomText}
                            onChange={(e) => setCtaCustomText(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="url"
                            placeholder="Button Link (/page or https://)"
                            value={ctaCustomLink}
                            onChange={(e) => setCtaCustomLink(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Anchored Bottom Facebook-Style Action Footer */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={handlePostSubmit}
                disabled={!isPostReady || isSubmitting}
                className={`w-full min-h-[46px] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isPostReady && !isSubmitting
                    ? 'bg-[#1877F2] hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isSubmitting ? uploadStatusText || 'Publishing...' : 'Post'}</span>
              </button>

              {postSuccessMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <span>✓</span>
                    <span>Posted! Your update is live on the pub website.</span>
                  </div>
                  {publishedItems[0] && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copyFormattedSocialPost(publishedItems[0])}
                        className="min-h-[38px] px-3 py-1.5 bg-[#1877F2] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Copy Facebook Post</span>
                      </button>
                      <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[38px] px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <span>Open FB ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
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
    </div>
  )
}
