import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
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
      <section className="relative h-screen min-h-[700px] bg-[#0a0a0a] overflow-hidden flex">

        {/* Right: Architectural photo */}
        <div className="absolute right-0 top-0 w-full lg:w-[52%] h-full">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1800"
            alt="Luxury property"
            fill
            priority
            className="object-cover opacity-60"
            sizes="52vw"
          />
          {/* Fade from black on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
        </div>

        {/* Left: Text content */}
        <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-20 w-full lg:w-[58%] pt-24">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-10">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[#c9a84c]/70 text-[11px] tracking-[0.45em] uppercase font-medium">
                Est. 2019 · Morocco
              </span>
            </div>

            <h1 className="font-heading leading-[0.92] tracking-tight mb-10">
              <span className="block text-white/80 text-[clamp(3.5rem,7vw,6.5rem)] font-light">
                Find Your
              </span>
              <span className="block text-[#c9a84c] italic text-[clamp(3.5rem,7vw,6.5rem)] font-bold">
                Perfect
              </span>
              <span
                className="block text-[clamp(3.5rem,7vw,6.5rem)] font-bold"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.3)', color: 'transparent' }}
              >
                Property
              </span>
            </h1>

            <p className="text-white/35 text-base leading-relaxed max-w-sm mb-10 font-light">
              Morocco's most curated real estate platform — connecting discerning clients with extraordinary homes.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2.5 bg-[#c9a84c] text-white text-xs tracking-[0.25em] uppercase font-semibold px-8 py-4 hover:bg-[#a8892e] transition-colors duration-300 group"
              >
                Explore Listings
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="text-white/40 text-xs tracking-[0.25em] uppercase font-medium hover:text-white/80 transition-colors duration-300 border-b border-white/10 hover:border-white/30 pb-0.5"
              >
                Talk to an Agent
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {[
              { n: '500+', label: 'Premium Listings' },
              { n: '12+', label: 'Cities' },
              { n: '98%', label: 'Client Satisfaction' },
              { n: '5+', label: 'Years of Excellence' },
            ].map((s) => (
              <div key={s.label} className="px-8 py-5 backdrop-blur-sm bg-white/[0.02]">
                <div className="font-heading text-2xl font-bold text-white">{s.n}</div>
                <div className="text-white/25 text-[10px] tracking-[0.2em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-[#c9a84c] text-[10px] tracking-[0.45em] uppercase mb-5 font-medium">
                Handpicked for You
              </p>
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-[#0a0a0a] leading-tight tracking-tight">
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
      <section className="bg-[#0a0a0a] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-light text-white leading-snug tracking-tight">
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
      <section className="py-28 bg-[#f5f2ec]">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="mb-16">
            <p className="text-[#c9a84c] text-[10px] tracking-[0.45em] uppercase mb-5 font-medium">Browse by Type</p>
            <h2 className="font-heading text-5xl font-bold text-[#0a0a0a] tracking-tight">
              What are you
              <br />
              <em className="not-italic text-[#0a0a0a]/25">looking for?</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Apartments', type: 'apartment' },
              { label: 'Villas', type: 'villa' },
              { label: 'Houses', type: 'house' },
              { label: 'Offices', type: 'office' },
              { label: 'Land', type: 'land' },
              { label: 'Commercial', type: 'commercial' },
            ].map((cat) => (
              <Link
                key={cat.type}
                href={`/properties?property_type=${cat.type}`}
                className="group relative bg-white border border-stone-200/80 hover:border-[#c9a84c] hover:bg-[#0a0a0a] transition-all duration-500 p-8 flex flex-col justify-between min-h-[140px]"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-stone-300 group-hover:text-[#c9a84c]/60 transition-colors duration-500 font-medium">
                  L33
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0a0a0a] group-hover:text-white transition-colors duration-500 leading-tight">
                    {cat.label}
                  </h3>
                  <ArrowUpRight
                    size={14}
                    className="text-stone-300 group-hover:text-[#c9a84c] mt-2 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-36 bg-[#0a0a0a] overflow-hidden">
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
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
            Your dream home
            <br />
            <em className="text-[#c9a84c]">is one call away.</em>
          </h2>
          <p className="text-white/25 text-base font-light leading-relaxed mb-12 max-w-md mx-auto">
            Let our agents guide you to the perfect property — on your terms, on your timeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-[#c9a84c] text-white text-xs tracking-[0.25em] uppercase font-semibold px-10 py-4 hover:bg-[#a8892e] transition-colors duration-300 group"
            >
              Contact Our Team
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 text-xs tracking-[0.25em] uppercase font-medium hover:text-white/70 transition-colors duration-300 border-b border-white/10 hover:border-white/25 pb-0.5"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
