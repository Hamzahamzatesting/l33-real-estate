import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize2, MapPin, ArrowUpRight } from 'lucide-react'
import { cn, formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug}`} className="block group">
      <div className={cn('bg-white overflow-hidden transition-all duration-500 group-hover:shadow-2xl', className)}>

        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
          {property.cover_image_url ? (
            <Image
              src={property.cover_image_url}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-300">
              <svg className="w-14 h-14 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-all duration-500" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={cn(
              'px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-white',
              property.listing_type === 'buy' ? 'bg-brand-black' : 'bg-brand-gold'
            )}>
              {getListingTypeLabel(property.listing_type)}
            </span>
          </div>

          {/* Arrow icon on hover */}
          <div className="absolute top-4 right-4 w-9 h-9 bg-brand-gold flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight size={16} className="text-white" />
          </div>

          {/* Price overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-black/80 to-transparent px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
            <div className="font-heading text-xl font-bold text-white tracking-wide">
              {formatPrice(property.price)}
              {property.listing_type === 'rent' && (
                <span className="text-white/60 text-sm font-normal font-body ml-1">/mo</span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 border border-t-0 border-stone-100 group-hover:border-brand-gold/30 transition-colors duration-500">
          {/* Type + Location */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-brand-gold text-[10px] tracking-[0.2em] uppercase font-semibold">
              {getPropertyTypeLabel(property.property_type)}
            </span>
            <div className="flex items-center gap-1 text-brand-gray text-[11px]">
              <MapPin size={10} />
              <span className="tracking-wide">{property.city}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-semibold text-brand-black mb-4 line-clamp-2 group-hover:text-brand-gold transition-colors duration-300 leading-snug tracking-wide">
            {property.title}
          </h3>

          {/* Stats row */}
          <div className="flex items-center gap-5 pt-4 border-t border-stone-100">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5 text-brand-gray">
                <Bed size={13} className="text-brand-gold" />
                <span className="text-xs tracking-wide">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5 text-brand-gray">
                <Bath size={13} className="text-brand-gold" />
                <span className="text-xs tracking-wide">{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-brand-gray ml-auto">
              <Maximize2 size={13} className="text-brand-gold" />
              <span className="text-xs tracking-wide">{formatArea(property.surface_area)}</span>
            </div>
          </div>

          {/* Price (visible by default, replaced by overlay on hover) */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="font-heading text-xl font-bold text-brand-gold tracking-wide group-hover:opacity-0 transition-opacity duration-300">
              {formatPrice(property.price)}
              {property.listing_type === 'rent' && (
                <span className="text-brand-gray text-sm font-normal font-body ml-1">/mo</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
