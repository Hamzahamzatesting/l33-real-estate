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
    <Link href={`/properties/${property.slug}`} className="block group">
      <div
        className={cn(
          'bg-white border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1',
          className
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {property.cover_image_url ? (
            <Image
              src={property.cover_image_url}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <svg
                className="w-12 h-12 mb-2 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
                <polyline
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  points="9 22 9 12 15 12 15 22"
                />
              </svg>
              <span className="text-xs uppercase tracking-widest">No Image</span>
            </div>
          )}

          {/* Listing type badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'px-3 py-1 text-xs font-semibold tracking-widest uppercase text-white',
                property.listing_type === 'buy' ? 'bg-brand-black' : 'bg-brand-gold'
              )}
            >
              {getListingTypeLabel(property.listing_type)}
            </span>
          </div>

          {/* Property type badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-white/90 text-brand-black">
              {getPropertyTypeLabel(property.property_type)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-brand-gray text-xs tracking-wider uppercase mb-2">
            <MapPin size={12} />
            <span>{property.neighborhood}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-semibold text-brand-black mb-3 line-clamp-2 group-hover:text-brand-gold transition-colors duration-200 leading-snug">
            {property.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-4 text-brand-gray text-sm mb-4 pb-4 border-b border-stone-100">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed size={14} />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath size={14} />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize2 size={14} />
              <span>{formatArea(property.surface_area)}</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-brand-gold font-heading text-xl font-bold tracking-wide">
            {formatPrice(property.price)}
            {property.listing_type === 'rent' && (
              <span className="text-brand-gray text-sm font-normal font-body ml-1">/mo</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
