import { Building2, CheckCircle, Clock, Tag, Home } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface AdminStatsProps {
  stats: DashboardStats
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      label: 'Total Properties',
      value: stats.total,
      icon: Building2,
      color: 'text-brand-black',
      bg: 'bg-stone-50',
    },
    {
      label: 'Published',
      value: stats.published,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Draft',
      value: stats.draft,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Sold',
      value: stats.sold,
      icon: Tag,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Rented',
      value: stats.rented,
      icon: Home,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="bg-white border border-stone-200 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 ${card.bg} mb-3`}>
              <Icon size={20} className={card.color} />
            </div>
            <div className="font-heading text-3xl font-bold text-brand-black mb-1">
              {card.value}
            </div>
            <div className="text-xs text-brand-gray uppercase tracking-widest">
              {card.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
