import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PropertyStatus, ListingType, PropertyType } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'MAD'): string {
  return `${price.toLocaleString('fr-MA')} ${currency}`
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('fr-MA')} m²`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}

export function generateReferenceId(): string {
  const year = new Date().getFullYear()
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `L33-${year}-${digits}`
}

export function getStatusColor(status: PropertyStatus): string {
  const colors: Record<PropertyStatus, string> = {
    published: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    sold: 'bg-red-100 text-red-800 border-red-200',
    rented: 'bg-blue-100 text-blue-800 border-blue-200',
  }
  return colors[status]
}

export function getStatusLabel(status: PropertyStatus): string {
  const labels: Record<PropertyStatus, string> = {
    published: 'Published',
    draft: 'Draft',
    sold: 'Sold',
    rented: 'Rented',
  }
  return labels[status]
}

export function getListingTypeLabel(type: ListingType): string {
  const labels: Record<ListingType, string> = {
    buy: 'For Sale',
    rent: 'For Rent',
  }
  return labels[type]
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    house: 'House',
    office: 'Office',
    land: 'Land',
    commercial: 'Commercial',
  }
  return labels[type]
}
