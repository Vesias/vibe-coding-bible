import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { JWT } from "https://deno.land/x/djwt@v2.9.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
}

interface UserManagementRequest {
  action: 'create_profile' | 'update_profile' | 'update_subscription' | 'sync_progress' | 'check_access' | 'bulk_update'
  data: any
}

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

// Simple in-memory cache for Edge Runtime
class EdgeCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly maxSize = 1000
  
  set(key: string, data: any, ttlSeconds: number = 300): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Rate limiter for user management operations
class UserRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests = 100 // per minute per user
  private readonly windowMs = 60 * 1000 // 1 minute
  
  isAllowed(userId: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(userId)) {
      this.requests.set(userId, [])
    }
    
    const userRequests = this.requests.get(userId)!
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(userId, validRequests)
    
    return true
  }
}

const cache = new EdgeCache()
const rateLimiter = new UserRateLimiter()

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')!

    if (!supabaseUrl || !supabaseKey || !jwtSecret) {
      throw new Error('Missing required environment variables')
    }

    // Verify JWT token
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header')
    }

    const token = authHeader.split(' ')[1]
    let userId: string

    try {
      const payload = await JWT.verify(token, jwtSecret, "HS256")
      userId = payload.sub as string
    } catch (error) {
      throw new Error('Invalid JWT token')
    }

    // Rate limiting per user
    if (!rateLimiter.isAllowed(userId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const requestData: UserManagementRequest = await req.json()

    let result: any

    switch (requestData.action) {
      case 'create_profile':
        result = await createUserProfile(supabase, userId, requestData.data)
        break
      
      case 'update_profile':
        result = await updateUserProfile(supabase, userId, requestData.data)
        break
      
      case 'update_subscription':
        result = await updateUserSubscription(supabase, userId, requestData.data)
        break
      
      case 'sync_progress':
        result = await syncUserProgress(supabase, userId, requestData.data)
        break
      
      case 'check_access':
        result = await checkUserAccess(supabase, userId, requestData.data)
        break
      
      case 'bulk_update':
        result = await bulkUpdateUsers(supabase, requestData.data)
        break
      
      default:
        throw new Error(`Unknown action: ${requestData.action}`)
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('User management error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'User management operation failed',
        message: (error as Error).message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function createUserProfile(supabase: any, userId: string, data: any) {
  const { email, full_name, onboarding_data } = data

  // Create profile with enhanced onboarding data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      full_name,
      subscription_status: 'free',
      prophet_rank: 'novice',
      xp_points: 0,
      level: 1,
      learning_streak: 0,
      onboarding_completed: true,
      onboarding_data: onboarding_data || {},
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (profileError) {
    throw new Error(`Failed to create profile: ${profileError.message}`)
  }

  // Initialize user analytics
  await supabase.from('user_analytics').insert({
    user_id: userId,
    date: new Date().toISOString().split('T')[0],
    sessions: 1,
    total_time_minutes: 0,
    pages_visited: 1,
    engagement_score: 0.1
  })

  // Create welcome notification
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'welcome',
    title: 'Willkommen in der Vibe Coding Bible!',
    message: 'Starten Sie Ihre Reise mit dem ersten heiligen Gebot.',
    action_text: 'Erste Schritte',
    action_url: '/workshops/commandment-i-die-heilige-vision',
    priority: 'normal'
  })

  // Award first achievement
  const { data: firstAchievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('name', 'Erste Schritte')
    .single()

  if (firstAchievement) {
    await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: firstAchievement.id,
      is_completed: true,
      earned_at: new Date().toISOString()
    })
  }

  // Cache user data
  cache.set(`profile:${userId}`, profile, 300)

  return {
    profile,
    welcome_notification_sent: true,
    first_achievement_awarded: !!firstAchievement
  }
}

async function updateUserProfile(supabase: any, userId: string, data: any) {
  const allowedFields = [
    'full_name', 'bio', 'avatar_url', 'location', 'website',
    'linkedin_url', 'github_url', 'preferred_language', 'timezone',
    'learning_preferences', 'notification_preferences'
  ]

  // Filter only allowed fields
  const updateData = Object.keys(data)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key]
      return obj
    }, {} as any)

  updateData.updated_at = new Date().toISOString()

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`)
  }

  // Clear cache
  cache.delete(`profile:${userId}`)
  
  // Cache updated data
  cache.set(`profile:${userId}`, profile, 300)

  // Track profile update
  await supabase.rpc('track_user_activity', {
    p_user_id: userId,
    p_activity_type: 'profile_updated',
    p_details: { updated_fields: Object.keys(updateData) }
  })

  return profile
}

async function updateUserSubscription(supabase: any, userId: string, data: any) {
  const { subscription_status, subscription_id, expires_at } = data

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      subscription_status,
      subscription_id,
      subscription_expires_at: expires_at,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`)
  }

  // Clear related caches
  cache.delete(`profile:${userId}`)
  cache.delete(`access:${userId}`)

  // Check if user gained access to new content
  const accessUpdates = await checkContentAccess(supabase, userId, subscription_status)

  // Send notification about subscription change
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'subscription_updated',
    title: 'Subscription aktualisiert',
    message: `Ihr Subscription-Status wurde auf ${subscription_status} aktualisiert.`,
    action_text: 'Neue Features entdecken',
    action_url: '/dashboard',
    priority: 'normal'
  })

  return {
    profile,
    content_access_updated: accessUpdates
  }
}

