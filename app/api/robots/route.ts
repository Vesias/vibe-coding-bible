import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingbible.agentland.saarland'
  
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /_next/
Disallow: /admin/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1

# Popular search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Slurp
Allow: /`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}