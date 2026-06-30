import Link from 'next/link'
import { Plus, ArrowUpRight, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import AdminStats from '@/components/admin/AdminStats'
import PropertyTable from '@/components/admin/PropertyTable'
import type { DashboardStats, Property } from '@/lib/types'

async function getDashboardData() {
  const supabase = createClient()

  const { data: allProperties } = await supabase
    .from('properties')
    .select('id, status')

  const props = allProperties || []
  const stats: DashboardStats = {
    total: props.length,
    published: props.filter((p) => p.status === 'published').length,
    draft: props.filter((p) => p.status === 'draft').length,
    sold: props.filter((p) => p.status === 'sold').length,
    rented: props.filter((p) => p.status === 'rented').length,
  }

  const { data: recentProperties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return { stats, recentProperties: (recentProperties as Property[]) || [] }
}

export default async function AdminDashboard() {
  const { stats, recentProperties } = await getDashboardData()

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-400 text-xs tracking-[0.2em] uppercase mb-2">{dateStr}</p>
          <h1 className="font-heading text-3xl font-bold text-[#0a0a0a] tracking-tight">
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#c9a84c] text-white text-xs tracking-[0.2em] uppercase font-semibold px-5 py-3 transition-all duration-300 group"
        >
          <Plus size={14} />
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <AdminStats stats={stats} />

      {/* Recent + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-white border border-stone-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-[#0a0a0a] tracking-wide">Recent Properties</h2>
            <Link
              href="/admin/properties"
              className="text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-[#c9a84c] transition-colors flex items-center gap-1 group"
            >
              View all
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <PropertyTable properties={recentProperties} />
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-medium">Quick Actions</p>

          <Link
            href="/admin/properties/new"
            className="flex items-center justify-between p-5 bg-white border border-stone-200 hover:border-[#c9a84c] transition-all duration-200 group"
          >
            <div>
              <p className="text-sm font-semibold text-[#0a0a0a] mb-0.5">Add Property</p>
              <p className="text-xs text-stone-400">Create a new listing</p>
            </div>
            <ArrowUpRight size={16} className="text-stone-300 group-hover:text-[#c9a84c] transition-colors" />
          </Link>

          <Link
            href="/admin/properties"
            className="flex items-center justify-between p-5 bg-white border border-stone-200 hover:border-[#c9a84c] transition-all duration-200 group"
          >
            <div>
              <p className="text-sm font-semibold text-[#0a0a0a] mb-0.5">
                {stats.draft} Draft{stats.draft !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-stone-400">Ready to publish</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-5 bg-white border border-stone-200 hover:border-[#c9a84c] transition-all duration-200 group"
          >
            <div>
              <p className="text-sm font-semibold text-[#0a0a0a] mb-0.5">
                {stats.published} Live
              </p>
              <p className="text-xs text-stone-400">View public website</p>
            </div>
            <ArrowUpRight size={16} className="text-stone-300 group-hover:text-[#c9a84c] transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}
