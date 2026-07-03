'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Building2, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/layout/Logo'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', icon: Building2, exact: false },
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

  const isActive = (item: { href: string; exact: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo size="sm" />
          <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase leading-none">Admin</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6">
        <p className="text-white/15 text-[9px] tracking-[0.3em] uppercase px-3 mb-3">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 group',
                    active
                      ? 'bg-[#c9a84c]/10 text-[#c9a84c]'
                      : 'text-white/35 hover:text-white/70 hover:bg-white/4'
                  )}
                >
                  <Icon size={15} className={cn('flex-shrink-0', active ? 'text-[#c9a84c]' : '')} />
                  <span className="text-xs tracking-wide font-medium">{item.label}</span>
                  {active && <span className="ml-auto w-1 h-1 rounded-full bg-[#c9a84c]" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-white/25 hover:text-white/50 transition-colors duration-200 group"
        >
          <ExternalLink size={14} />
          <span className="text-xs tracking-wide">View Website</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-white/25 hover:text-red-400 transition-colors duration-200 group"
        >
          <LogOut size={14} />
          <span className="text-xs tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f0f0f] text-white/60"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-56 z-40 transition-transform duration-300 lg:hidden',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex flex-col w-56 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
