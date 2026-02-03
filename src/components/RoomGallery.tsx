'use client'

import { useState } from 'react'
import Image from 'next/image'

interface RoomImage {
  src: string
  alt: string
  caption?: string
}

interface RoomGalleryProps {
  images: RoomImage[]
  roomName: string
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-ship-blue-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    )
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative h-64 cursor-pointer group overflow-hidden rounded-lg"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>

        {/* Thumbnail Grid (if more than 1 image) */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((image, index) => (
              <div
                key={index + 1}
                className="relative h-16 cursor-pointer group overflow-hidden rounded"
                onClick={() => openLightbox(index + 1)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>
            ))}
            {images.length === 2 && (
              <div className="col-span-2 flex items-center justify-center text-sm text-gray-500 bg-gray-100 rounded">
                <span>+{images.length - 1} photo{images.length > 2 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Image */}
            <div className="relative">
              <img
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Navigation Arrows (if more than 1 image) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Image Caption */}
            {images[currentImageIndex].caption && (
              <p className="text-white text-center mt-4 text-sm">
                {images[currentImageIndex].caption}
              </p>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="text-white text-center mt-2 text-sm">
                {currentImageIndex + 1} of {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}