import { NextRequest, NextResponse } from 'next/server'

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  premium?: {
    maxRequests: number // Higher limit for premium users
  }
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Generate unique key for rate limiting
      const key = options.keyGenerator 
        ? options.keyGenerator(request)
        : getDefaultKey(request)

      const now = Date.now()
      const windowStart = now - options.windowMs

      // Clean up expired entries
      for (const [storeKey, data] of rateLimitStore.entries()) {
        if (data.resetTime < now) {
          rateLimitStore.delete(storeKey)
        }
      }

      // Get current count for this key
      let current = rateLimitStore.get(key)
      
      if (!current || current.resetTime < now) {
        current = {
          count: 0,
          resetTime: now + options.windowMs
        }
      }

      // Check if limit exceeded
      let maxAllowed = options.maxRequests

      // Check if user has premium subscription for higher limits
      if (options.premium) {
        try {
          // Extract user info from request headers or auth
          const authHeader = request.headers.get('authorization')
          if (authHeader) {
            // In a real implementation, you'd verify the token and check subscription
            // For now, we'll assume premium users have a specific header
            const isPremium = request.headers.get('x-subscription-tier') !== 'free'
            if (isPremium) {
              maxAllowed = options.premium.maxRequests
            }
          }
        } catch (error) {
          // Fallback to standard limit if we can't determine subscription
        }
      }

      if (current.count >= maxAllowed) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `Too many requests. Limit: ${maxAllowed} per ${options.windowMs / 1000}s`,
            retryAfter: Math.ceil((current.resetTime - now) / 1000)
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxAllowed.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': current.resetTime.toString(),
              'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString()
            }
          }
        )
      }

      // Increment counter
      current.count++
      rateLimitStore.set(key, current)

      // Call the actual handler
      const response = await handler(request)

      // Add rate limit headers to response
      const remaining = Math.max(0, maxAllowed - current.count)
      response.headers.set('X-RateLimit-Limit', maxAllowed.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', current.resetTime.toString())

      return response

    } catch (error) {
      console.error('Rate limit middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

function getDefaultKey(request: NextRequest): string {
  // Use IP address as default key
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') ||
             'unknown'
  
  // Include endpoint in the key to have per-endpoint limits
  const endpoint = request.nextUrl.pathname
  
  return `${ip}:${endpoint}`
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // Standard API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    premium: {
      maxRequests: 200 // 200 requests per minute for premium
    }
  },
  
  // AI chat endpoints (more restrictive)
  aiChat: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    premium: {
      maxRequests: 50 // 50 requests per minute for premium
    }
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 uploads per minute
    premium: {
      maxRequests: 20 // 20 uploads per minute for premium
    }
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    premium: {
      maxRequests: 10 // Same limit for premium (security)
    }
  },
  
  // Webhook endpoints (external services)
  webhook: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    keyGenerator: (request: NextRequest) => {
      // Use a different key for webhooks (e.g., based on source)
      const source = request.headers.get('user-agent') || 'unknown'
      return `webhook:${source}`
    }
  }
}

// Helper function to create rate-limited handlers
export function createRateLimitedHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  configKey: keyof typeof rateLimitConfigs
) {
  return withRateLimit(handler, rateLimitConfigs[configKey])
}

// Redis-based rate limiter for production use
export class RedisRateLimit {
  private redisClient: any // Redis client type
  
  constructor(redisClient: any) {
    this.redisClient = redisClient
  }
  
  async checkLimit(
    key: string, 
    windowMs: number, 
    maxRequests: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const windowStart = now - windowMs
    const resetTime = now + windowMs
    
    // Use Redis sorted sets for sliding window
    const pipeline = this.redisClient.pipeline()
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    
    // Get current count
    pipeline.zcard(key)
    
    // Set expiration
    pipeline.expire(key, Math.ceil(windowMs / 1000))
    
    const results = await pipeline.exec()
    const count = results[2][1]
    
    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetTime
    }
  }
}