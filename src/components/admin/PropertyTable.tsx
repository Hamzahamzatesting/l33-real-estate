'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, getPropertyTypeLabel, getListingTypeLabel } from '@/lib/utils'
import type { Property } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  draft:     'bg-amber-50 text-amber-700 border border-amber-200',
  sold:      'bg-rose-50 text-rose-700 border border-rose-200',
  rented:    'bg-sky-50 text-sky-700 border border-sky-200',
}

interface PropertyTableProps {
  properties: Property[]
}

export default function PropertyTable({ properties: initialProperties }: PropertyTableProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (property: Property) => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return
    setDeletingId(property.id)
    try {
      const res = await fetch(`/api/properties/${property.id}`, { method: 'DELETE' })
      if (res.ok) setProperties((prev) => prev.filter((p) => p.id !== property.id))
      else alert('Failed to delete. Please try again.')
    } catch { alert('An error occurred.') }
    finally { setDeletingId(null) }
  }

  const handleTogglePublish = async (property: Property) => {
    const newStatus = property.status === 'published' ? 'draft' : 'published'
    setTogglingId(property.id)
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'published' ? { published_at: new Date().toISOString() } : {}),
        }),
      })
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => p.id === property.id
            ? { ...p, status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : p.published_at }
            : p
          )
        )
        router.refresh()
      } else alert('Failed to update status.')
    } catch { alert('An error occurred.') }
    finally { setTogglingId(null) }
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 text-sm mb-4">No properties yet.</p>
        <Link href="/admin/properties/new" className="text-[#c9a84c] text-sm hover:underline">
          Add your first property →
        </Link>
      </div>
    )
  }

  const Spinner = () => (
    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-100">
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.2em]">Property</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.2em] hidden md:table-cell">Location</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.2em] hidden lg:table-cell">Price</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.2em]">Status</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.2em] hidden xl:table-cell">Added</th>
            <th className="text-right px-5 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.2em]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-stone-50/60 transition-colors duration-150 group">
              {/* Property */}
              <td className="px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#0a0a0a] truncate max-w-[200px]">{property.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-stone-400 font-mono">{property.reference_id}</span>
                    <span className="text-stone-200">·</span>
                    <span className="text-[10px] text-stone-400">{getListingTypeLabel(property.listing_type)}</span>
                    <span className="text-stone-200">·</span>
                    <span className="text-[10px] text-stone-400">{getPropertyTypeLabel(property.property_type)}</span>
                  </div>
                </div>
              </td>

              {/* Location */}
              <td className="px-5 py-4 hidden md:table-cell">
                <p className="text-sm text-[#0a0a0a]">{property.city}</p>
                <p className="text-xs text-stone-400 mt-0.5">{property.neighborhood}</p>
              </td>

              {/* Price */}
              <td className="px-5 py-4 hidden lg:table-cell">
                <span className="text-sm font-semibold text-[#0a0a0a]">{formatPrice(property.price)}</span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span className={cn('text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1', STATUS_STYLES[property.status] || STATUS_STYLES.draft)}>
                  {property.status}
                </span>
              </td>

              {/* Date */}
              <td className="px-5 py-4 hidden xl:table-cell">
                <span className="text-xs text-stone-400">
                  {format(new Date(property.created_at), 'MMM d, yyyy')}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  {/* View on site */}
                  {property.status === 'published' && (
                    <Link
                      href={`/properties/${property.slug || property.id}`}
                      target="_blank"
                      className="p-2 text-stone-300 hover:text-[#c9a84c] transition-colors duration-150"
                      title="View on site"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  )}

                  {/* Publish toggle */}
                  <button
                    onClick={() => handleTogglePublish(property)}
                    disabled={togglingId === property.id || ['sold', 'rented'].includes(property.status)}
                    className="p-2 text-stone-300 hover:text-[#c9a84c] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={property.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {togglingId === property.id ? <Spinner /> : property.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="p-2 text-stone-300 hover:text-[#0a0a0a] transition-colors duration-150"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(property)}
                    disabled={deletingId === property.id}
                    className="p-2 text-stone-300 hover:text-red-400 transition-colors duration-150 disabled:opacity-30"
                    title="Delete"
                  >
                    {deletingId === property.id ? <Spinner /> : <Trash2 size={14} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
