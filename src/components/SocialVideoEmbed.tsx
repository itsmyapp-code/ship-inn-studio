'use client'

import React, { useState } from 'react'

interface SocialVideoEmbedProps {
  url: string
  title?: string
  className?: string
}

export default function SocialVideoEmbed({
  url,
  title = 'Social Video',
  className = ''
}: SocialVideoEmbedProps) {
  const [loadIframe, setLoadIframe] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (!url || typeof url !== 'string' || !url.trim()) return null

  const cleanUrl = url.trim()

  // 1. Detect Facebook Reels & Videos
  // Formats:
  // - https://www.facebook.com/reel/1234567890/
  // - https://www.facebook.com/share/r/xyz123/
  // - https://www.facebook.com/watch/?v=1234567890
  // - https://fb.watch/xyz123/
  const isFacebook =
    cleanUrl.includes('facebook.com') ||
    cleanUrl.includes('fb.watch') ||
    cleanUrl.includes('fb.me')

  // 2. Detect Instagram Reels
  const isInstagram = cleanUrl.includes('instagram.com/reel/') || cleanUrl.includes('instagram.com/p/')

  // 3. Detect YouTube Shorts & Videos
  const isYouTubeShort = cleanUrl.includes('youtube.com/shorts/')
  const isYouTube = cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')

  // 4. Detect Direct MP4
  const isDirectMp4 = cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm')

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

  // Construct Facebook Reel Embed URL
  const getFacebookEmbedUrl = (raw: string) => {
    const encoded = encodeURIComponent(raw)
    return `https://www.facebook.com/plugins/video.php?height=580&href=${encoded}&show_text=false&width=320`
  }

  // Vertical Aspect (9:16) for Reels & Shorts
  const isVertical = isFacebook || isInstagram || isYouTubeShort

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg ${
        isVertical ? 'max-w-[340px] mx-auto aspect-9/16' : 'w-full aspect-16/9'
      } ${className}`}
    >
      {/* Click-to-Play Facade for Zero Page Bloat & High Privacy */}
      {!loadIframe && !isDirectMp4 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              {isFacebook && (
                <>
                  <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook Reel</span>
                </>
              )}
              {isInstagram && <span>Instagram Reel</span>}
              {isYouTube && <span>YouTube Video</span>}
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
              Interactive Media
            </span>
          </div>

          <div className="my-auto flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLoadIframe(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transform hover:scale-110 transition cursor-pointer group mb-3"
              aria-label="Play video"
            >
              <svg className="w-7 h-7 ml-1 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p className="text-sm font-semibold text-white drop-shadow-sm">
              Tap to Play Reel
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
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1 text-[11px]"
            >
              <span>View Source</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      ) : isDirectMp4 ? (
        <video
          src={cleanUrl}
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      ) : isFacebook ? (
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <iframe
            src={getFacebookEmbedUrl(cleanUrl)}
            className="w-full h-full border-none overflow-hidden"
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            onError={() => setHasError(true)}
          />
          {hasError && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
              <p className="text-sm font-semibold mb-2">Facebook Privacy Block</p>
              <p className="text-xs text-slate-400 mb-4">
                Your browser privacy settings blocked the Facebook embed.
              </p>
              <a
                href={cleanUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition"
              >
                Watch Directly on Facebook ↗
              </a>
            </div>
          )}
        </div>
      ) : isYouTube ? (
        <iframe
          src={getYouTubeEmbedUrl(cleanUrl)}
          title={title}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : isInstagram ? (
        <iframe
          src={`${cleanUrl.replace(/\/$/, '')}/embed/captioned/`}
          title={title}
          className="w-full h-full border-none bg-white"
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

