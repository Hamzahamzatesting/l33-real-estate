import type { DashboardStats } from '@/lib/types'

interface AdminStatsProps {
  stats: DashboardStats
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    { label: 'Total', value: stats.total, accent: false },
    { label: 'Published', value: stats.published, accent: true, dot: 'bg-emerald-400' },
    { label: 'Draft', value: stats.draft, accent: false, dot: 'bg-amber-400' },
    { label: 'Sold', value: stats.sold, accent: false, dot: 'bg-rose-400' },
    { label: 'Rented', value: stats.rented, accent: false, dot: 'bg-sky-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`p-5 border ${card.accent ? 'bg-[#c9a84c] border-[#c9a84c]' : 'bg-white border-stone-200'}`}
        >
          {card.dot && !card.accent && (
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${card.dot} mb-3`} />
          )}
          <div className={`font-heading text-4xl font-bold mb-1 ${card.accent ? 'text-white' : 'text-[#0a0a0a]'}`}>
            {card.value}
          </div>
          <div className={`text-[10px] tracking-[0.2em] uppercase font-medium ${card.accent ? 'text-white/70' : 'text-stone-400'}`}>
            {card.label}
          </div>
        </div>
      ))}
    </div>
  )
}
