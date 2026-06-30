import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    .update(propertyData)
    .eq('id', params.id)
    .select()
    .single()

  if (propertyError) {
    return NextResponse.json({ error: propertyError.message }, { status: 500 })
  }

  if (images !== undefined) {
    // Delete existing images and re-insert
    await supabase.from('property_images').delete().eq('property_id', params.id)

    if (images.length > 0) {
      const imageRecords = images.map(
        (img: { image_url: string; is_cover: boolean; sort_order: number }) => ({
          property_id: params.id,
          image_url: img.image_url,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        })
      )

      const { error: imageError } = await supabase
        .from('property_images')
        .insert(imageRecords)

      if (imageError) {
        console.error('Image update error:', imageError)
      }
    }
  }

  return NextResponse.json(property)
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get images to delete from storage
  const { data: images } = await supabase
    .from('property_images')
    .select('image_url')
    .eq('property_id', params.id)

  // Delete images from storage
  if (images && images.length > 0) {
    const paths = images
      .map((img) => {
        const url = img.image_url as string
        const match = url.match(/property-images\/(.+)$/)
        return match ? match[1] : null
      })
      .filter(Boolean) as string[]

    if (paths.length > 0) {
      await supabase.storage.from('property-images').remove(paths)
    }
  }

  // Delete property (images cascade)
  const { error } = await supabase.from('properties').delete().eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
