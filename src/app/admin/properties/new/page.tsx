import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PropertyForm from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
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
        <h1 className="font-heading text-3xl font-bold text-brand-black tracking-wide">
          Add New Property
        </h1>
        <p className="text-sm text-brand-gray mt-1">
          Fill in the details below to create a new property listing
        </p>
      </div>

      {/* Form */}
      <PropertyForm mode="create" />
    </div>
  )
}
