import { TrendingUp, FileText, Clock, Tag, Home } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface AdminStatsProps {
  stats: DashboardStats
}

const CARDS = [
  {
    key: 'total' as const,
    label: 'Total Listings',
    icon: Home,
    color: 'text-[#0a0a0a]',
    bg: 'bg-white',
    border: 'border-stone-200',
    dot: '',
  },
  {
    key: 'published' as const,
    label: 'Published',
    icon: TrendingUp,
    color: 'text-white',
    bg: 'bg-[#c9a84c]',
    border: 'border-[#c9a84c]',
    dot: '',
  },
  {
    key: 'draft' as const,
    label: 'Drafts',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    dot: 'bg-amber-400',
  },
  {
    key: 'sold' as const,
    label: 'Sold',
    icon: Tag,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    dot: 'bg-rose-400',
  },
  {
    key: 'rented' as const,
    label: 'Rented',
    icon: FileText,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    dot: 'bg-sky-400',
  },
]

export default function AdminStats({ stats }: AdminStatsProps) {
  const isGold = (key: string) => key === 'published'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {CARDS.map((card) => {
        const Icon = card.icon
        const gold = isGold(card.key)
        return (
          <div
            key={card.key}
            className={`relative p-5 border ${card.bg} ${card.border} overflow-hidden`}
          >
            {/* Background icon */}
            <Icon
              size={56}
              className={`absolute -right-3 -bottom-3 opacity-[0.06] ${gold ? 'text-white' : 'text-[#0a0a0a]'}`}
            />

            {/* Dot (non-gold only) */}
            {card.dot && (
              <span className={`inline-block w-1.5 h-1.5 rounded-full mb-3 ${card.dot}`} />
            )}

            {/* Number */}
            <div className={`font-heading text-5xl font-bold leading-none mb-2 ${gold ? 'text-white' : card.color}`}>
              {stats[card.key]}
            </div>

            {/* Label */}
            <div className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${gold ? 'text-white/60' : 'text-stone-400'}`}>
              {card.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