async function syncUserProgress(supabase: any, userId: string, data: any) {
  const { commandment_id, progress_percentage, current_module_id, completed_challenges } = data

  // Update user progress
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      commandment_id,
      status: progress_percentage >= 100 ? 'completed' : 'in_progress',
      progress_percentage,
      current_module_id,
      last_accessed: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (progressError) {
    throw new Error(`Failed to sync progress: ${progressError.message}`)
  }

  // Award XP for progress
  let xpAwarded = 0
  if (progress_percentage >= 100) {
    // Award completion XP
    xpAwarded = 200
    await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_xp_amount: xpAwarded,
      p_reason: `Completed Commandment ${commandment_id}`
    })
  } else if (progress_percentage > 0) {
    // Award progress XP
    xpAwarded = Math.floor(progress_percentage / 10) * 5
    await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_xp_amount: xpAwarded,
      p_reason: `Progress on Commandment ${commandment_id}`
    })
  }

  // Update challenge completions
  if (completed_challenges && completed_challenges.length > 0) {
    for (const challengeId of completed_challenges) {
      await supabase
        .from('challenge_submissions')
        .upsert({
          user_id: userId,
          challenge_id: challengeId,
          status: 'completed',
          submitted_at: new Date().toISOString()
        })
    }
  }

  // Check for achievements
  const achievements = await supabase.rpc('check_achievement_eligibility', {
    user_uuid: userId
  })

  // Clear progress cache
  cache.delete(`progress:${userId}`)

  return {
    progress_updated: true,
    xp_awarded: xpAwarded,
    achievements_earned: achievements.data || []
  }
}

