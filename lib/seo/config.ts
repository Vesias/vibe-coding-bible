import { Metadata } from 'next'
import { Course, Organization, LocalBusiness, Product } from 'schema-dts'

// SEO Configuration for Vibe Coding Bible
export const seoConfig = {
  // Base URLs and domains
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingbible.agentland.saarland',
  defaultLocale: 'de',
  locales: ['de', 'en'],
  
  // Company Information
  company: {
    name: 'Vibe Coding Academy',
    description: 'Meistere KI-unterstützte Entwicklung mit interaktiven Workshops',
    email: 'info@vibecodingbible.agentland.saarland',
    phone: '+49 681 123456',
    address: {
      street: 'Saarbrücker Straße 123',
      city: 'Saarbrücken',
      state: 'Saarland',
      postalCode: '66111',
      country: 'DE'
    },
    social: {
      twitter: '@vibecodingbible',
      linkedin: 'company/vibe-coding-academy',
      github: 'vibe-coding-bible',
      youtube: '@vibecodingacademy'
    }
  },

  // German SEO Keywords - Primary Focus
  keywords: {
    primary: [
      'KI-Entwicklung lernen',
      'Programmieren mit KI',
      'AI Coding Deutschland',
      'Claude Code Tutorial',
      'GitHub Copilot Kurs',
      'KI-unterstützte Programmierung',
      'Vibe Coding Methode',
      'Software Development AI',
      'Programmieren lernen 2025',
      'KI Tools für Entwickler'
    ],
    secondary: [
      'Next.js TypeScript Kurs',
      'React Entwicklung KI',
      'SaaS Entwicklung Deutschland',
      'MVP Programmierung',
      'Coding Bootcamp Saarland',
      'Interaktive Programmierkurse',
      'Online Coding Workshop',
      'Entwickler Community Deutschland',
      'AI-First Development',
      'Modern Web Development'
    ],
    local: [
      'Programmieren lernen Saarland',
      'Coding Kurs Saarbrücken',
      'IT Weiterbildung Saarland',
      'Software Entwickler Ausbildung',
      'Tech Skills Saarbrücken',
      'Digitale Bildung Saarland'
    ]
  },

  // Default metadata template
  defaultMetadata: {
    title: {
      default: 'Die Vibe Coding Bibel - Meistere KI-unterstützte Entwicklung',
      template: '%s | Vibe Coding Bibel'
    },
    description: 'Lerne KI-unterstützte Programmierung mit den 10 heiligen Geboten des Vibe Codings. Interaktive Workshops, Live-Coding und praktische Projekte für moderne Entwickler.',
    applicationName: 'Vibe Coding Bibel',
    authors: [{ name: 'Vibe Coding Academy', url: 'https://vibecodingbible.agentland.saarland' }],
    creator: 'Vibe Coding Academy',
    publisher: 'Agent Land Saarland',
    generator: 'Next.js',
    classification: 'Education, Technology, Programming',
    category: 'Education',
    keywords: [
      'KI-Entwicklung',
      'Programmieren mit KI', 
      'Claude Code',
      'GitHub Copilot',
      'Next.js',
      'TypeScript',
      'React',
      'SaaS Development',
      'Interactive Learning',
      'Coding Workshop',
      'Deutschland',
      'Saarland'
    ]
  }
}

