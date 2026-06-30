import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyTable from '@/components/admin/PropertyTable'
import type { Property } from '@/lib/types'

interface AdminPropertiesPageProps {
  searchParams: {
    search?: string
    status?: string
    type?: string
    city?: string
  }
}

async function getProperties(searchParams: AdminPropertiesPageProps['searchParams']): Promise<Property[]> {
  const supabase = createClient()

  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }
  if (searchParams.type) {
    query = query.eq('property_type', searchParams.type)
  }
  if (searchParams.city) {
    query = query.ilike('city', `%${searchParams.city}%`)
  }
  if (searchParams.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,reference_id.ilike.%${searchParams.search}%,city.ilike.%${searchParams.search}%`
    )
  }

  const { data } = await query
  return (data as Property[]) || []
}

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const properties = await getProperties(searchParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-black tracking-wide">
            Properties
          </h1>
          <p className="text-sm text-brand-gray mt-1">
            {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} total
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white px-5 py-2.5 text-sm font-semibold tracking-widest uppercase transition-all duration-300"
        >
          <Plus size={16} />
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 p-4">
        <form className="flex flex-wrap gap-4" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="Search by title, reference, city..."
            className="flex-1 min-w-48 px-4 py-2.5 border border-stone-300 text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          />
          <select
            name="status"
            defaultValue={searchParams.status}
            className="px-4 py-2.5 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <select
            name="type"
            defaultValue={searchParams.type}
            className="px-4 py-2.5 border border-stone-300 text-sm text-brand-black bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="office">Office</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-black text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-200"
          >
            Filter
          </button>
          {Object.values(searchParams).some(Boolean) && (
            <Link
              href="/admin/properties"
              className="px-5 py-2.5 border border-stone-300 text-sm text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-colors duration-200"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200">
        <PropertyTable properties={properties} />
      </div>
    </div>
  )
}
