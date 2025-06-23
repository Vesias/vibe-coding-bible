import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, AuthenticatedRequest, createApiResponse, createErrorResponse } from '@/lib/auth/middleware'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

// Validation schemas
const AchievementsQuerySchema = z.object({
  category: z.enum(['skill', 'progress', 'social', 'special']).optional(),
  earned: z.boolean().optional(),
  includeProgress: z.boolean().optional().default(false),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary', 'divine']).optional(),
  limit: z.number().min(1).max(100).optional().default(50)
})

const ClaimAchievementSchema = z.object({
  achievement_id: z.string()
})

async function handleGetAchievements(request: AuthenticatedRequest) {
  try {
    const url = new URL(request.url)
    
    const queryValidation = AchievementsQuerySchema.safeParse({
      category: url.searchParams.get('category') as any,
      earned: url.searchParams.get('earned') === 'true' ? true : 
              url.searchParams.get('earned') === 'false' ? false : undefined,
      includeProgress: url.searchParams.get('includeProgress') === 'true',
      rarity: url.searchParams.get('rarity') as any,
      limit: parseInt(url.searchParams.get('limit') || '50')
    })

    if (!queryValidation.success) {
      return createErrorResponse(
        'Invalid query parameters',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { category, earned, includeProgress, rarity, limit } = queryValidation.data

    // Get all available achievements
    const allAchievements = await getAllAchievements({ category, rarity, limit })
    
    // Get user's earned achievements
    const userAchievements = await getUserAchievements(request.user.id)
    
    // Create a map for quick lookup
    const earnedMap = new Map(userAchievements.map(ua => [ua.achievement_id, ua]))
    
    // Combine data and filter based on earned status
    let achievements = allAchievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      rarity: achievement.rarity,
      xp_reward: achievement.xp_reward,
      requirements: achievement.requirements,
      earned: earnedMap.has(achievement.id),
      earned_at: earnedMap.get(achievement.id)?.earned_at || null,
      progress: earnedMap.get(achievement.id)?.progress || 0
    }))

    // Filter by earned status if specified
    if (earned !== undefined) {
      achievements = achievements.filter(a => a.earned === earned)
    }

    // Calculate achievement statistics
    const stats = {
      total_available: allAchievements.length,
      total_earned: userAchievements.length,
      completion_percentage: Math.round((userAchievements.length / allAchievements.length) * 100),
      by_category: await getAchievementStatsByCategory(request.user.id),
      by_rarity: await getAchievementStatsByRarity(request.user.id),
      recent_achievements: userAchievements
        .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
        .slice(0, 5)
        .map(ua => ({
          id: ua.achievement_id,
          earned_at: ua.earned_at,
          name: allAchievements.find(a => a.id === ua.achievement_id)?.name || 'Unknown'
        }))
    }

    // Check for new achievements that can be earned
    if (includeProgress) {
      const progressData = await checkAchievementProgress(request.user.id, achievements.filter(a => !a.earned))
      achievements = achievements.map(achievement => ({
        ...achievement,
        progress_data: progressData[achievement.id] || null
      }))
    }

    return createApiResponse({
      achievements,
      stats,
      user_level: await getUserAchievementLevel(request.user.id)
    })

  } catch (error) {
    console.error('Get achievements error:', error)
    return createErrorResponse(
      'Failed to get achievements',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleClaimAchievement(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    
    const validation = ClaimAchievementSchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Invalid request format',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { achievement_id } = validation.data

    // Check if achievement exists
    const achievement = await getAchievementById(achievement_id)
    if (!achievement) {
      return createErrorResponse('Achievement not found', 404, 'NOT_FOUND')
    }

    // Check if user already has this achievement
    const existingUserAchievement = await getUserAchievement(request.user.id, achievement_id)
    if (existingUserAchievement) {
      return createErrorResponse('Achievement already earned', 400, 'ALREADY_EARNED')
    }

    // Check if user meets requirements
    const meetsRequirements = await checkAchievementRequirements(request.user.id, achievement)
    if (!meetsRequirements.eligible) {
      return createErrorResponse(
        `Requirements not met: ${meetsRequirements.reason}`,
        400,
        'REQUIREMENTS_NOT_MET'
      )
    }

    // Award the achievement
    const userAchievement = await awardAchievement(request.user.id, achievement_id)
    if (!userAchievement) {
      return createErrorResponse('Failed to award achievement', 500, 'DB_ERROR')
    }

    // Award XP
    let xpAwarded = 0
    if (achievement.xp_reward > 0) {
      xpAwarded = await awardAchievementXP(request.user.id, achievement.xp_reward)
    }

    // Check for chain achievements (achievements that unlock other achievements)
    const chainAchievements = await checkChainAchievements(request.user.id, achievement_id)

    return createApiResponse({
      achievement: {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        xp_reward: achievement.xp_reward
      },
      earned_at: userAchievement.earned_at,
      xp_awarded: xpAwarded,
      chain_achievements: chainAchievements,
      divine_blessing: generateDivineBlessing(achievement.rarity)
    })

  } catch (error) {
    console.error('Claim achievement error:', error)
    return createErrorResponse(
      'Failed to claim achievement',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Helper functions
async function getAllAchievements(filters: {
  category?: string
  rarity?: string
  limit: number
}) {
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('achievements')
      .select('*')

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.rarity) {
      query = query.eq('rarity', filters.rarity)
    }

    query = query
      .order('category')
      .order('rarity')
      .limit(filters.limit)

    const { data, error } = await query

    if (error) {
      console.error('Error getting achievements:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting achievements:', error)
    return []
  }
}

async function getUserAchievements(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (error) {
      console.error('Error getting user achievements:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting user achievements:', error)
    return []
  }
}

async function getAchievementById(achievementId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single()

    if (error) {
      console.error('Error getting achievement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting achievement:', error)
    return null
  }
}

async function getUserAchievement(userId: string, achievementId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error
      console.error('Error getting user achievement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting user achievement:', error)
    return null
  }
}

async function checkAchievementRequirements(userId: string, achievement: any): Promise<{
  eligible: boolean
  reason?: string
  progress?: number
}> {
  try {
    const requirements = achievement.requirements as any
    
    if (!requirements) {
      return { eligible: true }
    }

    const supabase = await createServerSupabaseClient()
    
    // Get user stats
    const [user, workshopProgress, challengeSubmissions, userAchievements] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('user_progress').select('*').eq('user_id', userId),
      supabase.from('challenge_submissions').select('*').eq('user_id', userId),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', userId)
    ])

    const userStats = {
      level: user.data?.current_level || 1,
      xp: user.data?.total_xp || 0,
      workshops_completed: workshopProgress.data?.filter(w => w.status === 'completed').length || 0,
      challenges_solved: challengeSubmissions.data?.filter(c => c.is_correct).length || 0,
      achievements_earned: userAchievements.data?.length || 0,
      subscription_status: user.data?.subscription_status || 'free'
    }

    // Check specific requirements
    if (requirements.min_level && userStats.level < requirements.min_level) {
      return { 
        eligible: false, 
        reason: `Requires level ${requirements.min_level}`,
        progress: Math.round((userStats.level / requirements.min_level) * 100)
      }
    }

    if (requirements.min_xp && userStats.xp < requirements.min_xp) {
      return { 
        eligible: false, 
        reason: `Requires ${requirements.min_xp} XP`,
        progress: Math.round((userStats.xp / requirements.min_xp) * 100)
      }
    }

    if (requirements.workshops_completed && userStats.workshops_completed < requirements.workshops_completed) {
      return { 
        eligible: false, 
        reason: `Requires ${requirements.workshops_completed} completed workshops`,
        progress: Math.round((userStats.workshops_completed / requirements.workshops_completed) * 100)
      }
    }

    if (requirements.challenges_solved && userStats.challenges_solved < requirements.challenges_solved) {
      return { 
        eligible: false, 
        reason: `Requires ${requirements.challenges_solved} solved challenges`,
        progress: Math.round((userStats.challenges_solved / requirements.challenges_solved) * 100)
      }
    }

    if (requirements.subscription_tier && !meetsSubscriptionRequirement(userStats.subscription_status, requirements.subscription_tier)) {
      return { 
        eligible: false, 
        reason: `Requires ${requirements.subscription_tier} subscription or higher`
      }
    }

    if (requirements.prerequisite_achievements) {
      const hasAllPrerequisites = requirements.prerequisite_achievements.every((prereqId: string) =>
        userAchievements.data?.some(ua => ua.achievement_id === prereqId)
      )
      
      if (!hasAllPrerequisites) {
        return { 
          eligible: false, 
          reason: 'Missing prerequisite achievements'
        }
      }
    }

    return { eligible: true, progress: 100 }

  } catch (error) {
    console.error('Error checking achievement requirements:', error)
    return { eligible: false, reason: 'Error checking requirements' }
  }
}

