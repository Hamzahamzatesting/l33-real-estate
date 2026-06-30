'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PropertyImage } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100 group">
        <Image
          src={images[activeIndex].image_url}
          alt={images[activeIndex].alt_text || `${title} - Image ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 70vw"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-brand-black/60 hover:bg-brand-black/80 text-white p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
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
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
