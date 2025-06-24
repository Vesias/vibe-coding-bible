import type { Metadata } from 'next'
import { Inter, Fira_Code, Cinzel, Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { DivineNavigation } from '@/components/navigation/DivineNavigation'
import { DivineFooter } from '@/components/layout/DivineFooter'
// import { FloatingExportButton } from '@/components/export/FloatingExportButton'
// import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner'
import { OrganizationSchema, LocalBusinessSchema, WebsiteSchema } from '@/components/seo/SchemaMarkup'
import { generateSEOMetadata } from '@/lib/seo/config'

// OPTIMIZED FONT LOADING - Performance Improvement
// Using display: 'swap' for better Core Web Vitals
// Loading only required weights to reduce bundle size
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'] // Only load weights we actually use
})

const firaCode = Fira_Code({ 
  subsets: ['latin'], 
  variable: '--font-fira-code',
  display: 'swap',
  weight: ['400', '500', '600'] // Reduced weight variants
})

const cinzel = Cinzel({ 
  subsets: ['latin'], 
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700'] // Sacred font for headings
})

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'] // Display font for impact
})

export const metadata: Metadata = generateSEOMetadata({
  title: 'Die Vibe Coding Bibel - Meistere KI-unterstützte Entwicklung',
  description: 'Lerne KI-unterstützte Programmierung mit den 10 heiligen Geboten des Vibe Codings. Interaktive Workshops, Live-Coding und praktische Projekte für moderne Entwickler in Deutschland.',
  keywords: [
    'KI-Entwicklung lernen',
    'Programmieren mit KI', 
    'Claude Code Tutorial',
    'GitHub Copilot Kurs',
    'AI Coding Deutschland',
    'Saarland',
    'Interaktive Workshops',
    'Next.js TypeScript',
    'SaaS Entwicklung',
    'Coding Bootcamp'
  ],
  images: [
    {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Die Vibe Coding Bibel - Meistere KI-unterstützte Entwicklung'
    }
  ]
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
        <WebsiteSchema />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for PWA */}
        <meta name="theme-color" content="#FFD700" />
        <meta name="background-color" content="#0A0A0A" />
        
        {/* Apple PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VibeCoding" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        
        {/* Microsoft PWA tags */}
        <meta name="msapplication-TileColor" content="#FFD700" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        
        {/* Viewport optimization for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        
        {/* Disable automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} ${cinzel.variable} ${montserrat.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <DivineNavigation />
            <div style={{ paddingTop: '80px', flex: 1 }}>
              {children}
            </div>
            <DivineFooter />
            {/* <FloatingExportButton /> */}
            {/* <CookieConsentBanner /> */}
          </div>
        </Providers>
      </body>
    </html>
  )
}