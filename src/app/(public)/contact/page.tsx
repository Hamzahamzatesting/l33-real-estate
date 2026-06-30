'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import type { Metadata } from 'next'

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+212 600 000 000',
    href: 'tel:+212600000000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@l33realestate.ma',
    href: 'mailto:contact@l33realestate.ma',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+212 600 000 000',
    href: 'https://wa.me/212600000000',
    external: true,
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Casablanca, Morocco',
    href: null,
  },
]

const PROPERTY_INTERESTS = [
  { value: '', label: 'Select property interest' },
  { value: 'buy_apartment', label: 'Buy an Apartment' },
  { value: 'buy_villa', label: 'Buy a Villa' },
  { value: 'buy_house', label: 'Buy a House' },
  { value: 'buy_land', label: 'Buy Land' },
  { value: 'rent_apartment', label: 'Rent an Apartment' },
  { value: 'rent_villa', label: 'Rent a Villa' },
  { value: 'commercial', label: 'Commercial Property' },
  { value: 'investment', label: 'Investment Opportunity' },
  { value: 'other', label: 'Other' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Simulate form submission (replace with actual logic)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative bg-brand-black py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, #c9a84c 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-brand-gold text-xs tracking-[0.5em] uppercase mb-6">
            Get In Touch
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white tracking-wider">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-brand-black tracking-wide mb-4">
                  Let&apos;s Talk
                </h2>
                <p className="text-brand-gray leading-relaxed text-sm">
                  Whether you have a question about a property, want to schedule a viewing,
                  or simply want to explore your options, our team is here to help.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  const content = (
                    <div className="flex items-start gap-4 p-4 border border-stone-200 hover:border-brand-gold transition-all duration-200 group">
                      <div className="p-2 bg-brand-beige group-hover:bg-brand-gold transition-colors duration-200">
                        <Icon size={18} className="text-brand-gold group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray uppercase tracking-widest mb-0.5">
                          {info.label}
                        </p>
                        <p className="text-sm font-medium text-brand-black">{info.value}</p>
                      </div>
                    </div>
                  )

                  if (info.href) {
                    return (
                      <a
                        key={info.label}
                        href={info.href}
                        target={info.external ? '_blank' : undefined}
                        rel={info.external ? 'noopener noreferrer' : undefined}
                      >
                        {content}
                      </a>
                    )
                  }
                  return <div key={info.label}>{content}</div>
                })}
              </div>

              <a
                href="https://wa.me/212600000000?text=Hello%2C%20I%27d%20like%20to%20inquire%20about%20your%20properties."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1ebe57] transition-all duration-300"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-brand-beige p-8 border border-stone-200">
                <h2 className="font-heading text-2xl font-semibold text-brand-black tracking-wide mb-8">
                  Send us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 mb-6">
                      <Send size={24} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-brand-black mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-brand-gray text-sm">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: '', email: '', phone: '', propertyInterest: '', message: '' })
                      }}
                      className="mt-6 text-sm text-brand-gold hover:text-brand-gold-dark transition-colors duration-200 underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-brand-black tracking-wide mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 border border-stone-300 bg-white text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-black tracking-wide mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-stone-300 bg-white text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-brand-black tracking-wide mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+212 6XX XXX XXX"
                          className="w-full px-4 py-3 border border-stone-300 bg-white text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-black tracking-wide mb-1">
                          Property Interest
                        </label>
                        <select
                          name="propertyInterest"
                          value={formData.propertyInterest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-stone-300 bg-white text-sm text-brand-black focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        >
                          {PROPERTY_INTERESTS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black tracking-wide mb-1">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about what you are looking for..."
                        className="w-full px-4 py-3 border border-stone-300 bg-white text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold resize-y"
                      />
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 bg-brand-gold hover:bg-brand-gold-dark text-white py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-stone-200 h-64 flex items-center justify-center">
        <div className="text-center text-stone-500">
          <MapPin size={32} className="mx-auto mb-2 text-stone-400" />
          <p className="text-sm uppercase tracking-widest">Casablanca, Morocco</p>
        </div>
      </section>
    </div>
  )
}