// Generate page-specific metadata
export function generateSEOMetadata(params: {
  title?: string
  description?: string
  keywords?: string[]
  path?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
  images?: Array<{
    url: string
    width?: number
    height?: number
    alt?: string
  }>
}): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '',
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    images = []
  } = params

  const pageTitle = title 
    ? `${title} | ${seoConfig.defaultMetadata.title.default}`
    : seoConfig.defaultMetadata.title.default

  const pageDescription = description || seoConfig.defaultMetadata.description
  const pageUrl = `${seoConfig.baseUrl}${path}`
  
  // Combine keywords
  const allKeywords = [
    ...seoConfig.keywords.primary,
    ...seoConfig.keywords.secondary,
    ...keywords,
    ...(path.includes('workshop') ? ['Workshop', 'Interaktiver Kurs', 'Hands-on Learning'] : []),
    ...(path.includes('pricing') ? ['Preise', 'Kosten', 'Abonnement'] : []),
    ...(tags || [])
  ]

  // Default image
  const defaultImage = {
    url: `${seoConfig.baseUrl}/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: pageTitle
  }

  const ogImages = images.length > 0 ? images : [defaultImage]

  return {
    metadataBase: new URL(seoConfig.baseUrl),
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    authors: seoConfig.defaultMetadata.authors,
    creator: seoConfig.defaultMetadata.creator,
    publisher: seoConfig.defaultMetadata.publisher,
    applicationName: seoConfig.defaultMetadata.applicationName,
    generator: seoConfig.defaultMetadata.generator,
    classification: seoConfig.defaultMetadata.classification,
    category: seoConfig.defaultMetadata.category,
    
    // Robots and indexing
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: type as any,
      locale: 'de_DE',
      url: pageUrl,
      siteName: seoConfig.defaultMetadata.title.default,
      title: pageTitle,
      description: pageDescription,
      images: ogImages,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(section && { section }),
      ...(tags && { tags })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.company.social.twitter,
      creator: seoConfig.company.social.twitter,
      title: pageTitle,
      description: pageDescription,
      images: ogImages.map(img => img.url)
    },

    // Alternate URLs
    alternates: {
      canonical: pageUrl,
      languages: {
        'de-DE': pageUrl,
        'x-default': pageUrl
      }
    },

    // Additional metadata
    other: {
      'geo.region': 'DE-SL',
      'geo.placename': 'Saarbrücken',
      'geo.position': '49.2401;6.9969',
      'ICBM': '49.2401, 6.9969'
    }
  }
}

// Business Schema.org Data
export const organizationSchema: Organization = {
  '@type': 'Organization',
  '@id': `${seoConfig.baseUrl}/#organization`,
  name: seoConfig.company.name,
  url: seoConfig.baseUrl,
  email: seoConfig.company.email,
  telephone: seoConfig.company.phone,
  description: seoConfig.company.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: seoConfig.company.address.street,
    addressLocality: seoConfig.company.address.city,
    addressRegion: seoConfig.company.address.state,
    postalCode: seoConfig.company.address.postalCode,
    addressCountry: seoConfig.company.address.country
  },
  sameAs: [
    `https://twitter.com/${seoConfig.company.social.twitter.replace('@', '')}`,
    `https://linkedin.com/${seoConfig.company.social.linkedin}`,
    `https://github.com/${seoConfig.company.social.github}`,
    `https://youtube.com/${seoConfig.company.social.youtube}`
  ],
  logo: {
    '@type': 'ImageObject',
    url: `${seoConfig.baseUrl}/logo.png`,
    width: '512',
    height: '512'
  }
}

// Local Business Schema for Saarland presence
export const localBusinessSchema: LocalBusiness = {
  '@type': 'LocalBusiness',
  '@id': `${seoConfig.baseUrl}/#localbusiness`,
  name: seoConfig.company.name,
  image: `${seoConfig.baseUrl}/logo.png`,
  url: seoConfig.baseUrl,
  telephone: seoConfig.company.phone,
  email: seoConfig.company.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: seoConfig.company.address.street,
    addressLocality: seoConfig.company.address.city,
    addressRegion: seoConfig.company.address.state,
    postalCode: seoConfig.company.address.postalCode,
    addressCountry: seoConfig.company.address.country
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.2401,
    longitude: 6.9969
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday', 
      'Wednesday',
      'Thursday',
      'Friday'
    ],
    opens: '09:00',
    closes: '18:00'
  },
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Credit Card, PayPal, Bank Transfer'
}

// Course Schema Template
export function generateCourseSchema(params: {
  name: string
  description: string
  url: string
  image?: string
  price?: number
  currency?: string
  duration?: string
  level?: string
  prerequisites?: string[]
  learningOutcomes?: string[]
}): Course {
  return {
    '@type': 'Course',
    name: params.name,
    description: params.description,
    url: params.url,
    image: params.image || `${seoConfig.baseUrl}/og-image.jpg`,
    provider: {
      '@type': 'Organization',
      name: seoConfig.company.name,
      url: seoConfig.baseUrl
    },
    ...(params.price && {
      offers: {
        '@type': 'Offer',
        price: params.price.toString(),
        priceCurrency: params.currency || 'EUR',
        availability: 'https://schema.org/InStock'
      }
    }),
    ...(params.duration && { timeRequired: params.duration }),
    ...(params.level && { educationalLevel: params.level }),
    ...(params.prerequisites && { coursePrerequisites: params.prerequisites }),
    ...(params.learningOutcomes && { 
      teaches: params.learningOutcomes.map(outcome => ({
        '@type': 'DefinedTerm',
        name: outcome
      }))
    }),
    inLanguage: 'de'
  }
}