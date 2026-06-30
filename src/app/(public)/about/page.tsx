import type { Metadata } from 'next'
import { Shield, Eye, Lightbulb, Heart, Award, Building2, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about L33 Real Estate — our mission, values, and commitment to delivering premium real estate experiences in Morocco.',
}

const values = [
  {
    icon: Shield,
    title: 'Trust',
    description:
      'We build lasting relationships with our clients through honesty, integrity, and transparent communication at every step of the process.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Every property in our portfolio is carefully curated. We maintain the highest standards in presentation, service, and results.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We leverage the latest technology and market insights to provide our clients with a modern, seamless real estate experience.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Clear pricing, honest advice, and full disclosure. There are no hidden fees or surprises when you work with L33 Real Estate.',
  },
]

const stats = [
  { icon: Building2, value: '200+', label: 'Properties Listed' },
  { icon: MapPin, value: '8', label: 'Cities Covered' },
  { icon: Heart, value: '500+', label: 'Happy Clients' },
  { icon: Clock, value: '5+', label: 'Years Experience' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-brand-black py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-brand-gold text-xs tracking-[0.5em] uppercase mb-6">
            Our Story
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white tracking-wider mb-8">
            About L33 Real Estate
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Born from a passion for exceptional properties and a commitment to outstanding
            service, L33 Real Estate has become a trusted name in Morocco&apos;s premium
            real estate market.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4">
                Our Mission
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-black tracking-wider mb-6">
                Elevating the Real Estate Experience
              </h2>
              <div className="space-y-4 text-brand-gray leading-relaxed">
                <p>
                  At L33 Real Estate, we believe that finding the right property is one of
                  the most significant decisions in life. Our mission is to make this
                  journey as smooth, transparent, and rewarding as possible.
                </p>
                <p>
                  We specialize in premium residential and commercial properties across
                  Morocco&apos;s most desirable cities. Our team combines deep local market
                  knowledge with a commitment to personalized service that sets us apart.
                </p>
                <p>
                  Whether you are buying your first home, investing in rental properties,
                  or searching for the perfect commercial space, L33 Real Estate is your
                  trusted partner every step of the way.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="bg-brand-beige p-8 text-center border border-stone-200"
                  >
                    <Icon size={28} className="text-brand-gold mx-auto mb-4" />
                    <div className="font-heading text-4xl font-bold text-brand-black mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs text-brand-gray uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4">
              What We Stand For
            </p>
            <h2 className="section-heading gold-underline inline-block">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="bg-white p-8 border border-stone-200 group hover:border-brand-gold transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 border border-brand-gold text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-brand-black mb-3 tracking-wide">
                    {value.title}
                  </h3>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-wider mb-6">
            Let&apos;s Find Your Next Property
          </h2>
          <p className="text-white/60 mb-10">
            Contact our team today and let us help you discover your dream property.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold tracking-widest uppercase transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  )
}
