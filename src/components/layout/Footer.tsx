import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <span className="font-heading text-2xl font-bold text-brand-gold tracking-widest">
                L33
              </span>
              <span className="ml-2 text-sm text-white tracking-[0.3em] uppercase font-light">
                Real Estate
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              L33 Real Estate offers premium properties curated for discerning clients. We bring
              excellence, trust, and transparency to every transaction.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-gold hover:text-brand-gold-dark transition-colors duration-200 text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-gold mb-6">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/properties', label: 'All Properties' },
                { href: '/properties?listing_type=buy', label: 'Buy Property' },
                { href: '/properties?listing_type=rent', label: 'Rent Property' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-gold mb-6">
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-brand-gold mt-0.5 shrink-0" />
                <a
                  href="tel:+212600000000"
                  className="text-sm text-white/60 hover:text-brand-gold transition-colors duration-200"
                >
                  +212 600 000 000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-brand-gold mt-0.5 shrink-0" />
                <a
                  href="mailto:contact@l33realestate.ma"
                  className="text-sm text-white/60 hover:text-brand-gold transition-colors duration-200"
                >
                  contact@l33realestate.ma
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-gold mt-0.5 shrink-0" />
                <span className="text-sm text-white/60">
                  Casablanca, Morocco
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {currentYear} L33 Real Estate. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-white/40 hover:text-brand-gold transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-xs text-white/40 hover:text-brand-gold transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
