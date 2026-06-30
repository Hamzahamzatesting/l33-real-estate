import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'L33 Real Estate | Premium Properties in Morocco',
    template: '%s | L33 Real Estate',
  },
  description:
    'L33 Real Estate offers premium properties for sale and rent in Morocco. Find your dream apartment, villa, or house with our curated listings.',
  keywords: ['real estate', 'Morocco', 'property', 'apartment', 'villa', 'buy', 'rent'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'L33 Real Estate',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
