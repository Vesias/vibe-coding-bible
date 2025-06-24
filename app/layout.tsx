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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

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