'use client'

import React, { useRef, useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface FireplaceVideoPlayerProps {
  src?: string
  poster?: string
  className?: string
}

export default function FireplaceVideoPlayer({
  src = '/videos/ship-inn-fireplace.mp4',
  poster = '/videos/ship-inn-fireplace-thumb.webp',
  className = '',
}: FireplaceVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch(err => {
        // Autoplay may be restricted by device battery saver or browser policy
        console.log('Autoplay restriction handled:', err)
        setIsPlaying(false)
      })
    }
  }, [])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
    trackEvent('Fireplace Video Sound Toggle', { muted: nextMuted })
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
      trackEvent('Fireplace Video Play')
    } else {
      video.pause()
      setIsPlaying(false)
      trackEvent('Fireplace Video Pause')
    }
  }

  return (
    <div
      onClick={togglePlay}
      className={`relative w-full h-full min-h-[360px] lg:min-h-[460px] cursor-pointer group overflow-hidden bg-black ${className}`}
      title="Click to play / pause fireplace video"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Subtle bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Controls Overlay: Sound Toggle Pill */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute fireplace audio' : 'Mute fireplace audio'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-amber-400/50 text-amber-300 text-xs font-semibold backdrop-blur-md transition-all shadow-xl hover:scale-105"
        >
          {isMuted ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              <span>Hear Fireplace</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <span>Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* Play/Pause indicator icon when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none transition-all">
          <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
