'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isHomePage = pathname === '/'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isHomePage && !isScrolled
          ? 'bg-transparent'
          : 'bg-brand-black/95 backdrop-blur-md shadow-lg'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              <span className="font-heading text-2xl font-bold text-brand-gold tracking-widest group-hover:text-brand-gold-dark transition-colors duration-200">
                L33
              </span>
              <span className="ml-2 text-sm text-white tracking-[0.3em] uppercase font-light">
                Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm tracking-widest uppercase font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-brand-gold'
                    : 'text-white/80 hover:text-brand-gold'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 border border-brand-gold text-brand-gold text-sm tracking-widest uppercase px-5 py-2 hover:bg-brand-gold hover:text-white transition-all duration-300 font-medium"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-brand-gold transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-black/98 backdrop-blur-md border-t border-white/10">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm tracking-widest uppercase font-medium py-2 border-b border-white/10 transition-colors duration-200',
                  pathname === link.href
                    ? 'text-brand-gold'
                    : 'text-white/80 hover:text-brand-gold'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 text-center border border-brand-gold text-brand-gold text-sm tracking-widest uppercase px-5 py-3 hover:bg-brand-gold hover:text-white transition-all duration-300 font-medium"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
