export type ListingType = 'buy' | 'rent'
export type PropertyType = 'apartment' | 'villa' | 'house' | 'office' | 'land' | 'commercial'
export type PropertyStatus = 'draft' | 'published' | 'sold' | 'rented'

export interface Property {
  id: string
  title: string
  reference_id: string
  slug: string
  listing_type: ListingType
  property_type: PropertyType
  price: number
  city: string
  neighborhood: string
  address?: string
  surface_area: number
  bedrooms: number
  bathrooms: number
  parking: number
  status: PropertyStatus
  description: string
  amenities: string[]
  cover_image_url?: string
  video_url?: string
  map_url?: string
  agent_name?: string
  agent_phone?: string
  created_at: string
  updated_at: string
  published_at?: string
  images?: PropertyImage[]
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  alt_text?: string
  sort_order: number
  is_cover: boolean
  created_at: string
}

export interface DashboardStats {
  total: number
  published: number
  draft: number
  sold: number
  rented: number
}
