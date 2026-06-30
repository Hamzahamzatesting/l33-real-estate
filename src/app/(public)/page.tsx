import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Building2, Home, Trees, Briefcase, Store, Landmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import type { Property } from '@/lib/types'

async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)
  return (data as Property[]) || []
}

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative h-screen min-h-[760px] bg-[#0a0a0a] overflow-hidden">

        {/* Full-bleed background photo */}
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=85&w=2400"
          alt="Luxury property"
          fill
          priority
          className="object-cover object-center scale-[1.02]"
          sizes="100vw"
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-[#0a0a0a]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Thin gold vertical accent */}
        <div className="absolute left-8 sm:left-12 lg:left-20 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/30 to-transparent hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 pt-20">
          <div className="max-w-7xl mx-auto w-full">

            <div className="max-w-2xl">
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-8 h-px bg-[#c9a84c]" />
                <span className="text-[#c9a84c]/70 text-[11px] tracking-[0.5em] uppercase font-medium">
                  Est. 2019 · Morocco
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading leading-[0.9] tracking-tight mb-8">
                <span className="block text-white font-light" style={{ fontSize: 'clamp(2rem,8vw,6rem)' }}>
                  Find Your
                </span>
                <span className="block text-[#c9a84c] italic font-bold" style={{ fontSize: 'clamp(2rem,8vw,6rem)' }}>
                  Perfect
                </span>
                <span className="block text-white font-bold" style={{ fontSize: 'clamp(2rem,8vw,6rem)' }}>
                  Property
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-full sm:max-w-xs mb-10 font-light">
                Morocco's most curated real estate platform — extraordinary homes for discerning clients.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/properties"
                  className="flex items-center justify-center gap-2.5 bg-[#c9a84c] text-white text-[11px] tracking-[0.3em] uppercase font-bold px-8 py-4 hover:bg-[#a8892e] transition-colors duration-300 group"
                >
                  Explore Listings
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 text-white/45 text-[11px] tracking-[0.3em] uppercase font-medium hover:text-white/80 transition-colors duration-300 border border-white/15 hover:border-white/30 px-6 py-4"
                >
                  Talk to an Agent
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-16 sm:py-24 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16">
            <div>
              <p className="text-[#c9a84c] text-[10px] tracking-[0.45em] uppercase mb-5 font-medium">
                Handpicked for You
              </p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a0a0a] leading-tight tracking-tight">
                Featured
                <br />
                <em className="not-italic text-[#0a0a0a]/30">Properties</em>
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-[#0a0a0a] text-xs tracking-[0.3em] uppercase font-semibold hover:text-[#c9a84c] transition-colors duration-300 group mt-8 md:mt-0 self-start"
            >
              View All Properties
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid */}
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-stone-200">
              <p className="text-stone-400 text-sm tracking-wider">No listings yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── DIVIDER STATEMENT ─── */}
      <section className="bg-[#0a0a0a] py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-light text-white leading-snug tracking-tight">
                We don't just list
                <br />
                properties — we
                <br />
                <em className="text-[#c9a84c]">deliver experiences.</em>
              </h2>
            </div>
            <div className="space-y-10">
              {[
                { n: '01', title: 'Curated Listings', body: 'Every property is hand-selected and verified for quality, authenticity, and investment potential.' },
                { n: '02', title: 'Trusted Experts', body: 'Our agents bring years of local market expertise to help you make the right decision.' },
                { n: '03', title: 'Seamless Process', body: 'From your first search to signing, we handle every detail so you don\'t have to.' },
              ].map((item) => (
                <div key={item.n} className="flex gap-6 group">
                  <span className="font-heading text-3xl font-bold text-white/8 group-hover:text-[#c9a84c]/20 transition-colors duration-500 leading-none mt-1 flex-shrink-0 w-12">
                    {item.n}
                  </span>
                  <div className="border-t border-white/10 pt-5 group-hover:border-[#c9a84c]/20 transition-colors duration-500">
                    <h3 className="text-white text-sm font-semibold tracking-widest uppercase mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed font-light">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROPERTY CATEGORIES ─── */}
      <section className="py-16 sm:py-24 lg:py-28 bg-[#f5f2ec]">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="mb-16">
            <p className="text-[#c9a84c] text-[10px] tracking-[0.45em] uppercase mb-5 font-medium">Browse by Type</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight">
              What are you
              <br />
              <em className="not-italic text-[#0a0a0a]/25">looking for?</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Apartments', type: 'apartment', icon: Building2, desc: 'Urban living' },
              { label: 'Villas', type: 'villa', icon: Home, desc: 'Luxury estates' },
              { label: 'Houses', type: 'house', icon: Landmark, desc: 'Family homes' },
              { label: 'Offices', type: 'office', icon: Briefcase, desc: 'Prime spaces' },
              { label: 'Land', type: 'land', icon: Trees, desc: 'Build your vision' },
              { label: 'Commercial', type: 'commercial', icon: Store, desc: 'Business spaces' },
            ].map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.type}
                  href={`/properties?property_type=${cat.type}`}
                  className="group bg-white border border-stone-200/80 hover:border-[#c9a84c] hover:bg-[#0a0a0a] transition-all duration-400 p-6 flex flex-col gap-4 min-h-[160px]"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 border border-stone-200 group-hover:border-[#c9a84c]/30 flex items-center justify-center transition-colors duration-400">
                    <Icon size={18} className="text-stone-400 group-hover:text-[#c9a84c] transition-colors duration-400" />
                  </div>

                  {/* Text */}
                  <div className="mt-auto">
                    <h3 className="font-heading text-base font-semibold text-[#0a0a0a] group-hover:text-white transition-colors duration-400 leading-tight mb-1">
                      {cat.label}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 group-hover:text-white/40 transition-colors duration-400">
                      {cat.desc}
                    </p>
                  </div>

                  <ArrowUpRight size={12} className="text-stone-300 group-hover:text-[#c9a84c] transition-all duration-400 self-end group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-20 sm:py-28 lg:py-36 bg-[#0a0a0a] overflow-hidden">
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
            backgroundSize: '200px',
          }}
        />
        {/* Gold left accent */}
        <div className="absolute left-0 top-16 bottom-16 w-[2px] bg-gradient-to-b from-transparent via-[#c9a84c]/60 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
          <p className="text-[#c9a84c]/60 text-[10px] tracking-[0.5em] uppercase mb-8 font-medium">
            Get Started
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
            Your dream home
            <br />
            <em className="text-[#c9a84c]">is one call away.</em>
          </h2>
          <p className="text-white/25 text-base font-light leading-relaxed mb-12 max-w-md mx-auto">
            Let our agents guide you to the perfect property — on your terms, on your timeline.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm mx-auto sm:max-w-none">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2.5 bg-[#c9a84c] text-white text-xs tracking-[0.25em] uppercase font-semibold px-10 py-4 hover:bg-[#a8892e] transition-colors duration-300 group"
            >
              Contact Our Team
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-white/35 text-xs tracking-[0.25em] uppercase font-medium hover:text-white/70 transition-colors duration-300 border border-white/10 hover:border-white/25 px-6 py-4"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
