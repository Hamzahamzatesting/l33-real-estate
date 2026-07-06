'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { X, Plus } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import ImageUpload, { type UploadedImage } from '@/components/admin/ImageUpload'
import { slugify, generateReferenceId, formatPriceUSD } from '@/lib/utils'
import type { Property } from '@/lib/types'

const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  reference_id: z.string().min(1, 'Reference ID is required'),
  listing_type: z.enum(['buy', 'rent']),
  property_type: z.enum(['apartment', 'villa', 'house', 'office', 'land', 'commercial']),
  price: z.coerce.number().positive('Price must be positive'),
  city: z.string().min(1, 'City is required'),
  neighborhood: z.string().min(1, 'Neighborhood is required'),
  address: z.string().optional(),
  surface_area: z.coerce.number().positive('Surface area must be positive'),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  parking: z.coerce.number().min(0),
  description: z.string().optional(),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  map_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  agent_name: z.string().optional(),
  agent_phone: z.string().optional(),
  status: z.enum(['draft', 'published', 'sold', 'rented']),
})

type PropertyFormData = z.infer<typeof propertySchema>

const QUICK_AMENITIES = [
  'Pool', 'Garage', 'Garden', 'Terrace', 'Security', 'Elevator',
  'Air Conditioning', 'Furnished', 'Sea View', 'Mountain View',
]

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier',
  'Agadir', 'Meknes', 'Oujda', 'Other',
]

interface PropertyFormProps {
  property?: Property
  mode: 'create' | 'edit'
}

