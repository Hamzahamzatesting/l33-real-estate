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
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
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

  const inputClass = "w-full bg-white border border-stone-200 text-[#0a0a0a] text-xs px-3 py-2.5 placeholder-stone-400 focus:outline-none focus:border-[#c9a84c] transition-colors duration-200"
  const selectClass = "w-full bg-white border border-stone-200 text-[#0a0a0a] text-xs px-3 py-2.5 focus:outline-none focus:border-[#c9a84c] transition-colors duration-200 cursor-pointer"

  return (
    <div className="mb-10">
      {/* Buy / Rent tabs */}
      <div className="flex items-center gap-0 mb-6 border border-stone-200 w-fit">
        {[
          { value: 'all', label: 'All' },
          { value: 'buy', label: 'For Sale' },
          { value: 'rent', label: 'For Rent' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter('listing_type', opt.value === 'all' ? null : opt.value)}
            className={cn(
              'px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-200 border-r border-stone-200 last:border-r-0',
              currentListingType === opt.value
                ? 'bg-[#0a0a0a] text-white'
                : 'bg-white text-stone-400 hover:text-[#0a0a0a] hover:bg-stone-50'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, city..."
            value={currentSearch}
            onChange={(e) => updateFilter('search', e.target.value || null)}
            className={cn(inputClass, 'pl-9')}
          />
        </div>

        {/* City */}
        <select
          value={currentCity}
          onChange={(e) => updateFilter('city', e.target.value || null)}
          className={selectClass}
        >
          <option value="">Any City</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Type */}
        <select
          value={currentPropertyType}
          onChange={(e) => updateFilter('property_type', e.target.value || null)}
          className={selectClass}
        >
          <option value="">Any Type</option>
          {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        {/* Price range */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min MAD"
            value={currentMinPrice}
            onChange={(e) => updateFilter('min_price', e.target.value || null)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Max MAD"
            value={currentMaxPrice}
            onChange={(e) => updateFilter('max_price', e.target.value || null)}
            className={inputClass}
          />
        </div>

        {/* Sort + Clear */}
        <div className="flex gap-2">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className={cn(selectClass, 'flex-1')}
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {hasActiveFilters && (
            <button
              onClick={() => router.push(pathname, { scroll: false })}
              className="flex items-center justify-center w-10 border border-stone-200 bg-white text-stone-400 hover:text-red-400 hover:border-red-200 transition-colors duration-200 flex-shrink-0"
              title="Clear filters"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
