import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  let query = supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('status', 'published')

  const listingType = searchParams.get('listing_type')
  const city = searchParams.get('city')
  const propertyType = searchParams.get('property_type')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const bedrooms = searchParams.get('bedrooms')
  const search = searchParams.get('search')
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort') || 'created_at_desc'

  if (listingType && listingType !== 'all') {
    query = query.eq('listing_type', listingType)
  }
  if (city) query = query.ilike('city', `%${city}%`)
  if (propertyType) query = query.eq('property_type', propertyType)
  if (minPrice) query = query.gte('price', Number(minPrice))
  if (maxPrice) query = query.lte('price', Number(maxPrice))
  if (bedrooms) query = query.gte('bedrooms', Number(bedrooms))
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,city.ilike.%${search}%,neighborhood.ilike.%${search}%`
    )
  }
  if (limit) query = query.limit(Number(limit))

  const sortField = sort.endsWith('_asc')
    ? sort.replace('_asc', '')
    : sort.replace('_desc', '')
  const ascending = sort.endsWith('_asc')
  query = query.order(sortField, { ascending })

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { images, ...propertyData } = body

  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single()

  if (propertyError) {
    return NextResponse.json({ error: propertyError.message }, { status: 500 })
  }

  if (images && images.length > 0) {
    const imageRecords = images.map(
      (img: { image_url: string; is_cover: boolean; sort_order: number }) => ({
        property_id: property.id,
        image_url: img.image_url,
        is_cover: img.is_cover,
        sort_order: img.sort_order,
      })
    )

    const { error: imageError } = await supabase
      .from('property_images')
      .insert(imageRecords)

    if (imageError) {
      console.error('Image insert error:', imageError)
    }
  }

  return NextResponse.json(property, { status: 201 })
}
