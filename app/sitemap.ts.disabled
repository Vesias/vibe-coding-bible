import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingbible.agentland.saarland'
  const currentDate = new Date()
  
  // Workshop commandments with Roman numerals
  const workshops = [
    { id: 'i', name: 'heilige-vision', priority: 0.9 },
    { id: 'ii', name: 'der-rechte-stack', priority: 0.9 },
    { id: 'iii', name: 'die-prompt-kunst', priority: 0.9 },
    { id: 'iv', name: 'multi-context-programming', priority: 0.9 },
    { id: 'v', name: 'die-heilige-iteration', priority: 0.9 },
    { id: 'vi', name: 'goettliches-debugging', priority: 0.9 },
    { id: 'vii', name: 'kunst-des-vertrauens', priority: 0.9 },
    { id: 'viii', name: 'skalierungsstufen', priority: 0.9 },
    { id: 'ix', name: 'zusammenarbeit-propheten', priority: 0.9 },
    { id: 'x', name: 'monetarisierung', priority: 0.9 }
  ]
  
  // Generate workshop URLs
  const workshopUrls = workshops.flatMap((workshop) => [
    // Main workshop page
    {
      url: `${baseUrl}/workshops/${workshop.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: workshop.priority,
    },
    // Individual workshop lessons (if they exist)
    ...Array.from({ length: 5 }, (_, i) => ({
      url: `${baseUrl}/workshops/${workshop.id}/lesson-${i + 1}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  ])

  // E-book chapters
  const ebookChapters = workshops.map((workshop) => ({
    url: `${baseUrl}/ebook/${workshop.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Pricing tiers
  const pricingPages = [
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing/basic`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing/pro`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing/enterprise`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  // Dynamic content based on features
  const dynamicPages = [
    // Workshop categories
    {
      url: `${baseUrl}/workshops/beginner`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/workshops/intermediate`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/workshops/advanced`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Learning paths
    {
      url: `${baseUrl}/learning-paths/ai-development`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/learning-paths/fullstack`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Tools and resources
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    // Blog/Articles (if added)
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }
  ]

  return [
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    
    // Main sections - high priority
    {
      url: `${baseUrl}/workshops`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ebook`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collaboration`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    
    // User-related pages
    {
      url: `${baseUrl}/auth`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/referrals`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    
    // Information pages
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/imprint`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    
    // All workshop pages
    ...workshopUrls,
    
    // E-book chapters
    ...ebookChapters,
    
    // Pricing pages
    ...pricingPages,
    
    // Dynamic content
    ...dynamicPages,
  ].sort((a, b) => b.priority - a.priority) // Sort by priority descending
}