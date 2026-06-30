import Link from 'next/link'
import { Shield, Star, Users, Zap, Building2, Home, TreePine, Briefcase, Map } from 'lucide-react'
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

const features = [
  {
    icon: Star,
    title: 'Premium Listings',
    description:
      'Every property in our portfolio is carefully selected and verified for quality and value.',
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description:
      'Our experienced agents provide personalized advice tailored to your needs and budget.',
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description:
      'We ensure full transparency in every transaction with verified listings and legal compliance.',
  },
  {
    icon: Zap,
    title: 'Easy Process',
    description:
      'From discovery to keys, our streamlined process makes buying or renting effortless.',
  },
]

const categories = [
  { label: 'Apartments', type: 'apartment', icon: Building2 },
  { label: 'Villas', type: 'villa', icon: Home },
  { label: 'Houses', type: 'house', icon: Home },
  { label: 'Offices', type: 'office', icon: Briefcase },
  { label: 'Land', type: 'land', icon: TreePine },
  { label: 'Commercial', type: 'commercial', icon: Map },
]

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-brand-black overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #c9a84c22 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c9a84c15 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <p className="text-brand-gold text-xs tracking-[0.5em] uppercase mb-6 animate-fade-in">
            Premium Real Estate
          </p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wider leading-tight">
            Find Your{' '}
            <span className="text-brand-gold">Dream</span>
            <br />
            Property
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light tracking-wide">
            Premium real estate, curated for discerning clients across Morocco
          </p>

          {/* SearchBar */}
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4">
              Handpicked for You
            </p>
            <h2 className="section-heading gold-underline inline-block">
              Featured Properties
            </h2>
          </div>

          {featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 border border-brand-black text-brand-black px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-black hover:text-white transition-all duration-300"
                >
                  View All Properties
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-brand-gray">
                No properties available at the moment. Check back soon.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 border border-brand-gold text-brand-gold px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why L33 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="section-heading gold-underline inline-block">
              The L33 Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 border border-brand-gold text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4">
              Browse by Category
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-wider gold-underline inline-block">
              Property Types
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.type}
                  href={`/properties?property_type=${category.type}`}
                  className="group flex flex-col items-center justify-center p-6 border border-white/10 hover:border-brand-gold transition-all duration-300 hover:bg-white/5"
                >
                  <Icon
                    size={28}
                    className="text-white/40 group-hover:text-brand-gold transition-colors duration-300 mb-3"
                  />
                  <span className="text-white/60 group-hover:text-white text-xs tracking-widest uppercase font-medium transition-colors duration-300">
                    {category.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-brand-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-wider mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-white/80 text-lg mb-10 font-light">
            Our expert agents are ready to help you find the perfect home or investment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-all duration-300"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-brand-gold transition-all duration-300"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
