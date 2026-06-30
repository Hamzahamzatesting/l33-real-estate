import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyForm from '@/components/admin/PropertyForm'
import type { Property } from '@/lib/types'

interface EditPropertyPageProps {
  params: { id: string }
}

async function getProperty(id: string): Promise<Property | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('id', id)
    .single()
  return data as Property | null
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-gold transition-colors duration-200 mb-4"
        >
          <ChevronLeft size={16} />
          Back to Properties
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-black tracking-wide">
              Edit Property
            </h1>
            <p className="text-sm text-brand-gray mt-1">
              {property.reference_id} — {property.title}
            </p>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            target="_blank"
            className="text-sm text-brand-gold hover:text-brand-gold-dark transition-colors duration-200"
          >
            View listing ↗
          </Link>
        </div>
      </div>

      {/* Form */}
      <PropertyForm property={property} mode="edit" />
    </div>
  )
}