async function checkUserAccess(supabase: any, userId: string, data: any) {
  const { resource_type, resource_id } = data
  const cacheKey = `access:${userId}:${resource_type}:${resource_id}`

  // Check cache first
  const cachedAccess = cache.get(cacheKey)
  if (cachedAccess !== null) {
    return cachedAccess
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, level, xp_points')
    .eq('id', userId)
    .single()

  if (!profile) {
    throw new Error('User profile not found')
  }

  let hasAccess = false
  let reason = ''

  switch (resource_type) {
    case 'commandment':
      hasAccess = checkCommandmentAccess(profile.subscription_status, profile.level, resource_id)
      reason = hasAccess ? 'Access granted' : 'Upgrade subscription for access'
      break
    
    case 'workshop':
      hasAccess = checkWorkshopAccess(profile.subscription_status, profile.level, resource_id)
      reason = hasAccess ? 'Access granted' : 'Complete prerequisites or upgrade'
      break
    
    case 'ai_mentoring':
      hasAccess = checkAIMentoringAccess(profile.subscription_status)
      reason = hasAccess ? 'Access granted' : 'AI mentoring requires Pro or Expert subscription'
      break
    
    case 'collaboration':
      hasAccess = checkCollaborationAccess(profile.subscription_status)
      reason = hasAccess ? 'Access granted' : 'Collaboration features require Pro or Expert subscription'
      break
    
    default:
      hasAccess = true
      reason = 'Default access granted'
  }

  const result = {
    has_access: hasAccess,
    reason,
    user_level: profile.level,
    subscription_status: profile.subscription_status
  }

  // Cache result for 5 minutes
  cache.set(cacheKey, result, 300)

  return result
}

async function bulkUpdateUsers(supabase: any, data: any) {
  const { user_ids, update_data, operation_type } = data

  if (!user_ids || user_ids.length === 0) {
    throw new Error('No user IDs provided')
  }

  if (user_ids.length > 100) {
    throw new Error('Bulk operations limited to 100 users at a time')
  }

  const results = []

  for (const userId of user_ids) {
    try {
      let result
      switch (operation_type) {
        case 'subscription_update':
          result = await updateUserSubscription(supabase, userId, update_data)
          break
        
        case 'profile_update':
          result = await updateUserProfile(supabase, userId, update_data)
          break
        
        case 'xp_award':
          await supabase.rpc('award_xp', {
            p_user_id: userId,
            p_xp_amount: update_data.xp_amount,
            p_reason: update_data.reason
          })
          result = { xp_awarded: update_data.xp_amount }
          break
        
        default:
          throw new Error(`Unknown bulk operation: ${operation_type}`)
      }

      results.push({
        user_id: userId,
        success: true,
        data: result
      })
    } catch (error) {
      results.push({
        user_id: userId,
        success: false,
        error: (error as Error).message
      })
    }
  }

  return {
    total_users: user_ids.length,
    successful_updates: results.filter(r => r.success).length,
    failed_updates: results.filter(r => !r.success).length,
    results
  }
}

// Helper functions for access control
function checkCommandmentAccess(subscriptionStatus: string, level: number, commandmentId: number): boolean {
  const accessLimits = {
    free: 2,
    starter: 5,
    pro: 8,
    expert: 10
  }

  return commandmentId <= (accessLimits[subscriptionStatus as keyof typeof accessLimits] || 0)
}

function checkWorkshopAccess(subscriptionStatus: string, level: number, workshopId: number): boolean {
  // Workshop access based on subscription and level
  if (subscriptionStatus === 'free') return workshopId <= 2
  if (subscriptionStatus === 'starter') return workshopId <= 5
  return true // Pro and Expert have full access
}

function checkAIMentoringAccess(subscriptionStatus: string): boolean {
  return ['pro', 'expert'].includes(subscriptionStatus)
}

function checkCollaborationAccess(subscriptionStatus: string): boolean {
  return ['pro', 'expert'].includes(subscriptionStatus)
}

async function checkContentAccess(supabase: any, userId: string, subscriptionStatus: string) {
  // Check if user gained access to new commandments
  const accessLimits = {
    free: 2,
    starter: 5,
    pro: 8,
    expert: 10
  }

  const newLimit = accessLimits[subscriptionStatus as keyof typeof accessLimits] || 0
  
  // This would be used to update content access permissions
  return {
    commandments_accessible: newLimit,
    ai_mentoring: ['pro', 'expert'].includes(subscriptionStatus),
    collaboration: ['pro', 'expert'].includes(subscriptionStatus)
  }
}

// Cleanup cache periodically
setInterval(() => {
  cache.cleanup()
}, 5 * 60 * 1000) // Every 5 minutes