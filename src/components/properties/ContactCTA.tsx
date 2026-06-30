import { Phone, MessageCircle, Mail } from 'lucide-react'

interface ContactCTAProps {
  agentName?: string
  agentPhone?: string
  propertyTitle: string
  referenceId: string
}

export default function ContactCTA({
  agentName,
  agentPhone,
  propertyTitle,
  referenceId,
}: ContactCTAProps) {
  const phone = agentPhone || '+212600000000'
  const cleanPhone = phone.replace(/\s+/g, '').replace('+', '')
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in the property: ${propertyTitle} (Ref: ${referenceId})`
  )

  return (
    <div className="bg-white border border-stone-200 p-6 sticky top-24">
      <div className="border-b border-stone-100 pb-5 mb-5">
        <p className="text-xs text-brand-gray uppercase tracking-widest mb-1">
          Listed by
        </p>
        <h3 className="font-heading text-lg font-semibold text-brand-black">
          {agentName || 'L33 Real Estate'}
        </h3>
        {agentPhone && (
          <p className="text-sm text-brand-gray mt-1">{agentPhone}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-3 w-full bg-brand-black text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
        >
          <Phone size={16} />
          Call Agent
        </a>

        <a
          href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-[#1ebe57] transition-all duration-300"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>

        <a
          href={`mailto:contact@l33realestate.ma?subject=Inquiry: ${encodeURIComponent(propertyTitle)}&body=${encodeURIComponent(`Hello,\n\nI am interested in the property: ${propertyTitle} (Ref: ${referenceId}).\n\nPlease contact me.\n\nThank you.`)}`}
          className="flex items-center justify-center gap-3 w-full border border-brand-gold text-brand-gold py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-brand-gold hover:text-white transition-all duration-300"
        >
          <Mail size={16} />
          Email Inquiry
        </a>
      </div>

      <p className="mt-4 text-center text-xs text-brand-gray">
        Reference: <span className="font-medium text-brand-black">{referenceId}</span>
      </p>
    </div>
  )
}
