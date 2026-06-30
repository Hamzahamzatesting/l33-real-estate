import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyTable from '@/components/admin/PropertyTable'
import type { Property } from '@/lib/types'

interface AdminPropertiesPageProps {
  searchParams: { search?: string; status?: string; type?: string }
}

async function getProperties(searchParams: AdminPropertiesPageProps['searchParams']): Promise<Property[]> {
  const supabase = createClient()
  let query = supabase.from('properties').select('*').order('created_at', { ascending: false })
  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.type) query = query.eq('property_type', searchParams.type)
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,reference_id.ilike.%${searchParams.search}%,city.ilike.%${searchParams.search}%`)
  }
  const { data } = await query
  return (data as Property[]) || []
}

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const properties = await getProperties(searchParams)

  const inputClass = "bg-white border border-stone-200 text-[#0a0a0a] text-xs px-3 py-2.5 placeholder-stone-400 focus:outline-none focus:border-[#c9a84c] transition-colors duration-200"
  const selectClass = "bg-white border border-stone-200 text-[#0a0a0a] text-xs px-3 py-2.5 focus:outline-none focus:border-[#c9a84c] transition-colors duration-200 cursor-pointer"

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#0a0a0a] tracking-tight">Properties</h1>
          <p className="text-stone-400 text-xs tracking-wide mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} total
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#c9a84c] text-white text-xs tracking-[0.2em] uppercase font-semibold px-5 py-3 transition-all duration-300"
        >
          <Plus size={14} />
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3" method="GET">
        <input
          type="text"
          name="search"
          defaultValue={searchParams.search}
          placeholder="Search title, reference, city..."
          className={`${inputClass} flex-1 min-w-48`}
        />
        <select name="status" defaultValue={searchParams.status} className={selectClass}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
        <select name="type" defaultValue={searchParams.type} className={selectClass}>
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="house">House</option>
          <option value="office">Office</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>
        <button type="submit" className="bg-[#0a0a0a] text-white text-xs tracking-[0.2em] uppercase font-semibold px-5 py-2.5 hover:bg-[#c9a84c] transition-colors duration-200">
          Filter
        </button>
        {Object.values(searchParams).some(Boolean) && (
          <Link href="/admin/properties" className="border border-stone-200 text-stone-400 text-xs px-4 py-2.5 hover:border-red-200 hover:text-red-400 transition-colors duration-200">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white border border-stone-200">
        <PropertyTable properties={properties} />
      </div>
    </div>
  )
}