export default function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter()
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || [])
  const [amenityInput, setAmenityInput] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      reference_id: property?.reference_id || generateReferenceId(),
      listing_type: property?.listing_type || 'buy',
      property_type: property?.property_type || 'apartment',
      price: property?.price || 0,
      city: property?.city || '',
      neighborhood: property?.neighborhood || '',
      address: property?.address || '',
      surface_area: property?.surface_area || 0,
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      parking: property?.parking || 0,
      description: property?.description || '',
      video_url: property?.video_url || '',
      map_url: property?.map_url || '',
      agent_name: property?.agent_name || '',
      agent_phone: property?.agent_phone || '',
      status: property?.status || 'draft',
    },
  })

  // Pre-fill images from existing property
  useEffect(() => {
    if (property?.images && property.images.length > 0) {
      setImages(
        property.images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({
            id: img.id,
            url: img.image_url,
            is_cover: img.is_cover,
            sort_order: img.sort_order,
          }))
      )
    }
  }, [property])

  const addAmenity = (amenity: string) => {
    const trimmed = amenity.trim()
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed])
    }
    setAmenityInput('')
  }

  const removeAmenity = (amenity: string) => {
    setAmenities((prev) => prev.filter((a) => a !== amenity))
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setError('')

    const coverImage = images.find((img) => img.is_cover)
    const slug = mode === 'create'
      ? slugify(data.title) + '-' + data.reference_id.slice(-4).toLowerCase()
      : property!.slug

    const payload = {
      ...data,
      slug,
      amenities,
      cover_image_url: coverImage?.url || images[0]?.url || null,
      published_at: data.status === 'published' ? new Date().toISOString() : property?.published_at || null,
      images: images
        .filter((img) => !img.uploading && !img.error)
        .map((img) => ({
          id: img.id,
          image_url: img.url,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        })),
    }

    try {
      let response: Response

      if (mode === 'create') {
        response = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`/api/properties/${property!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Something went wrong')
      }

      if (mode === 'create') {
        router.push('/admin/properties')
        router.refresh()
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property')
    } finally {
      setIsSubmitting(false)
    }
  }

  const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-stone-200">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-stone-100">
        <span className="font-heading text-xs font-bold text-[#c9a84c] tracking-[0.3em] w-6">{n}</span>
        <h2 className="text-sm font-semibold text-[#0a0a0a] tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
      {/* Section 1: Basic Information */}
      <Section n="01" title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Property Title *"
              placeholder="e.g. Luxury Apartment in Downtown Casablanca"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>
          <Input
            label="Reference ID *"
            placeholder="L33-2024-XXXX"
            error={errors.reference_id?.message}
            {...register('reference_id')}
          />
          <Controller
            name="listing_type"
            control={control}
            render={({ field }) => (
              <Select
                label="Listing Type *"
                error={errors.listing_type?.message}
                options={[
                  { value: 'buy', label: 'For Sale' },
                  { value: 'rent', label: 'For Rent' },
                ]}
                {...field}
              />
            )}
          />
          <Controller
            name="property_type"
            control={control}
            render={({ field }) => (
              <Select
                label="Property Type *"
                error={errors.property_type?.message}
                options={[
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'villa', label: 'Villa' },
                  { value: 'house', label: 'House' },
                  { value: 'office', label: 'Office' },
                  { value: 'land', label: 'Land' },
                  { value: 'commercial', label: 'Commercial' },
                ]}
                {...field}
              />
            )}
          />
        </div>
      </Section>

      {/* Section 2: Pricing & Location */}
      <Section n="02" title="Pricing & Location">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Price (MAD) *"
            type="number"
            placeholder="0"
            error={errors.price?.message}
            helperText={watch('price') ? `Shown to visitors as ${formatPriceUSD(Number(watch('price')))}` : undefined}
            {...register('price')}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                label="City *"
                error={errors.city?.message}
                placeholder="Select city"
                options={CITIES.map((c) => ({ value: c, label: c }))}
                {...field}
              />
            )}
          />
          <Input
            label="Neighborhood *"
            placeholder="e.g. Maarif, Gauthier"
            error={errors.neighborhood?.message}
            {...register('neighborhood')}
          />
          <Input
            label="Full Address"
            placeholder="Optional full address"
            error={errors.address?.message}
            {...register('address')}
          />
        </div>
      </Section>

      {/* Section 3: Property Details */}
      <Section n="03" title="Property Details">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input label="Surface (m²) *" type="number" placeholder="0" error={errors.surface_area?.message} {...register('surface_area')} />
          <Input label="Bedrooms" type="number" min={0} placeholder="0" error={errors.bedrooms?.message} {...register('bedrooms')} />
          <Input label="Bathrooms" type="number" min={0} placeholder="0" error={errors.bathrooms?.message} {...register('bathrooms')} />
          <Input label="Parking" type="number" min={0} placeholder="0" error={errors.parking?.message} {...register('parking')} />
        </div>
      </Section>

      {/* Section 4: Description & Amenities */}
      <Section n="04" title="Description & Amenities">
        <div className="space-y-5">
          <Textarea
            label="Description"
            placeholder="Describe the property in detail — location highlights, finishes, nearby amenities..."
            rows={5}
            {...register('description')}
          />
          <div>
            <p className="text-[11px] font-semibold text-stone-500 tracking-[0.15em] uppercase mb-2.5">Amenities & Features</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => addAmenity(amenity)}
                  disabled={amenities.includes(amenity)}
                  className="px-3 py-1.5 text-[11px] font-medium border border-stone-200 text-stone-500 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  + {amenity}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(amenityInput) } }}
                placeholder="Custom amenity, press Enter"
                className="flex-1 px-4 py-2.5 border border-stone-200 text-sm text-[#0a0a0a] placeholder-stone-300 focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
              <button type="button" onClick={() => addAmenity(amenityInput)} className="px-4 bg-[#c9a84c] text-white hover:bg-[#a8892e] transition-colors">
                <Plus size={15} />
              </button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {amenities.map((amenity) => (
                  <span key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 text-xs text-[#0a0a0a]">
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(amenity)} className="text-stone-400 hover:text-red-400 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Section 5: Media */}
      <Section n="05" title="Photos & Media">
        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-stone-500 tracking-[0.15em] uppercase mb-3">Property Images</p>
            <ImageUpload propertyId={property?.id} initialImages={images} onChange={setImages} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <Input label="Video URL" type="url" placeholder="https://youtube.com/embed/..." error={errors.video_url?.message} helperText="YouTube embed or direct video URL" {...register('video_url')} />
            <Input label="Map Embed URL" type="url" placeholder="https://maps.google.com/..." error={errors.map_url?.message} helperText="Google Maps embed URL" {...register('map_url')} />
            <Input label="Agent Name" placeholder="Agent full name" {...register('agent_name')} />
            <Input label="Agent Phone" placeholder="+212 600 000 000" {...register('agent_phone')} />
          </div>
        </div>
      </Section>

      {/* Section 6: Publishing */}
      <Section n="06" title="Publishing">
        <div className="max-w-xs">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status *"
                error={errors.status?.message}
                options={[
                  { value: 'draft', label: 'Draft — Not visible to public' },
                  { value: 'published', label: 'Published — Live on website' },
                  { value: 'sold', label: 'Sold' },
                  { value: 'rented', label: 'Rented' },
                ]}
                {...field}
              />
            )}
          />
        </div>
      </Section>

      {/* Error / Success */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-xs tracking-wide">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-xs tracking-wide">
          Property saved successfully.
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => router.push('/admin/properties')} className="text-stone-400 text-sm hover:text-[#0a0a0a] transition-colors">
          Cancel
        </button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} size="lg">
          {mode === 'create' ? 'Create Property' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
