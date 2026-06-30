'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
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
  const [showMore, setShowMore] = useState(false)

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

  const update = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`, { scroll: false })
  }

  const currentListingType = searchParams.get('listing_type') || 'all'
  const currentCity = searchParams.get('city') || ''
  const currentPropertyType = searchParams.get('property_type') || ''
  const currentMinPrice = searchParams.get('min_price') || ''
  const currentMaxPrice = searchParams.get('max_price') || ''
  const currentSort = searchParams.get('sort') || 'created_at_desc'
  const currentSearch = searchParams.get('search') || ''

  const hasActiveFilters = currentListingType !== 'all' || currentCity || currentPropertyType ||
    currentMinPrice || currentMaxPrice || currentSort !== 'created_at_desc' || currentSearch

  const fieldClass = "w-full bg-white border border-stone-200 text-[#0a0a0a] text-sm px-3 py-3 placeholder-stone-400 focus:outline-none focus:border-[#c9a84c] transition-colors duration-200"

  return (
    <div className="mb-10">
      {/* Buy / Rent tabs */}
      <div className="flex items-center mb-5">
        {[
          { value: 'all', label: 'All' },
          { value: 'buy', label: 'For Sale' },
          { value: 'rent', label: 'For Rent' },
        ].map((opt, i, arr) => (
          <button
            key={opt.value}
            onClick={() => update('listing_type', opt.value === 'all' ? null : opt.value)}
            className={cn(
              'flex-1 sm:flex-none px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-200 border',
              i > 0 ? '-ml-px' : '',
              currentListingType === opt.value
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] z-10 relative'
                : 'bg-white text-stone-500 border-stone-200 hover:text-[#0a0a0a] hover:border-stone-400'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search + filter toggle row */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, city, neighborhood..."
            value={currentSearch}
            onChange={(e) => update('search', e.target.value || null)}
            className={cn(fieldClass, 'pl-9')}
          />
        </div>
        <button
          onClick={() => setShowMore(!showMore)}
          className={cn(
            'flex items-center gap-2 px-4 border text-xs tracking-wide font-semibold uppercase transition-colors duration-200 whitespace-nowrap',
            showMore
              ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
              : 'bg-white text-stone-500 border-stone-200 hover:border-[#c9a84c] hover:text-[#c9a84c]'
          )}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />}
        </button>
        {hasActiveFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="flex items-center gap-1.5 px-3 border border-stone-200 bg-white text-stone-400 hover:text-red-400 hover:border-red-200 transition-colors duration-200"
            title="Clear filters"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showMore && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-stone-50 border border-stone-200">
          <select value={currentCity} onChange={(e) => update('city', e.target.value || null)} className={fieldClass}>
            <option value="">Any City</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={currentPropertyType} onChange={(e) => update('property_type', e.target.value || null)} className={fieldClass}>
            <option value="">Any Type</option>
            {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <input
            type="number"
            placeholder="Min Price (MAD)"
            value={currentMinPrice}
            onChange={(e) => update('min_price', e.target.value || null)}
            className={fieldClass}
          />

          <input
            type="number"
            placeholder="Max Price (MAD)"
            value={currentMaxPrice}
            onChange={(e) => update('max_price', e.target.value || null)}
            className={fieldClass}
          />

          <div className="sm:col-span-2 lg:col-span-4">
            <select value={currentSort} onChange={(e) => update('sort', e.target.value)} className={fieldClass}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
