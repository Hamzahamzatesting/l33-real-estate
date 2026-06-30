'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

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

export default function SearchBar() {
  const router = useRouter()
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy')
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (listingType) params.set('listing_type', listingType)
    if (city) params.set('city', city)
    if (propertyType) params.set('property_type', propertyType)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 max-w-4xl w-full mx-auto">
      {/* Buy/Rent Toggle */}
      <div className="flex mb-6 border-b border-stone-200">
        <button
          onClick={() => setListingType('buy')}
          className={`px-6 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-200 border-b-2 -mb-px ${
            listingType === 'buy'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-brand-gray hover:text-brand-black'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setListingType('rent')}
          className={`px-6 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-200 border-b-2 -mb-px ${
            listingType === 'rent'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-brand-gray hover:text-brand-black'
          }`}
        >
          Rent
        </button>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* City */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-3 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
        >
          <option value="">Any City</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Property Type */}
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="px-4 py-3 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
        >
          <option value="">Any Type</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price (MAD)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-4 py-3 border border-stone-300 text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price (MAD)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-3 border border-stone-300 text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full flex items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-dark text-white py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-300"
      >
        <Search size={18} />
        Search Properties
      </button>
    </div>
  )
}
