'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 'Meknes', 'Oujda']
const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'office', label: 'Office' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]
const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
]

export default function PropertyFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key)
        else params.set(key, value)
      })
      return params.toString()
    },
    [searchParams]
  )

  const updateFilter = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`, { scroll: false })
  }

  const currentListingType = searchParams.get('listing_type') || 'all'
  const currentCity = searchParams.get('city') || ''
  const currentPropertyType = searchParams.get('property_type') || ''
  const currentMinPrice = searchParams.get('min_price') || ''
  const currentMaxPrice = searchParams.get('max_price') || ''
  const currentSort = searchParams.get('sort') || 'created_at_desc'
  const currentSearch = searchParams.get('search') || ''

  const hasActiveFilters =
    currentListingType !== 'all' || currentCity || currentPropertyType ||
    currentMinPrice || currentMaxPrice || currentSort !== 'created_at_desc' || currentSearch

  const selectClass = "bg-transparent border-0 border-b border-stone-200 text-[#0a0a0a] text-xs tracking-wide py-2.5 pr-6 focus:outline-none focus:border-[#c9a84c] cursor-pointer appearance-none transition-colors duration-200 hover:border-stone-400"

  return (
    <div className="mb-12">
      {/* Buy / Rent / All tabs */}
      <div className="flex items-center gap-1 mb-8">
        {[
          { value: 'all', label: 'All' },
          { value: 'buy', label: 'For Sale' },
          { value: 'rent', label: 'For Rent' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter('listing_type', opt.value === 'all' ? null : opt.value)}
            className={cn(
              'px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-semibold transition-all duration-200',
              currentListingType === opt.value
                ? 'bg-[#0a0a0a] text-white'
                : 'text-stone-400 hover:text-[#0a0a0a]'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-b border-stone-100 pb-6">
        {/* Search */}
        <div className="relative flex items-center gap-2 border-b border-stone-200 focus-within:border-[#c9a84c] transition-colors duration-200">
          <Search size={13} className="text-stone-300" />
          <input
            type="text"
            placeholder="Search properties..."
            value={currentSearch}
            onChange={(e) => updateFilter('search', e.target.value || null)}
            className="bg-transparent text-xs text-[#0a0a0a] placeholder-stone-300 tracking-wide py-2.5 w-48 focus:outline-none"
          />
        </div>

        {/* City */}
        <div className="relative">
          <select
            value={currentCity}
            onChange={(e) => updateFilter('city', e.target.value || null)}
            className={selectClass}
          >
            <option value="">Any City</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Type */}
        <div className="relative">
          <select
            value={currentPropertyType}
            onChange={(e) => updateFilter('property_type', e.target.value || null)}
            className={selectClass}
          >
            <option value="">Any Type</option>
            {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Min price */}
        <input
          type="number"
          placeholder="Min Price (MAD)"
          value={currentMinPrice}
          onChange={(e) => updateFilter('min_price', e.target.value || null)}
          className="bg-transparent border-b border-stone-200 focus:border-[#c9a84c] text-xs text-[#0a0a0a] placeholder-stone-300 py-2.5 w-36 focus:outline-none tracking-wide transition-colors duration-200"
        />

        {/* Max price */}
        <input
          type="number"
          placeholder="Max Price (MAD)"
          value={currentMaxPrice}
          onChange={(e) => updateFilter('max_price', e.target.value || null)}
          className="bg-transparent border-b border-stone-200 focus:border-[#c9a84c] text-xs text-[#0a0a0a] placeholder-stone-300 py-2.5 w-36 focus:outline-none tracking-wide transition-colors duration-200"
        />

        {/* Sort */}
        <div className="relative ml-auto">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className={selectClass}
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-stone-300 hover:text-red-400 transition-colors duration-200"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>
    </div>
  )
}