function meetsSubscriptionRequirement(userTier: string, requiredTier: string): boolean {
  const tierOrder = ['free', 'basic', 'pro', 'divine']
  const userIndex = tierOrder.indexOf(userTier)
  const requiredIndex = tierOrder.indexOf(requiredTier)
  
  return userIndex >= requiredIndex
}

async function awardAchievement(userId: string, achievementId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        progress: 100,
        earned_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error awarding achievement:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error awarding achievement:', error)
    return null
  }
}

async function awardAchievementXP(userId: string, xpReward: number): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user stats
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      console.error('Error fetching user for XP award:', fetchError)
      return 0
    }

    const newTotalXP = user.total_xp + xpReward
    const newLevel = Math.floor(newTotalXP / 1000) + 1

    // Update user XP and level
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user XP:', updateError)
      return 0
    }

    return xpReward
  } catch (error) {
    console.error('Error awarding achievement XP:', error)
    return 0
  }
}

async function checkChainAchievements(userId: string, triggeredAchievementId: string): Promise<string[]> {
  // This would check for achievements that are unlocked by earning other achievements
  // For now, we'll return an empty array
  return []
}

async function checkAchievementProgress(userId: string, unearnedAchievements: any[]): Promise<Record<string, any>> {
  const progressData: Record<string, any> = {}
  
  for (const achievement of unearnedAchievements) {
    const requirements = await checkAchievementRequirements(userId, achievement)
    if (requirements.progress !== undefined) {
      progressData[achievement.id] = {
        progress: requirements.progress,
        eligible: requirements.eligible,
        reason: requirements.reason
      }
    }
  }
  
  return progressData
}

