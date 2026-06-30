import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters from '@/components/properties/PropertyFilters'
import type { Property } from '@/lib/types'

interface PropertiesPageProps {
  searchParams: {
    listing_type?: string
    city?: string
    property_type?: string
    min_price?: string
    max_price?: string
    bedrooms?: string
    sort?: string
    search?: string
  }
}

async function getProperties(searchParams: PropertiesPageProps['searchParams']): Promise<Property[]> {
  const supabase = createClient()

  let query = supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('status', 'published')

  if (searchParams.listing_type && searchParams.listing_type !== 'all') {
    query = query.eq('listing_type', searchParams.listing_type)
  }

  if (searchParams.city) {
    query = query.ilike('city', `%${searchParams.city}%`)
  }

  if (searchParams.property_type) {
    query = query.eq('property_type', searchParams.property_type)
  }

  if (searchParams.min_price) {
    query = query.gte('price', Number(searchParams.min_price))
  }

  if (searchParams.max_price) {
    query = query.lte('price', Number(searchParams.max_price))
  }

  if (searchParams.bedrooms) {
    query = query.gte('bedrooms', Number(searchParams.bedrooms))
  }

  if (searchParams.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,city.ilike.%${searchParams.search}%,neighborhood.ilike.%${searchParams.search}%`
    )
  }

  const sort = searchParams.sort || 'created_at_desc'
  const [sortField, sortDirection] = sort.split('_').reduce<[string, string]>(
    (acc, part, index, arr) => {
      if (index === arr.length - 1) {
        return [arr.slice(0, -1).join('_'), part]
      }
      return acc
    },
    ['created_at', 'desc']
  )

  query = query.order(sortField, { ascending: sortDirection === 'asc' })

  const { data } = await query

  return (data as Property[]) || []
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const properties = await getProperties(searchParams)

  const hasFilters = Object.values(searchParams).some(Boolean)

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-brand-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-3">
            Explore
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-wider">
            All Properties
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<div className="h-24 bg-stone-100 animate-pulse" />}>
          <PropertyFilters />
        </Suspense>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-brand-gray">
            <span className="font-semibold text-brand-black">{properties.length}</span>{' '}
            {properties.length === 1 ? 'property' : 'properties'} found
            {hasFilters && ' matching your criteria'}
          </p>
        </div>

        {/* Property Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 mb-6">
              <svg
                className="w-10 h-10 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-semibold text-brand-black mb-2">
              No Properties Found
            </h3>
            <p className="text-brand-gray text-sm max-w-md mx-auto">
              {hasFilters
                ? 'Try adjusting your search filters to find more properties.'
                : 'No properties are currently available. Please check back soon.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
