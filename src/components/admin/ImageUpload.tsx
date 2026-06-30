'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import Image from 'next/image'
import { Upload, X, Star, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadedImage {
  id: string
  url: string
  is_cover: boolean
  sort_order: number
  uploading?: boolean
  error?: string
}

interface ImageUploadProps {
  propertyId?: string
  initialImages?: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

export default function ImageUpload({ propertyId, initialImages = [], onChange }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)

  const updateImages = (newImages: UploadedImage[]) => {
    setImages(newImages)
    onChange(newImages)
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        is_cover: images.length === 0 && index === 0,
        sort_order: images.length + index,
        uploading: true,
      }))

      const merged = [...images, ...newImages]
      setImages(merged)
      setIsUploading(true)

      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const tempId = newImages[index].id
        try {
          const formData = new FormData()
          formData.append('file', file)
          if (propertyId) formData.append('propertyId', propertyId)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Upload failed')
          }

          const { url } = await response.json()
          return { tempId, url, success: true }
        } catch {
          return { tempId, url: '', success: false }
        }
      })

      const results = await Promise.all(uploadPromises)

      setImages((prev) => {
        const updated = prev.map((img) => {
          const result = results.find((r) => r.tempId === img.id)
          if (!result) return img
          if (result.success) {
            return { ...img, url: result.url, uploading: false }
          } else {
            return { ...img, uploading: false, error: 'Upload failed' }
          }
        })
        onChange(updated.filter((img) => !img.error))
        return updated
      })
      setIsUploading(false)
    },
    [images, propertyId, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
  })

  const handleRemove = (id: string) => {
    const filtered = images.filter((img) => img.id !== id)
    // If removed was cover, make first image cover
    if (filtered.length > 0 && !filtered.some((img) => img.is_cover)) {
      filtered[0].is_cover = true
    }
    updateImages(filtered.map((img, i) => ({ ...img, sort_order: i })))
  }

  const handleSetCover = (id: string) => {
    updateImages(images.map((img) => ({ ...img, is_cover: img.id === id })))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reordered = Array.from(images)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    updateImages(reordered.map((img, i) => ({ ...img, sort_order: i })))
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-brand-gold bg-brand-gold/5'
            : 'border-stone-300 hover:border-brand-gold hover:bg-stone-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={cn('p-4', isDragActive ? 'text-brand-gold' : 'text-stone-400')}>
            <Upload size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-black">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-xs text-brand-gray mt-1">
              or click to select — JPG, PNG, WebP up to 10MB
            </p>
          </div>
          {isUploading && (
            <p className="text-xs text-brand-gold animate-pulse">Uploading...</p>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3"
              >
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(draggableProvided, snapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        className={cn(
                          'relative w-28 h-28 group',
                          snapshot.isDragging && 'opacity-80 shadow-2xl'
                        )}
                      >
                        {/* Drag handle */}
                        <div
                          {...draggableProvided.dragHandleProps}
                          className="absolute top-1 left-1 z-10 p-1 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                        >
                          <GripVertical size={12} />
                        </div>

                        {/* Image */}
                        <div className="relative w-full h-full overflow-hidden bg-stone-100">
                          {image.uploading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                              <svg className="animate-spin h-6 w-6 text-brand-gold" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            </div>
                          ) : image.error ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-400 text-xs text-center p-2">
                              Failed
                            </div>
                          ) : (
                            <Image
                              src={image.url}
                              alt={`Property image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          )}
                        </div>

                        {/* Cover badge */}
                        {image.is_cover && (
                          <div className="absolute bottom-1 left-1 z-10 bg-brand-gold text-white px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                            Cover
                          </div>
                        )}

                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          {!image.is_cover && !image.uploading && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(image.id)}
                              className="p-1.5 bg-brand-gold text-white hover:bg-brand-gold-dark transition-colors"
                              title="Set as cover"
                            >
                              <Star size={12} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemove(image.id)}
                            className="p-1.5 bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-brand-gray">
          {images.length} image{images.length !== 1 ? 's' : ''} selected. Drag to reorder.{' '}
          Click ★ to set cover image.
        </p>
      )}
    </div>
  )
}
