'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'
import { formatPrice, getPropertyTypeLabel, getListingTypeLabel } from '@/lib/utils'
import type { Property } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface PropertyTableProps {
  properties: Property[]
}

export default function PropertyTable({ properties: initialProperties }: PropertyTableProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (property: Property) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(property.id)
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== property.id))
      } else {
        alert('Failed to delete property. Please try again.')
      }
    } catch {
      alert('An error occurred. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (property: Property) => {
    const newStatus = property.status === 'published' ? 'draft' : 'published'
    setTogglingId(property.id)
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'published' ? { published_at: new Date().toISOString() } : {}),
        }),
      })
      if (response.ok) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === property.id
              ? {
                  ...p,
                  status: newStatus,
                  published_at: newStatus === 'published' ? new Date().toISOString() : p.published_at,
                }
              : p
          )
        )
        router.refresh()
      } else {
        alert('Failed to update property status.')
      }
    } catch {
      alert('An error occurred. Please try again.')
    } finally {
      setTogglingId(null)
    }
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-stone-200">
        <p className="text-brand-gray text-sm">No properties found.</p>
        <Link
          href="/admin/properties/new"
          className="mt-4 inline-flex items-center gap-2 text-brand-gold text-sm hover:text-brand-gold-dark transition-colors duration-200"
        >
          Add your first property →
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-beige border-b border-stone-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest">
              Reference
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest">
              Title
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest hidden md:table-cell">
              City
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest hidden lg:table-cell">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest hidden lg:table-cell">
              Price
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest hidden xl:table-cell">
              Date
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-brand-gray uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {properties.map((property, index) => (
            <tr
              key={property.id}
              className={`hover:bg-stone-50 transition-colors duration-150 ${
                index % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'
              }`}
            >
              <td className="px-4 py-4">
                <span className="font-mono text-xs text-brand-gray font-medium">
                  {property.reference_id}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="max-w-[200px]">
                  <p className="font-medium text-brand-black truncate">{property.title}</p>
                  <p className="text-xs text-brand-gray mt-0.5">
                    {getListingTypeLabel(property.listing_type)}
                  </p>
                </div>
              </td>
              <td className="px-4 py-4 hidden md:table-cell text-brand-gray">
                {property.city}
              </td>
              <td className="px-4 py-4 hidden lg:table-cell">
                <span className="text-xs text-brand-gray capitalize">
                  {getPropertyTypeLabel(property.property_type)}
                </span>
              </td>
              <td className="px-4 py-4 hidden lg:table-cell">
                <span className="font-medium text-brand-black">
                  {formatPrice(property.price)}
                </span>
              </td>
              <td className="px-4 py-4">
                <Badge status={property.status} />
              </td>
              <td className="px-4 py-4 hidden xl:table-cell text-xs text-brand-gray">
                {format(new Date(property.created_at), 'MMM d, yyyy')}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-1">
                  {/* Toggle Publish */}
                  <button
                    onClick={() => handleTogglePublish(property)}
                    disabled={togglingId === property.id || ['sold', 'rented'].includes(property.status)}
                    className="p-2 text-brand-gray hover:text-brand-gold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={property.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {togglingId === property.id ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : property.status === 'published' ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="p-2 text-brand-gray hover:text-brand-black transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(property)}
                    disabled={deletingId === property.id}
                    className="p-2 text-brand-gray hover:text-red-500 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    {deletingId === property.id ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <Trash2 size={16} />
                    )}
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
