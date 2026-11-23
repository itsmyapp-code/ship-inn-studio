'use client'

import React, { useState } from 'react'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'
import { normalizeSocialUrl } from '@/lib/socialUrlHelper'

interface SocialVideoEmbedProps {
  url: string
  title?: string
  posterUrl?: string
  className?: string
  musicUrl?: string
  musicTitle?: string
  musicArtist?: string
  musicVolume?: number
  muteOriginalVideo?: boolean
  overlayText?: string
  overlayPosition?: 'top' | 'center' | 'bottom'
  overlayStyle?: 'brand' | 'bold' | 'clean' | 'orange'
}

export default function SocialVideoEmbed({
  url,
  title = 'Social Video',
  posterUrl,
  className = '',
  musicUrl,
  musicTitle,
  musicArtist,
  musicVolume = 0.7,
  muteOriginalVideo = true,
  overlayText,
  overlayPosition = 'bottom',
  overlayStyle = 'brand',
}: SocialVideoEmbedProps) {
  const [loadIframe, setLoadIframe] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicMuted, setMusicMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const { consent } = useCookieConsent()

  const hasMusic = Boolean(musicUrl && musicUrl.trim())
  const clampedMusicVolume = Math.max(0, Math.min(1, typeof musicVolume === 'number' ? musicVolume : 0.7))

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = hasMusic && muteOriginalVideo
    }
    if (audioRef.current) {
      audioRef.current.volume = clampedMusicVolume
      audioRef.current.muted = musicMuted
    }
  }, [hasMusic, muteOriginalVideo, clampedMusicVolume, musicMuted])

  if (!url || typeof url !== 'string' || !url.trim()) return null

  const cleanUrl = url.trim()

  // 1. Detect Facebook Reels & Videos vs Photos & Posts
  const isFacebook =
    cleanUrl.includes('facebook.com') ||
    cleanUrl.includes('fb.watch') ||
    cleanUrl.includes('fb.me')

  const isFacebookPhotoOrPost =
    isFacebook &&
    (cleanUrl.includes('/photo') ||
      cleanUrl.includes('/photos') ||
      cleanUrl.includes('/posts') ||
      cleanUrl.includes('fbid=') ||
      cleanUrl.includes('/share/p/'))

  // 2. Detect Instagram Reels
  const isInstagram =
    cleanUrl.includes('instagram.com/reel/') ||
    cleanUrl.includes('instagram.com/reels/') ||
    cleanUrl.includes('instagram.com/p/')

  // 3. Detect YouTube Shorts & Videos
  const isYouTubeShort = cleanUrl.includes('youtube.com/shorts/')
  const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')

  // 4. Detect Direct Video (Uploaded file, Blob URL, MP4, MOV, WebM)
  const isDirectVideo =
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('data:video') ||
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.includes('.mp4?') ||
    cleanUrl.includes('.mov?') ||
    cleanUrl.includes('.webm?') ||
    cleanUrl.includes('blob.vercel-storage.com')

  // Construct YouTube Embed URL
  const getYouTubeEmbedUrl = (raw: string) => {
    if (raw.includes('/shorts/')) {
      const id = raw.split('/shorts/')[1]?.split('?')[0]?.split('/')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&rel=0`
    }
    if (raw.includes('youtu.be/')) {
      const id = raw.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (raw.includes('watch?v=')) {
      const id = raw.split('watch?v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    return raw
  }

  // Construct Facebook Reel or Post Embed URL
  const getFacebookEmbedUrl = (raw: string) => {
    if (raw.includes('<iframe')) {
      const srcMatch = raw.match(/src=["'](.*?)["']/)
      if (srcMatch) return srcMatch[1]
    }

    let clean = raw.trim()
    try {
      const u = new URL(clean)
      u.searchParams.delete('mibextid')
      u.searchParams.delete('rdid')
      u.searchParams.delete('share_url')
      u.searchParams.delete('sfnsn')
      if (!isFacebookPhotoOrPost) {
        clean = u.origin + u.pathname
      } else {
        clean = u.toString()
      }
    } catch {}

    const encoded = encodeURIComponent(clean)
    if (isFacebookPhotoOrPost) {
      return `https://www.facebook.com/plugins/post.php?href=${encoded}&width=350&show_text=true&mute=1`
    }
    return `https://www.facebook.com/plugins/video.php?height=476&href=${encoded}&show_text=false&width=267&mute=1`
  }

  // Construct Instagram Direct Embed URL (Clean 9:16 direct embed without embed.js)
  const getInstagramEmbedInfo = (raw: string) => {
    try {
      const norm = normalizeSocialUrl(raw)
      if (norm.platform === 'instagram') {
        return { embedUrl: norm.embedUrl, canonicalUrl: norm.url }
      }
    } catch {}
    const match = raw.match(/\/(reel|reels|p)\/([a-zA-Z0-9_-]+)/)
    const shortcode = match ? match[2] : ''
    return {
      embedUrl: shortcode ? `https://www.instagram.com/reel/${shortcode}/embed/` : raw,
      canonicalUrl: shortcode ? `https://www.instagram.com/reel/${shortcode}/` : raw,
    }
  }

  const instagramInfo = isInstagram ? getInstagramEmbedInfo(cleanUrl) : null

  // Vertical Aspect (9:16) for Reels & Shorts
  const isVertical = isFacebook || isInstagram || isYouTubeShort

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg ${
        isVertical ? 'max-w-[340px] mx-auto aspect-9/16' : 'w-full aspect-16/9'
      } ${className}`}
    >
      {/* Cookie Consent Denied Fallback Card */}
      {consent === 'denied' && (isFacebook || isInstagram || isYouTube) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-amber-400">
              {isInstagram ? '📸 Instagram Reel' : isFacebook ? '📘 Facebook Video' : '▶️ YouTube Video'}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
              Cookies Required
            </span>
          </div>

          <div className="my-auto flex flex-col items-center">
            <span className="text-3xl mb-2">{isInstagram ? '📸' : '📘'}</span>
            <p className="text-sm font-semibold text-white">{title || 'Social Video'}</p>
            <p className="text-xs text-slate-400 max-w-[240px] mt-1.5 leading-relaxed">
              Third-party cookies are blocked. You can watch this video directly on {isInstagram ? 'Instagram' : 'Facebook'}.
            </p>
            <a
              href={instagramInfo?.canonicalUrl || cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 px-4 py-2 text-white font-bold text-xs rounded-full shadow-lg transition ${
                isInstagram
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Open on {isInstagram ? 'Instagram' : 'Facebook'} &rarr;
            </a>
          </div>

          <div className="w-full pt-3 border-t border-slate-800 text-center">
            <span className="text-slate-500 text-[11px]">The Ship Inn, Porlock Weir</span>
          </div>
        </div>
      ) : !loadIframe && !isDirectVideo ? (
        /* Click-to-Play Facade for Zero Page Bloat & High Privacy */
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              {isFacebook && (
                <>
                  <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>{isFacebookPhotoOrPost ? 'Facebook Post / Photo' : 'Facebook Reel'}</span>
                </>
              )}
              {isInstagram && <span>📸 Instagram Reel</span>}
              {isYouTube && <span>YouTube Video</span>}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
              {isFacebookPhotoOrPost ? 'Embedded Post' : 'Interactive Media'}
            </span>
          </div>

          <div className="my-auto flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLoadIframe(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transform hover:scale-110 transition cursor-pointer group mb-3"
              aria-label="Load content"
            >
              {isFacebookPhotoOrPost ? (
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 ml-1 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <p className="text-sm font-semibold text-white drop-shadow-sm">
              {isFacebookPhotoOrPost ? 'Tap to Load Facebook Post' : isInstagram ? 'Tap to Play Instagram Reel' : 'Tap to Play Reel'}
            </p>
            <p className="text-xs text-slate-400 max-w-[240px] mt-1 leading-relaxed">
              Plays seamlessly right here on the pub website
            </p>
          </div>

          <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] truncate max-w-[170px]">
              {title}
            </span>
            <a
              href={instagramInfo?.canonicalUrl || cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1 text-[11px]"
            >
              <span>View Source</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      ) : isDirectVideo ? (
        <div className="relative w-full h-full bg-black flex items-center justify-center group">
          {!isPlaying && (
            <button
              type="button"
              onClick={() => {
                setIsPlaying(true)
                setMusicMuted(false)
                if (audioRef.current && hasMusic) {
                  try {
                    audioRef.current.currentTime = 0
                  } catch {}
                  audioRef.current.volume = clampedMusicVolume
                  audioRef.current.muted = false
                  audioRef.current.play().catch(() => {})
                }
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.muted = hasMusic && muteOriginalVideo
                    videoRef.current.play().catch(() => {
                      if (videoRef.current) {
                        videoRef.current.muted = true
                        videoRef.current.play().catch(() => {})
                      }
                    })
                  }
                }, 0)
              }}
              className="relative w-full h-full block bg-slate-950 cursor-pointer overflow-hidden"
              aria-label={`Play ${title}`}
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <video
                  src={`${cleanUrl}#t=0.1`}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/30" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl ring-4 ring-black/40 transition-transform group-hover:scale-110">
                <svg className="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}

          <video
            ref={videoRef}
            src={cleanUrl}
            poster={posterUrl}
            controls={isPlaying}
            loop
            playsInline
            muted={hasMusic && muteOriginalVideo}
            onPlay={() => {
              setIsPlaying(true)
              if (audioRef.current && hasMusic && !musicMuted) {
                if (videoRef.current && audioRef.current.duration && isFinite(audioRef.current.duration)) {
                  audioRef.current.currentTime = videoRef.current.currentTime % audioRef.current.duration
                }
                audioRef.current.volume = clampedMusicVolume
                audioRef.current.muted = false
                audioRef.current.play().catch(() => {})
              }
            }}
            onPause={() => {
              if (audioRef.current) audioRef.current.pause()
            }}
            onSeeked={() => {
              if (audioRef.current && videoRef.current && audioRef.current.duration && isFinite(audioRef.current.duration)) {
                audioRef.current.currentTime = videoRef.current.currentTime % audioRef.current.duration
              }
            }}
            className={`w-full h-full object-contain bg-black ${isPlaying ? 'block' : 'hidden'}`}
          />

          {hasMusic && (
            <audio ref={audioRef} src={musicUrl} loop preload="auto" className="hidden" />
          )}

          {hasMusic && isPlaying && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                const nextMuted = !musicMuted
                setMusicMuted(nextMuted)
                if (audioRef.current) {
                  audioRef.current.muted = nextMuted
                  if (nextMuted) {
                    audioRef.current.pause()
                  } else {
                    audioRef.current.volume = clampedMusicVolume
                    audioRef.current.play().catch(() => {})
                  }
                }
              }}
              className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 hover:bg-black text-white text-[11px] font-bold border border-amber-400/50 shadow-lg backdrop-blur-md cursor-pointer transition max-w-[60%]"
              title={musicMuted ? 'Unmute background music' : 'Mute background music'}
            >
              <span className={musicMuted ? 'text-slate-400' : 'text-amber-400'}>
                {musicMuted ? '🔇' : '🔊'}
              </span>
              <span className="truncate">{musicTitle || 'Music'}</span>
            </button>
          )}

          {overlayText && overlayText.trim() && (
            <div
              className={`absolute left-3 right-3 z-20 pointer-events-none flex justify-center ${
                overlayPosition === 'top'
                  ? 'top-12'
                  : overlayPosition === 'center'
                  ? isPlaying
                    ? 'top-1/2 -translate-y-1/2'
                    : 'top-[22%]'
                  : isPlaying
                  ? 'bottom-14'
                  : 'bottom-11'
              }`}
            >
              <span
                className={`px-3.5 py-1.5 rounded-xl text-center text-xs sm:text-sm font-extrabold leading-snug max-w-[92%] break-words shadow-xl ${
                  overlayStyle === 'bold'
                    ? 'bg-black/80 text-white border border-white/25 backdrop-blur-md uppercase tracking-wide'
                    : overlayStyle === 'clean'
                    ? 'bg-white/95 text-slate-900 border border-slate-200'
                    : overlayStyle === 'orange'
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF9F1C] text-white border border-white/20'
                    : 'bg-[#0A192F]/90 text-amber-300 border border-amber-400/45 backdrop-blur-md'
                }`}
              >
                {overlayText.trim()}
              </span>
            </div>
          )}

          {hasMusic && !isPlaying && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 pointer-events-none flex justify-start">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/15 max-w-[85%] truncate shadow">
                <span className="text-amber-400">♪</span>
                <span className="truncate">
                  {musicTitle || 'Background Music'}
                  {musicArtist ? ` · ${musicArtist}` : ''}
                </span>
              </span>
            </div>
          )}
        </div>
      ) : isFacebook ? (
        <div className="relative w-full h-full bg-black flex flex-col justify-between">
          <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
            <iframe
              src={getFacebookEmbedUrl(cleanUrl)}
              className="w-full h-full border-none overflow-hidden"
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              onError={() => setHasError(true)}
            />
          </div>
          <div className="bg-slate-900 border-t border-slate-800 p-2.5 flex items-center justify-between text-xs z-20">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 fill-blue-500" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{isFacebookPhotoOrPost ? 'Facebook Post / Photo' : 'Facebook Reel'}</span>
            </span>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition"
            >
              <span>{isFacebookPhotoOrPost ? 'View on Facebook' : 'Watch on Facebook'}</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      ) : isInstagram && instagramInfo ? (
        /* Pure 9:16 borderless Instagram player matching Facebook pixel-for-pixel */
        <iframe
          src={instagramInfo.embedUrl}
          title={title || 'Instagram Reel'}
          className="w-full h-full aspect-9/16 border-0 overflow-hidden"
          loading="lazy"
          allowFullScreen
          scrolling="no"
          onError={() => setHasError(true)}
        />
      ) : isYouTube ? (
        <iframe
          src={getYouTubeEmbedUrl(cleanUrl)}
          title={title}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
          <p className="text-sm font-semibold mb-2">Unsupported Video Format</p>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-amber-400 underline"
          >
            Open Link in New Tab ↗
          </a>
        </div>
      )}
    </div>
  )
}
