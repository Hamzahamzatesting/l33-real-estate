import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-black tracking-wide">
            Dashboard
          </h1>
          <p className="text-sm text-brand-gray mt-1">
            Welcome back to L33 Real Estate Admin
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white px-5 py-2.5 text-sm font-semibold tracking-widest uppercase transition-all duration-300"
        >
          <Plus size={16} />
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <AdminStats stats={stats} />

      {/* Recent Properties */}
      <div className="bg-white border border-stone-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-heading text-lg font-semibold text-brand-black tracking-wide">
            Recent Properties
          </h2>
          <Link
            href="/admin/properties"
            className="flex items-center gap-1.5 text-sm text-brand-gold hover:text-brand-gold-dark transition-colors duration-200"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>
        <PropertyTable properties={recentProperties} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/properties/new"
          className="bg-white border border-stone-200 p-6 hover:border-brand-gold transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center">
              <Plus size={20} className="text-brand-gold" />
            </div>
            <div>
              <p className="font-medium text-brand-black text-sm">Add Property</p>
              <p className="text-xs text-brand-gray mt-0.5">Create a new listing</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/properties?status=draft"
          className="bg-white border border-stone-200 p-6 hover:border-brand-gold transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 flex items-center justify-center">
              <span className="text-yellow-600 text-xl font-bold">{stats.draft}</span>
            </div>
            <div>
              <p className="font-medium text-brand-black text-sm">Draft Properties</p>
              <p className="text-xs text-brand-gray mt-0.5">Review and publish</p>
            </div>
          </div>
        </Link>
        <Link
          href="/properties"
          target="_blank"
          className="bg-white border border-stone-200 p-6 hover:border-brand-gold transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 flex items-center justify-center">
              <span className="text-green-600 text-xl font-bold">{stats.published}</span>
            </div>
            <div>
              <p className="font-medium text-brand-black text-sm">Live Listings</p>
              <p className="text-xs text-brand-gray mt-0.5">View on website ↗</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
