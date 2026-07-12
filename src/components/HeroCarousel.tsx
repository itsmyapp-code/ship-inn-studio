'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroCarouselProps {
  images: string[]
  alt: string
}

export default function HeroCarousel({ images, alt }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter out any empty strings
  const validImages = images.filter(img => img && img.trim() !== '')

  useEffect(() => {
    // If only 1 or 0 images, no need to cycle
    if (validImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length)
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(interval)
  }, [validImages.length])

  if (validImages.length === 0) {
    // Fallback if absolutely no images are provided
    return (
      <Image
        src="/images/exterior/shipinn-011.webp"
        alt={alt}
        fill
        priority
        className="object-cover"
      />
    )
  }

  return (
    <>
      {validImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={`${alt} - View ${index + 1}`}
            fill
            priority={index === 0} // Only prioritize the first image to load fast
            className="object-cover"
          />
        </div>
      ))}
    </>
  )
}
