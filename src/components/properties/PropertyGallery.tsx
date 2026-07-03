'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { PropertyImage } from '@/lib/types'
import { cn } from '@/lib/utils'
import Watermark from '@/components/ui/Watermark'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  useEffect(() => {
    if (!isLightboxOpen) return

    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen, handlePrev, handleNext])

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] bg-stone-100 flex flex-col items-center justify-center text-stone-400">
        <svg className="w-16 h-16 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-sm uppercase tracking-widest">No Images Available</span>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  const lightbox = isLightboxOpen ? (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={() => setIsLightboxOpen(false)}
    >
      <button
        onClick={() => setIsLightboxOpen(false)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2 transition-colors z-10"
        aria-label="Close"
      >
        <X size={28} />
      </button>

      <div
        className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={activeImage.image_url}
          alt={activeImage.alt_text || `${title} - Image ${activeIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        <Watermark />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-4 py-2 tracking-wider">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  ) : null

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="relative aspect-[16/9] overflow-hidden bg-stone-900 group cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={activeImage.image_url}
            alt={activeImage.alt_text || `${title} - Image ${activeIndex + 1}`}
            fill
            className="object-contain transition-opacity duration-300"
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 100vw, 70vw"
          />
          <Watermark />

          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-brand-black/70 text-white p-3 rounded-full">
              <ZoomIn size={22} />
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-brand-black/60 hover:bg-brand-black/80 text-white p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-black/60 hover:bg-brand-black/80 text-white p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-brand-black/70 text-white text-xs px-3 py-1.5 tracking-wider">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative shrink-0 w-20 h-16 overflow-hidden transition-all duration-200',
                  index === activeIndex
                    ? 'ring-2 ring-brand-gold ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <Watermark />
              </button>
            ))}
          </div>
        )}
      </div>

      {mounted && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  )
}
