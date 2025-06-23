import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, AuthenticatedRequest, createApiResponse, createErrorResponse } from '@/lib/auth/middleware'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

// Validation schemas
const LeaderboardQuerySchema = z.object({
  category: z.enum(['overall', 'weekly', 'monthly', 'workshop_specific']).optional().default('overall'),
  workshopId: z.string().optional(),
  limit: z.number().min(1).max(100).optional().default(10),
  timeframe: z.enum(['all_time', 'this_week', 'this_month', 'today']).optional().default('all_time'),
  metric: z.enum(['xp', 'challenges_completed', 'workshops_completed', 'streak']).optional().default('xp')
})

async function handleGetLeaderboard(request: AuthenticatedRequest) {
  try {
    const url = new URL(request.url)
    
    const queryValidation = LeaderboardQuerySchema.safeParse({
      category: url.searchParams.get('category') as any,
      workshopId: url.searchParams.get('workshopId') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '10'),
      timeframe: url.searchParams.get('timeframe') as any,
      metric: url.searchParams.get('metric') as any
    })

    if (!queryValidation.success) {
      return createErrorResponse(
        'Invalid query parameters',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { category, workshopId, limit, timeframe, metric } = queryValidation.data

    // Validate workshop-specific leaderboard request
    if (category === 'workshop_specific' && !workshopId) {
      return createErrorResponse(
        'workshopId is required for workshop-specific leaderboards',
        400,
        'MISSING_PARAM'
      )
    }

    // Check workshop access if workshop-specific
    if (workshopId) {
      const hasAccess = await checkWorkshopAccess(workshopId, request.user)
      if (!hasAccess) {
        return createErrorResponse(
          'Access denied to this workshop',
          403,
          'ACCESS_DENIED'
        )
      }
    }

    // Get leaderboard data based on category and metric
    const leaderboard = await getLeaderboardData({
      category,
      workshopId,
      limit,
      timeframe,
      metric,
      currentUserId: request.user.id
    })

    // Get current user's position
    const userPosition = await getUserPosition({
      category,
      workshopId,
      timeframe,
      metric,
      userId: request.user.id
    })

    return createApiResponse({
      leaderboard,
      user_position: userPosition,
      category,
      timeframe,
      metric,
      total_participants: leaderboard.length,
      last_updated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return createErrorResponse(
      'Failed to get leaderboard data',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleGetUserRanking(request: AuthenticatedRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || request.user.id
    
    // Only allow users to query their own ranking or make it public for all
    const targetUserId = userId === request.user.id ? userId : request.user.id

    const rankings = await getUserRankings(targetUserId)
    
    return createApiResponse({
      user_id: targetUserId,
      rankings
    })

  } catch (error) {
    console.error('Get user ranking error:', error)
    return createErrorResponse(
      'Failed to get user ranking',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Helper functions
async function checkWorkshopAccess(workshopId: string, user: AuthenticatedRequest['user']): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: workshop, error } = await supabase
      .from('workshops')
      .select('commandment_number, difficulty_level')
      .eq('id', workshopId)
      .single()

    if (error || !workshop) {
      return false
    }

    // Check subscription requirements
    const requiresPremium = workshop.commandment_number > 2
    if (requiresPremium && user.subscription_status === 'free') {
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking workshop access:', error)
    return false
  }
}

async function getLeaderboardData(params: {
  category: string
  workshopId?: string
  limit: number
  timeframe: string
  metric: string
  currentUserId: string
}) {
  try {
    const supabase = await createServerSupabaseClient()
    
    switch (params.category) {
      case 'overall':
        return await getOverallLeaderboard(params)
      
      case 'weekly':
        return await getWeeklyLeaderboard(params)
      
      case 'monthly':
        return await getMonthlyLeaderboard(params)
      
      case 'workshop_specific':
        return await getWorkshopLeaderboard(params)
      
      default:
        return []
    }
  } catch (error) {
    console.error('Error getting leaderboard data:', error)
    return []
  }
}

async function getOverallLeaderboard(params: any) {
  const supabase = await createServerSupabaseClient()
  
  let query = supabase
    .from('users')
    .select(`
      id,
      full_name,
      avatar_url,
      prophet_rank,
      total_xp,
      current_level,
      subscription_status
    `)

  // Apply timeframe filter for XP metric
  if (params.metric === 'xp' && params.timeframe !== 'all_time') {
    // For time-based XP, we'd need to join with user_analytics
    // For now, we'll use total_xp
    query = query.order('total_xp', { ascending: false })
  } else if (params.metric === 'xp') {
    query = query.order('total_xp', { ascending: false })
  }

  query = query.limit(params.limit)

  const { data, error } = await query

  if (error) {
    console.error('Error getting overall leaderboard:', error)
    return []
  }

  // Add additional metrics for each user
  const leaderboardWithMetrics = await Promise.all(
    (data || []).map(async (user, index) => {
      const metrics = await getUserMetrics(user.id, params.timeframe)
      
      return {
        rank: index + 1,
        user: {
          id: user.id,
          name: user.full_name || 'Anonymous Prophet',
          avatar_url: user.avatar_url,
          prophet_rank: user.prophet_rank,
          subscription_status: user.subscription_status,
          level: user.current_level
        },
        metrics: {
          total_xp: user.total_xp,
          ...metrics
        },
        is_current_user: user.id === params.currentUserId
      }
    })
  )

  return leaderboardWithMetrics
}

async function getWeeklyLeaderboard(params: any) {
  const supabase = await createServerSupabaseClient()
  
  // Get start of current week
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  startOfWeek.setHours(0, 0, 0, 0)
  
  const { data, error } = await supabase
    .from('user_analytics')
    .select(`
      user_id,
      xp_earned,
      workshops_completed,
      challenges_solved,
      users (
        id,
        full_name,
        avatar_url,
        prophet_rank,
        subscription_status,
        current_level
      )
    `)
    .gte('date', startOfWeek.toISOString().split('T')[0])
    .order('xp_earned', { ascending: false })
    .limit(params.limit)

  if (error) {
    console.error('Error getting weekly leaderboard:', error)
    return []
  }

  // Aggregate weekly stats by user
  const userStats = new Map()
  
  data?.forEach(record => {
    const userId = record.user_id
    if (!userStats.has(userId)) {
      userStats.set(userId, {
        user: record.users,
        xp_earned: 0,
        workshops_completed: 0,
        challenges_solved: 0
      })
    }
    
    const stats = userStats.get(userId)
    stats.xp_earned += record.xp_earned
    stats.workshops_completed += record.workshops_completed
    stats.challenges_solved += record.challenges_solved
  })

  // Convert to leaderboard format
  const leaderboard = Array.from(userStats.values())
    .sort((a, b) => b.xp_earned - a.xp_earned)
    .slice(0, params.limit)
    .map((entry, index) => ({
      rank: index + 1,
      user: {
        id: entry.user.id,
        name: entry.user.full_name || 'Anonymous Prophet',
        avatar_url: entry.user.avatar_url,
        prophet_rank: entry.user.prophet_rank,
        subscription_status: entry.user.subscription_status,
        level: entry.user.current_level
      },
      metrics: {
        weekly_xp: entry.xp_earned,
        weekly_workshops: entry.workshops_completed,
        weekly_challenges: entry.challenges_solved
      },
      is_current_user: entry.user.id === params.currentUserId
    }))

  return leaderboard
}

async function getMonthlyLeaderboard(params: any) {
  const supabase = await createServerSupabaseClient()
  
  // Get start of current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const { data, error } = await supabase
    .from('user_analytics')
    .select(`
      user_id,
      xp_earned,
      workshops_completed,
      challenges_solved,
      users (
        id,
        full_name,
        avatar_url,
        prophet_rank,
        subscription_status,
        current_level
      )
    `)
    .gte('date', startOfMonth.toISOString().split('T')[0])
    .order('xp_earned', { ascending: false })
    .limit(params.limit)

  if (error) {
    console.error('Error getting monthly leaderboard:', error)
    return []
  }

  // Similar aggregation as weekly
  const userStats = new Map()
  
  data?.forEach(record => {
    const userId = record.user_id
    if (!userStats.has(userId)) {
      userStats.set(userId, {
        user: record.users,
        xp_earned: 0,
        workshops_completed: 0,
        challenges_solved: 0
      })
    }
    
    const stats = userStats.get(userId)
    stats.xp_earned += record.xp_earned
    stats.workshops_completed += record.workshops_completed
    stats.challenges_solved += record.challenges_solved
  })

  const leaderboard = Array.from(userStats.values())
    .sort((a, b) => b.xp_earned - a.xp_earned)
    .slice(0, params.limit)
    .map((entry, index) => ({
      rank: index + 1,
      user: {
        id: entry.user.id,
        name: entry.user.full_name || 'Anonymous Prophet',
        avatar_url: entry.user.avatar_url,
        prophet_rank: entry.user.prophet_rank,
        subscription_status: entry.user.subscription_status,
        level: entry.user.current_level
      },
      metrics: {
        monthly_xp: entry.xp_earned,
        monthly_workshops: entry.workshops_completed,
        monthly_challenges: entry.challenges_solved
      },
      is_current_user: entry.user.id === params.currentUserId
    }))

  return leaderboard
}

async function getWorkshopLeaderboard(params: any) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      user_id,
      progress_percentage,
      xp_earned,
      time_spent,
      completed_at,
      users (
        id,
        full_name,
        avatar_url,
        prophet_rank,
        subscription_status,
        current_level
      )
    `)
    .eq('workshop_id', params.workshopId)
    .order('xp_earned', { ascending: false })
    .limit(params.limit)

  if (error) {
    console.error('Error getting workshop leaderboard:', error)
    return []
  }

  const leaderboard = (data || []).map((entry, index) => ({
    rank: index + 1,
    user: {
      id: entry.user_id,
      name: entry.users?.full_name || 'Anonymous Prophet',
      avatar_url: entry.users?.avatar_url,
      prophet_rank: entry.users?.prophet_rank,
      subscription_status: entry.users?.subscription_status,
      level: entry.users?.current_level
    },
    metrics: {
      workshop_xp: entry.xp_earned,
      progress_percentage: entry.progress_percentage,
      time_spent_minutes: entry.time_spent,
      completed_at: entry.completed_at
    },
    is_current_user: entry.user_id === params.currentUserId
  }))

  return leaderboard
}

async function getUserPosition(params: {
  category: string
  workshopId?: string
  timeframe: string
  metric: string
  userId: string
}) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get user's current stats
    const userStats = await getUserMetrics(params.userId, params.timeframe)
    
    // Count users with better stats (higher rank = lower number)
    let position = 1
    
    if (params.category === 'overall') {
      const { data: users } = await supabase
        .from('users')
        .select('total_xp')
        .gt('total_xp', userStats.total_xp || 0)
      
      position = (users?.length || 0) + 1
    }
    // Add other category logic as needed
    
    return {
      position,
      percentile: position <= 10 ? Math.round((position / 100) * 100) : null,
      user_stats: userStats
    }

  } catch (error) {
    console.error('Error getting user position:', error)
    return {
      position: null,
      percentile: null,
      user_stats: {}
    }
  }
}

async function getUserMetrics(userId: string, timeframe: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get user's basic stats
    const { data: user } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single()

    // Get time-based analytics
    let analyticsFilter = supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)

    switch (timeframe) {
      case 'today':
        analyticsFilter = analyticsFilter.eq('date', new Date().toISOString().split('T')[0])
        break
      case 'this_week':
        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
        analyticsFilter = analyticsFilter.gte('date', startOfWeek.toISOString().split('T')[0])
        break
      case 'this_month':
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        analyticsFilter = analyticsFilter.gte('date', startOfMonth.toISOString().split('T')[0])
        break
    }

    const { data: analytics } = await analyticsFilter

    // Get workshop and challenge stats
    const [workshopStats, challengeStats] = await Promise.all([
      supabase
        .from('user_progress')
        .select('status, xp_earned')
        .eq('user_id', userId),
      supabase
        .from('challenge_submissions')
        .select('is_correct, score')
        .eq('user_id', userId)
    ])

    return {
      total_xp: user?.total_xp || 0,
      current_level: user?.current_level || 1,
      workshops_completed: workshopStats.data?.filter(w => w.status === 'completed').length || 0,
      workshops_in_progress: workshopStats.data?.filter(w => w.status === 'in_progress').length || 0,
      challenges_solved: challengeStats.data?.filter(c => c.is_correct).length || 0,
      total_challenges_attempted: challengeStats.data?.length || 0,
      average_challenge_score: challengeStats.data?.length > 0 
        ? Math.round(challengeStats.data.reduce((sum, c) => sum + c.score, 0) / challengeStats.data.length)
        : 0,
      weekly_xp: analytics?.reduce((sum, day) => sum + day.xp_earned, 0) || 0,
      weekly_coding_time: analytics?.reduce((sum, day) => sum + day.coding_time_minutes, 0) || 0
    }
  } catch (error) {
    console.error('Error getting user metrics:', error)
    return {}
  }
}

async function getUserRankings(userId: string) {
  try {
    const rankings = await Promise.all([
      getUserPosition({
        category: 'overall',
        timeframe: 'all_time',
        metric: 'xp',
        userId
      }),
      getUserPosition({
        category: 'weekly',
        timeframe: 'this_week',
        metric: 'xp',
        userId
      }),
      getUserPosition({
        category: 'monthly',
        timeframe: 'this_month',
        metric: 'xp',
        userId
      })
    ])

    return {
      overall: rankings[0],
      weekly: rankings[1],
      monthly: rankings[2]
    }
  } catch (error) {
    console.error('Error getting user rankings:', error)
    return {
      overall: { position: null, percentile: null, user_stats: {} },
      weekly: { position: null, percentile: null, user_stats: {} },
      monthly: { position: null, percentile: null, user_stats: {} }
    }
  }
}

// Create rate-limited handlers
const rateLimitedGetHandler = withRateLimit(
  withAuth(handleGetLeaderboard, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedRankingHandler = withRateLimit(
  withAuth(handleGetUserRanking, { requireSubscription: false }),
  rateLimitConfigs.api
)

export const GET = rateLimitedGetHandler