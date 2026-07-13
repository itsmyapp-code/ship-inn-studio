'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface HeroCarouselProps {
  images: string[]
  alt: string
}

export default function HeroCarousel({ images, alt }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter out any empty strings and fix double-slash paths
  const validImages = images
    .filter(img => img && img.trim() !== '')
    .map(img => img.replace(/^\/\//, '/')) // Fix //images/ → /images/

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
  }, [validImages.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  useEffect(() => {
    if (validImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [validImages.length])

  if (validImages.length === 0) {
    return (
      <div className="absolute inset-0 hero-ken-burns">
        <Image
          src="/images/exterior/shipinn-011.webp"
          alt={alt}
          fill
          priority
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <>
      {/* Images with Ken Burns zoom/pan effect */}
      {validImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`absolute inset-0 ${
              index === currentIndex ? 'animate-ken-burns' : ''
            }`}
            style={{
              // Alternate zoom directions for visual variety
              animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
            }}
          >
            <Image
              src={src}
              alt={`${alt} - View ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* Slide indicators and navigation — only show if more than 1 image */}
      {validImages.length > 1 && (
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border-2 border-white/60 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full border-2 border-white/60 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Ken Burns animation styles */}
      <style jsx global>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.12) translate(-1.5%, -1%);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        .animate-ken-burns {
          animation: ken-burns 12s ease-in-out infinite;
        }
        .duration-1500 {
          transition-duration: 1500ms;
        }
      `}</style>
    </>
  )
}
