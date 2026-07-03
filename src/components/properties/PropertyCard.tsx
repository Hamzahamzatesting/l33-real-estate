import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize2, MapPin, ArrowRight } from 'lucide-react'
import { cn, formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils'
import type { Property } from '@/lib/types'
import Watermark from '@/components/ui/Watermark'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug}`} className={cn('block group', className)}>

      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 mb-0" style={{ aspectRatio: '4 / 3' }}>
        {property.cover_image_url ? (
          <Image
            src={property.cover_image_url}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center gap-2">
            <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-stone-300 text-[10px] tracking-widest uppercase">No Image</span>
          </div>
        )}

        {property.cover_image_url && <Watermark />}

        {/* Listing type badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 text-white',
            property.listing_type === 'buy' ? 'bg-[#0a0a0a]' : 'bg-[#c9a84c]'
          )}>
            {getListingTypeLabel(property.listing_type)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-white border border-stone-100 group-hover:border-[#c9a84c]/40 transition-colors duration-300 p-5">

        {/* Price — most important, show it first and big */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-heading text-2xl font-bold text-[#0a0a0a] leading-none">
              {formatPrice(property.price)}
            </p>
            {property.listing_type === 'rent' && (
              <p className="text-stone-400 text-xs mt-1">/month</p>
            )}
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#c9a84c] bg-[#c9a84c]/8 px-2.5 py-1.5 mt-0.5">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-semibold text-[#0a0a0a] leading-snug mb-3 line-clamp-2 group-hover:text-[#c9a84c] transition-colors duration-300">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-4">
          <MapPin size={11} className="text-[#c9a84c] flex-shrink-0" />
          <span>{property.neighborhood}, {property.city}</span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-0 border border-stone-100 divide-x divide-stone-100">
          {property.bedrooms > 0 && (
            <div className="flex-1 flex flex-col items-center py-2.5 gap-1">
              <Bed size={14} className="text-stone-400" />
              <span className="text-xs font-semibold text-[#0a0a0a]">{property.bedrooms}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400">Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex-1 flex flex-col items-center py-2.5 gap-1">
              <Bath size={14} className="text-stone-400" />
              <span className="text-xs font-semibold text-[#0a0a0a]">{property.bathrooms}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400">Baths</span>
            </div>
          )}
          <div className="flex-1 flex flex-col items-center py-2.5 gap-1">
            <Maximize2 size={14} className="text-stone-400" />
            <span className="text-xs font-semibold text-[#0a0a0a]">{formatArea(property.surface_area)}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-400">Area</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-medium">
            Ref: {property.reference_id}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-semibold text-[#0a0a0a] group-hover:text-[#c9a84c] transition-colors duration-300">
            View Property
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
