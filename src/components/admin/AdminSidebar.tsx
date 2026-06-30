'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Building2, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/properties',
    label: 'Properties',
    icon: Building2,
    exact: false,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (item: { href: string; exact: boolean }) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-stone-100">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold text-brand-gold tracking-widest">
            L33
          </span>
          <div className="ml-1">
            <p className="text-xs font-medium text-brand-black tracking-widest uppercase">
              Real Estate
            </p>
            <p className="text-[10px] text-brand-gray tracking-widest uppercase">
              Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 tracking-wide',
                    active
                      ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold'
                      : 'text-brand-gray hover:text-brand-black hover:bg-stone-50 border-l-2 border-transparent'
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-xs text-brand-gray hover:text-brand-gold transition-colors duration-200 tracking-wide mb-2"
          target="_blank"
        >
          View Website ↗
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-brand-gray hover:text-red-500 hover:bg-red-50 transition-all duration-200 tracking-wide"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-stone-200 shadow-sm"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-200 z-40 transition-transform duration-300 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  )
}
