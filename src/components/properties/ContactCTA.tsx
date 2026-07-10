import { MessageCircle } from 'lucide-react'

interface ContactCTAProps {
  agentName?: string
  agentPhone?: string
  propertyTitle: string
  referenceId: string
}

const WHATSAPP_NUMBER = '971585854164' // +971585854164

export default function ContactCTA({
  agentName,
  agentPhone,
  propertyTitle,
  referenceId,
}: ContactCTAProps) {
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in the property: ${propertyTitle} (Ref: ${referenceId})`
  )

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

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

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-[#1ebe57] transition-all duration-300"
      >
        <MessageCircle size={16} />
        Contact via WhatsApp
      </a>

      <p className="mt-4 text-center text-xs text-brand-gray">
        Reference: <span className="font-medium text-brand-black">{referenceId}</span>
      </p>
    </div>
  )
}