async function getAchievementStatsByCategory(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('category')
    
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        achievements (category)
      `)
      .eq('user_id', userId)

    const categories = ['skill', 'progress', 'social', 'special']
    const stats: Record<string, any> = {}
    
    for (const category of categories) {
      const total = allAchievements?.filter(a => a.category === category).length || 0
      const earned = userAchievements?.filter(ua => (ua.achievements as any)?.category === category).length || 0
      
      stats[category] = {
        total,
        earned,
        percentage: total > 0 ? Math.round((earned / total) * 100) : 0
      }
    }
    
    return stats
  } catch (error) {
    console.error('Error getting achievement stats by category:', error)
    return {}
  }
}

async function getAchievementStatsByRarity(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('rarity')
    
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        achievements (rarity)
      `)
      .eq('user_id', userId)

    const rarities = ['common', 'rare', 'epic', 'legendary', 'divine']
    const stats: Record<string, any> = {}
    
    for (const rarity of rarities) {
      const total = allAchievements?.filter(a => a.rarity === rarity).length || 0
      const earned = userAchievements?.filter(ua => (ua.achievements as any)?.rarity === rarity).length || 0
      
      stats[rarity] = {
        total,
        earned,
        percentage: total > 0 ? Math.round((earned / total) * 100) : 0
      }
    }
    
    return stats
  } catch (error) {
    console.error('Error getting achievement stats by rarity:', error)
    return {}
  }
}

async function getUserAchievementLevel(userId: string): Promise<{
  title: string
  level: number
  next_level_requirement: string
}> {
  try {
    const userAchievements = await getUserAchievements(userId)
    const achievementCount = userAchievements.length
    
    // Define achievement levels
    const levels = [
      { min: 0, title: 'Seeker', next: 'Earn 5 achievements' },
      { min: 5, title: 'Apprentice', next: 'Earn 15 achievements' },
      { min: 15, title: 'Practitioner', next: 'Earn 30 achievements' },
      { min: 30, title: 'Architect', next: 'Earn 50 achievements' },
      { min: 50, title: 'Prophet', next: 'Master of all achievements' }
    ]
    
    let currentLevel = levels[0]
    let nextRequirement = levels[1]?.next || 'Maximum level reached'
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (achievementCount >= levels[i].min) {
        currentLevel = levels[i]
        nextRequirement = levels[i + 1]?.next || 'Maximum level reached'
        break
      }
    }
    
    return {
      title: currentLevel.title,
      level: levels.findIndex(l => l.title === currentLevel.title) + 1,
      next_level_requirement: nextRequirement
    }
  } catch (error) {
    console.error('Error getting user achievement level:', error)
    return {
      title: 'Seeker',
      level: 1,
      next_level_requirement: 'Earn 5 achievements'
    }
  }
}

function generateDivineBlessing(rarity: string): string {
  const blessings = {
    common: "May your code be bug-free and your logic sound.",
    rare: "Divine wisdom flows through your algorithms.",
    epic: "The sacred patterns reveal themselves to you.",
    legendary: "You have achieved great mastery in the coding arts.",
    divine: "You have transcended mortal coding limitations. The universe itself acknowledges your prowess."
  }
  
  return blessings[rarity as keyof typeof blessings] || blessings.common
}

// Create rate-limited handlers
const rateLimitedGetHandler = withRateLimit(
  withAuth(handleGetAchievements, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedClaimHandler = withRateLimit(
  withAuth(handleClaimAchievement, { requireSubscription: false }),
  rateLimitConfigs.api
)

export const GET = rateLimitedGetHandler
export const POST = rateLimitedClaimHandler