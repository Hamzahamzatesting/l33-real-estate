import Link from 'next/link'
import { ArrowRight, Shield, Award, TrendingUp, HeadphonesIcon, Building2, Home, TreePine, Briefcase, Map, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import SearchBar from '@/components/properties/SearchBar'
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

const stats = [
  { value: '500+', label: 'Premium Listings' },
  { value: '12+', label: 'Cities Covered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '5+', label: 'Years of Excellence' },
]

const features = [
  {
    icon: Award,
    number: '01',
    title: 'Curated Listings',
    description: 'Every property is hand-selected and verified for quality, authenticity, and investment value.',
  },
  {
    icon: Shield,
    number: '02',
    title: 'Trusted & Transparent',
    description: 'Full legal compliance, verified ownership, and zero hidden fees — your trust is our foundation.',
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'Smart Investment',
    description: 'Data-driven insights and market expertise to help you maximize your real estate returns.',
  },
  {
    icon: HeadphonesIcon,
    number: '04',
    title: 'White-Glove Service',
    description: 'Dedicated agents available from search to signature, making your journey seamless.',
  },
]

const categories = [
  { label: 'Apartments', type: 'apartment', icon: Building2, count: 'Urban Living' },
  { label: 'Villas', type: 'villa', icon: Home, count: 'Luxury Estates' },
  { label: 'Houses', type: 'house', icon: Home, count: 'Family Homes' },
  { label: 'Offices', type: 'office', icon: Briefcase, count: 'Prime Locations' },
  { label: 'Land', type: 'land', icon: TreePine, count: 'Build Your Vision' },
  { label: 'Commercial', type: 'commercial', icon: Map, count: 'Business Spaces' },
]

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-brand-black overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gold glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px]" style={{ background: '#c9a84c' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full opacity-8 blur-[100px]" style={{ background: '#c9a84c' }} />

        {/* Vertical gold line accent */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/40 to-transparent hidden lg:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-brand-gold" />
                <span className="text-brand-gold text-xs tracking-[0.5em] uppercase font-medium">L33 Real Estate</span>
              </div>

              <h1 className="font-heading text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8">
                Where Luxury
                <br />
                <span className="text-brand-gold italic">Meets</span>
                <br />
                Real Estate
              </h1>

              <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-md font-light">
                Morocco's most exclusive property platform — connecting discerning buyers with extraordinary homes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 bg-brand-gold text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-gold-dark transition-all duration-300 group"
                >
                  Explore Properties
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
                >
                  Talk to an Agent
                </Link>
              </div>
            </div>

            {/* Right: Stats card */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-10">
                  <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-6">Our Numbers</p>
                  <div className="grid grid-cols-2 gap-8">
                    {stats.map((stat) => (
                      <div key={stat.label} className="border-l-2 border-brand-gold pl-5">
                        <div className="font-heading text-4xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-white/40 text-xs tracking-widest uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative corner */}
                <div className="absolute -top-3 -right-3 w-24 h-24 border-t-2 border-r-2 border-brand-gold/40" />
                <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b-2 border-l-2 border-brand-gold/40" />
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-16 border-t border-white/10 pt-12">
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-6">Quick Search</p>
            <SearchBar />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-white animate-pulse" />
          <span className="text-white text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── STATS BAR (mobile) ── */}
      <section className="lg:hidden bg-brand-black border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-brand-gold pl-4">
              <div className="font-heading text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-28 bg-[#f7f4ef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-brand-gold" />
                <span className="text-brand-gold text-xs tracking-[0.4em] uppercase">Handpicked for You</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-black tracking-tight leading-tight">
                Featured
                <br />
                <span className="text-brand-gold italic">Properties</span>
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-brand-black text-sm tracking-widest uppercase font-semibold border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-all duration-300 group self-start md:self-auto"
            >
              View All
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-stone-300">
              <p className="text-brand-gray text-sm tracking-wider uppercase">No listings yet — check back soon</p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 border border-brand-gold text-brand-gold px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY L33 ── */}
      <section className="py-28 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Left label */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-brand-gold" />
                <span className="text-brand-gold text-xs tracking-[0.4em] uppercase">Why Choose Us</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-8">
                The L33
                <br />
                <span className="text-brand-gold italic">Difference</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                We don't just sell properties — we deliver a complete real estate experience built on trust, expertise, and results.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-brand-gold text-sm tracking-widest uppercase font-semibold border-b border-brand-gold pb-1 hover:opacity-70 transition-opacity group"
              >
                About Us
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: feature cards */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-px bg-white/5">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="bg-brand-black p-8 group hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-brand-gold/30"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 border border-brand-gold/30 text-brand-gold group-hover:bg-brand-gold group-hover:text-white group-hover:border-brand-gold transition-all duration-300">
                        <Icon size={20} />
                      </div>
                      <span className="font-heading text-5xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                        {feature.number}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white mb-3 tracking-wide group-hover:text-brand-gold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-28 bg-[#f7f4ef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-gold" />
              <span className="text-brand-gold text-xs tracking-[0.4em] uppercase">Browse by Type</span>
              <div className="h-px w-8 bg-brand-gold" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-black tracking-tight">
              Find Your <span className="text-brand-gold italic">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.type}
                  href={`/properties?property_type=${category.type}`}
                  className="group relative overflow-hidden bg-white border border-stone-200 p-6 hover:border-brand-gold hover:shadow-xl transition-all duration-400 flex flex-col items-center text-center"
                >
                  <div className="absolute inset-0 bg-brand-black translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-stone-200 group-hover:border-brand-gold/40 mb-4 transition-colors duration-300">
                      <Icon size={22} className="text-brand-gray group-hover:text-brand-gold transition-colors duration-300" />
                    </div>
                    <p className="font-heading text-sm font-semibold text-brand-black group-hover:text-white transition-colors duration-300 tracking-wide">
                      {category.label}
                    </p>
                    <p className="text-[10px] text-brand-gray group-hover:text-white/50 transition-colors duration-300 tracking-wider uppercase mt-1">
                      {category.count}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-32 bg-brand-black overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-transparent to-brand-black" />
        {/* Gold accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-brand-gold" />
            <span className="text-brand-gold text-xs tracking-[0.5em] uppercase">Get Started</span>
            <div className="h-px w-12 bg-brand-gold" />
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            Your Dream Property
            <br />
            <span className="text-brand-gold italic">Awaits You</span>
          </h2>
          <p className="text-white/40 text-lg mb-12 font-light max-w-xl mx-auto leading-relaxed">
            Our expert agents are ready to guide you to the perfect home or investment — on your terms, on your timeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-gold-dark transition-all duration-300 group"
            >
              Contact Our Team
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
