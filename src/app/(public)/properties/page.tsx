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
      if (index === arr.length - 1) return [arr.slice(0, -1).join('_'), part]
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

  return (
    <div>
      {/* Dark header — starts at very top, padding-top offsets the fixed navbar */}
      <div className="bg-[#0a0a0a] pt-36 pb-16 px-8 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#c9a84c]/50 text-[10px] tracking-[0.5em] uppercase mb-4 font-medium">
            L33 Real Estate
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            All Properties
          </h1>
        </div>
      </div>

      {/* Filter + Grid */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 py-12">

          {/* Filters */}
          <Suspense fallback={<div className="h-16 mb-10" />}>
            <PropertyFilters />
          </Suspense>

          {/* Count */}
          <p className="text-stone-400 text-xs tracking-[0.2em] uppercase mb-10">
            <span className="text-[#0a0a0a] font-semibold">{properties.length}</span>{' '}
            {properties.length === 1 ? 'property' : 'properties'} found
          </p>

          {/* Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center border border-dashed border-stone-200">
              <p className="font-heading text-2xl text-stone-300 mb-3">No properties found</p>
              <p className="text-stone-400 text-sm">Try adjusting your filters above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
