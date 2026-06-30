'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Tangier',
  'Agadir',
  'Meknes',
  'Oujda',
]

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'office', label: 'Office' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function PropertyFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const updateFilter = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value })
    router.push(`${pathname}?${queryString}`, { scroll: false })
  }

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false })
  }

  const currentListingType = searchParams.get('listing_type') || 'all'
  const currentCity = searchParams.get('city') || ''
  const currentPropertyType = searchParams.get('property_type') || ''
  const currentMinPrice = searchParams.get('min_price') || ''
  const currentMaxPrice = searchParams.get('max_price') || ''
  const currentBedrooms = searchParams.get('bedrooms') || ''
  const currentSort = searchParams.get('sort') || 'created_at_desc'
  const currentSearch = searchParams.get('search') || ''

  const hasActiveFilters =
    currentListingType !== 'all' ||
    currentCity ||
    currentPropertyType ||
    currentMinPrice ||
    currentMaxPrice ||
    currentBedrooms ||
    currentSort !== 'created_at_desc' ||
    currentSearch

  return (
    <div className="bg-white border border-stone-200 p-6 mb-8">
      {/* Top row: search + toggle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" />
          <input
            type="text"
            placeholder="Search by title, city, neighborhood..."
            value={currentSearch}
            onChange={(e) => updateFilter('search', e.target.value || null)}
            className="w-full pl-10 pr-4 py-3 border border-stone-300 text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 border text-sm font-medium tracking-wide transition-all duration-200',
            showFilters
              ? 'bg-brand-black text-white border-brand-black'
              : 'border-stone-300 text-brand-black hover:border-brand-gold hover:text-brand-gold'
          )}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-brand-gold rounded-full" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-3 text-sm text-brand-gray hover:text-red-500 transition-colors duration-200"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Listing type toggle */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { value: 'all', label: 'All' },
          { value: 'buy', label: 'Buy' },
          { value: 'rent', label: 'Rent' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() =>
              updateFilter(
                'listing_type',
                option.value === 'all' ? null : option.value
              )
            }
            className={cn(
              'px-5 py-2 text-sm font-medium tracking-widest uppercase transition-all duration-200',
              currentListingType === option.value
                ? 'bg-brand-gold text-white'
                : 'bg-stone-100 text-brand-gray hover:bg-stone-200'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-stone-100">
          {/* City */}
          <select
            value={currentCity}
            onChange={(e) => updateFilter('city', e.target.value || null)}
            className="px-3 py-2.5 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Property Type */}
          <select
            value={currentPropertyType}
            onChange={(e) => updateFilter('property_type', e.target.value || null)}
            className="px-3 py-2.5 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price"
            value={currentMinPrice}
            onChange={(e) => updateFilter('min_price', e.target.value || null)}
            className="px-3 py-2.5 border border-stone-300 text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max Price"
            value={currentMaxPrice}
            onChange={(e) => updateFilter('max_price', e.target.value || null)}
            className="px-3 py-2.5 border border-stone-300 text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          />

          {/* Bedrooms */}
          <select
            value={currentBedrooms}
            onChange={(e) => updateFilter('bedrooms', e.target.value || null)}
            className="px-3 py-2.5 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">Any Bedrooms</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+ Bed{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-3 py-2.5 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
