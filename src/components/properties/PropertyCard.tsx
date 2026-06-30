'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react'
import { cn, formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug}`} className={cn('block group', className)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 mb-5" style={{ aspectRatio: '4 / 3' }}>
        {property.cover_image_url ? (
          <Image
            src={property.cover_image_url}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-stone-250" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            'text-[9px] tracking-[0.25em] uppercase font-bold px-2.5 py-1 text-white',
            property.listing_type === 'buy' ? 'bg-[#0a0a0a]' : 'bg-[#c9a84c]'
          )}>
            {getListingTypeLabel(property.listing_type)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        {/* Type + City */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase font-semibold">
            {getPropertyTypeLabel(property.property_type)}
          </span>
          <span className="flex items-center gap-1 text-stone-400 text-[10px] tracking-wide">
            <MapPin size={9} />
            {property.neighborhood}, {property.city}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-[1.15rem] font-semibold text-[#0a0a0a] leading-snug mb-3 line-clamp-1 group-hover:text-[#c9a84c] transition-colors duration-300">
          {property.title}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-stone-400 text-[11px] mb-4">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed size={11} />
              {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={11} />
              {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Maximize2 size={11} />
            {formatArea(property.surface_area)}
          </span>
        </div>

        {/* Divider + Price */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="font-heading text-[1.2rem] font-bold text-[#0a0a0a]">
            {formatPrice(property.price)}
            {property.listing_type === 'rent' && (
              <span className="text-stone-400 text-xs font-normal font-sans ml-1">/mo</span>
            )}
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-300 group-hover:text-[#c9a84c] transition-colors duration-300 font-medium">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
