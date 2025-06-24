'use client'

import { Thing, WithContext } from 'schema-dts'
import { organizationSchema, localBusinessSchema } from '@/lib/seo/config'

interface SchemaMarkupProps {
  schema: WithContext<Thing> | Thing | Thing[]
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const jsonLd = Array.isArray(schema) 
    ? {
        '@context': 'https://schema.org',
        '@graph': schema
      }
    : {
        '@context': 'https://schema.org',
        ...(schema as any)
      }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2)
      }}
    />
  )
}

// Pre-configured schema components
export function OrganizationSchema() {
  return <SchemaMarkup schema={organizationSchema as any} />
}

export function LocalBusinessSchema() {
  return <SchemaMarkup schema={localBusinessSchema as any} />
}

// FAQ Schema Component
export function FAQSchema({ 
  faqs 
}: { 
  faqs: Array<{ question: string; answer: string }> 
}) {
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return <SchemaMarkup schema={faqSchema as any as any} />
}

// Breadcrumb Schema
export function BreadcrumbSchema({ 
  items 
}: { 
  items: Array<{ name: string; url: string }> 
}) {
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return <SchemaMarkup schema={breadcrumbSchema as any} />
}

// Course Schema Component
export function CourseSchema({
  name,
  description,
  url,
  image,
  instructor,
  price,
  currency = 'EUR',
  duration,
  level,
  prerequisites = [],
  learningOutcomes = []
}: {
  name: string
  description: string
  url: string
  image?: string
  instructor?: string
  price?: number
  currency?: string
  duration?: string
  level?: string
  prerequisites?: string[]
  learningOutcomes?: string[]
}) {
  const courseSchema = {
    '@type': 'Course',
    name,
    description,
    url,
    image: image || '/og-image.jpg',
    provider: {
      '@type': 'Organization',
      name: 'Vibe Coding Academy',
      url: 'https://vibecodingbible.agentland.saarland'
    },
    ...(instructor && {
      instructor: {
        '@type': 'Person',
        name: instructor
      }
    }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString()
      }
    }),
    ...(duration && { timeRequired: duration }),
    ...(level && { educationalLevel: level }),
    ...(prerequisites.length > 0 && { coursePrerequisites: prerequisites }),
    ...(learningOutcomes.length > 0 && {
      teaches: learningOutcomes.map(outcome => ({
        '@type': 'DefinedTerm',
        name: outcome
      }))
    }),
    inLanguage: 'de',
    availableLanguage: 'German',
    educationalCredentialAwarded: 'Certificate of Completion'
  }

  return <SchemaMarkup schema={courseSchema as any} />
}

// Product Schema for Premium Plans
export function ProductSchema({
  name,
  description,
  price,
  currency = 'EUR',
  sku,
  brand = 'Vibe Coding Academy'
}: {
  name: string
  description: string
  price: number
  currency?: string
  sku?: string
  brand?: string
}) {
  const productSchema = {
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    ...(sku && { sku }),
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: brand
      }
    }
  }

  return <SchemaMarkup schema={productSchema as any} />
}

// Review Schema Component
export function ReviewSchema({
  itemName,
  reviewBody,
  ratingValue,
  bestRating = 5,
  author,
  datePublished
}: {
  itemName: string
  reviewBody: string
  ratingValue: number
  bestRating?: number
  author: string
  datePublished: string
}) {
  const reviewSchema = {
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Thing',
      name: itemName
    },
    reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue,
      bestRating
    },
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished
  }

  return <SchemaMarkup schema={reviewSchema as any} />
}

// Website Schema
export function WebsiteSchema() {
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': 'https://vibecodingbible.agentland.saarland/#website',
    url: 'https://vibecodingbible.agentland.saarland',
    name: 'Die Vibe Coding Bibel',
    description: 'Meistere KI-unterstützte Entwicklung mit interaktiven Workshops',
    publisher: {
      '@id': 'https://vibecodingbible.agentland.saarland/#organization'
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://vibecodingbible.agentland.saarland/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    ],
    inLanguage: 'de-DE'
  }

  return <SchemaMarkup schema={websiteSchema as any} />
}