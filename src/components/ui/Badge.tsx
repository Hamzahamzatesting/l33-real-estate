import { cn } from '@/lib/utils'
import type { PropertyStatus } from '@/lib/types'

interface BadgeProps {
  status: PropertyStatus
  className?: string
}

const statusConfig: Record<PropertyStatus, { label: string; classes: string }> = {
  published: {
    label: 'Published',
    classes: 'bg-green-100 text-green-800 border-green-200',
  },
  draft: {
    label: 'Draft',
    classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  sold: {
    label: 'Sold',
    classes: 'bg-red-100 text-red-800 border-red-200',
  },
  rented: {
    label: 'Rented',
    classes: 'bg-blue-100 text-blue-800 border-blue-200',
  },
}

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border tracking-wider uppercase',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  )
}
