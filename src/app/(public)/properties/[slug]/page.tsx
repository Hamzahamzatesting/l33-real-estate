import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Bed, Bath, Maximize2, Car, MapPin, Calendar, Tag } from 'lucide-react'
import { MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyGallery from '@/components/properties/PropertyGallery'
import ContactCTA from '@/components/properties/ContactCTA'
import { formatPrice, formatArea, getListingTypeLabel, getPropertyTypeLabel } from '@/lib/utils'
import { format } from 'date-fns'
import type { Property } from '@/lib/types'

interface PropertyDetailPageProps {
  params: { slug: string }
}

async function getProperty(slug: string): Promise<Property | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return data as Property | null
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getProperty(params.slug)

  if (!property) {
    return { title: 'Property Not Found' }
  }

  return {
    title: property.title,
    description: property.description?.slice(0, 160) || `${getPropertyTypeLabel(property.property_type)} in ${property.neighborhood}, ${property.city}`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 160),
      images: property.cover_image_url ? [property.cover_image_url] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getProperty(params.slug)

  if (!property) {
    notFound()
  }

  const sortedImages = [...(property.images || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const cleanPhone = (property.agent_phone || '212600000000')
    .replace(/\s+/g, '')
    .replace('+', '')

  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in: ${property.title} (Ref: ${property.reference_id})`
  )

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-brand-beige border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-brand-gray">
          <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
          <span>/</span>
          <a href="/properties" className="hover:text-brand-gold transition-colors">Properties</a>
          <span>/</span>
          <span className="text-brand-black font-medium truncate">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <PropertyGallery images={sortedImages} title={property.title} />

            {/* Title & Basic Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold tracking-widest uppercase text-white ${
                    property.listing_type === 'buy' ? 'bg-brand-black' : 'bg-brand-gold'
                  }`}
                >
                  {getListingTypeLabel(property.listing_type)}
                </span>
                <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-stone-100 text-brand-black">
                  {getPropertyTypeLabel(property.property_type)}
                </span>
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-black tracking-wide mb-4">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-brand-gray mb-6">
                <MapPin size={16} className="text-brand-gold" />
                <span className="text-sm">
                  {property.neighborhood}, {property.city}
                  {property.address && ` — ${property.address}`}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-heading text-4xl font-bold text-brand-gold">
                  {formatPrice(property.price)}
                </span>
                {property.listing_type === 'rent' && (
                  <span className="text-brand-gray text-sm">/month</span>
                )}
              </div>

              <p className="text-xs text-brand-gray tracking-widest uppercase">
                Reference: <span className="font-medium text-brand-black">{property.reference_id}</span>
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="bg-brand-beige p-4 text-center">
                  <Bed size={20} className="text-brand-gold mx-auto mb-2" />
                  <div className="font-heading text-2xl font-bold text-brand-black">{property.bedrooms}</div>
                  <div className="text-xs text-brand-gray uppercase tracking-wider">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="bg-brand-beige p-4 text-center">
                  <Bath size={20} className="text-brand-gold mx-auto mb-2" />
                  <div className="font-heading text-2xl font-bold text-brand-black">{property.bathrooms}</div>
                  <div className="text-xs text-brand-gray uppercase tracking-wider">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
                </div>
              )}
              <div className="bg-brand-beige p-4 text-center">
                <Maximize2 size={20} className="text-brand-gold mx-auto mb-2" />
                <div className="font-heading text-2xl font-bold text-brand-black">{property.surface_area}</div>
                <div className="text-xs text-brand-gray uppercase tracking-wider">m²</div>
              </div>
              {property.parking > 0 && (
                <div className="bg-brand-beige p-4 text-center">
                  <Car size={20} className="text-brand-gold mx-auto mb-2" />
                  <div className="font-heading text-2xl font-bold text-brand-black">{property.parking}</div>
                  <div className="text-xs text-brand-gray uppercase tracking-wider">Parking</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-4 tracking-wide border-b border-stone-200 pb-3">
                  Description
                </h2>
                <div className="text-brand-gray text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-4 tracking-wide border-b border-stone-200 pb-3">
                  Amenities & Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-beige border border-stone-200 text-sm text-brand-black"
                    >
                      <Tag size={12} className="text-brand-gold" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {property.video_url && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-4 tracking-wide border-b border-stone-200 pb-3">
                  Video Tour
                </h2>
                <div className="aspect-video">
                  <iframe
                    src={property.video_url}
                    className="w-full h-full"
                    allowFullScreen
                    title="Property video tour"
                  />
                </div>
              </div>
            )}

            {/* Map */}
            {property.map_url && (
              <div>
                <h2 className="font-heading text-xl font-semibold text-brand-black mb-4 tracking-wide border-b border-stone-200 pb-3">
                  Location
                </h2>
                <div className="aspect-video">
                  <iframe
                    src={property.map_url}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                    title="Property location"
                  />
                </div>
              </div>
            )}

            {/* Published date */}
            {property.published_at && (
              <div className="flex items-center gap-2 text-xs text-brand-gray border-t border-stone-200 pt-6">
                <Calendar size={14} />
                <span>
                  Listed on {format(new Date(property.published_at), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ContactCTA
              agentName={property.agent_name}
              agentPhone={property.agent_phone}
              propertyTitle={property.title}
              referenceId={property.reference_id}
            />
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white shadow-2xl hover:bg-[#1ebe57] transition-all duration-300 hover:scale-110 rounded-full"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  )
}
