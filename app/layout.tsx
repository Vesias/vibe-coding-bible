import type { Metadata } from 'next'
import { Inter, Fira_Code, Cinzel, Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { DivineNavigation } from '@/components/navigation/DivineNavigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingbible.agentland.saarland'),
  title: {
    default: 'Die Vibe Coding Bibel - Meistere KI-unterstützte Entwicklung',
    template: '%s | Die Vibe Coding Bibel'
  },
  description: 'Verwandle deine Entwicklungsfähigkeiten mit den 10 heiligen Geboten des Vibe Codings. Meistere KI-unterstützte Programmierung mit Claude, Copilot und modernen Tools.',
  keywords: [
    'AI programming',
    'Claude Code',
    'GitHub Copilot',
    'Next.js',
    'TypeScript',
    'SaaS development',
    'Vibe Coding',
    'Interactive workshop',
    'Software development'
  ],
  authors: [{ name: 'Vibe Coding Academy' }],
  creator: 'Vibe Coding Academy',
  publisher: 'Agent Land',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Die Vibe Coding Bibel',
    title: 'Meistere KI-unterstützte Entwicklung - Die Vibe Coding Bibel',
    description: 'Verwandle deine Entwicklungsfähigkeiten mit den 10 heiligen Geboten des Vibe Codings. Interaktive Workshops, Echtzeit-Zusammenarbeit und gamifiziertes Lernen.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Die Vibe Coding Bibel - Interaktive Workshop-Erfahrung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meistere KI-unterstützte Entwicklung - Die Vibe Coding Bibel',
    description: 'Verwandle deine Entwicklungsfähigkeiten mit den 10 heiligen Geboten des Vibe Codings.',
    images: ['/og-image.jpg'],
    creator: '@vibecodingbible',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} ${cinzel.variable} ${montserrat.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen">
            <DivineNavigation />
            <div className="pt-16 md:pt-20">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}