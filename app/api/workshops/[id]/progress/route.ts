import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, AuthenticatedRequest, createApiResponse, createErrorResponse } from '@/lib/auth/middleware'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

// Validation schemas
const UpdateProgressSchema = z.object({
  challengeId: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'mastered']).optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
  completedChallenges: z.array(z.string()).optional(),
  currentStep: z.string().optional()
})

const ProgressQuerySchema = z.object({
  includeDetails: z.boolean().optional().default(false),
  includeChallenges: z.boolean().optional().default(false)
})

interface WorkshopProgressParams {
  params: {
    id: string
  }
}

async function handleGetProgress(
  request: AuthenticatedRequest,
  { params }: WorkshopProgressParams
) {
  try {
    const workshopId = params.id
    const url = new URL(request.url)
    
    const queryValidation = ProgressQuerySchema.safeParse({
      includeDetails: url.searchParams.get('includeDetails') === 'true',
      includeChallenges: url.searchParams.get('includeChallenges') === 'true'
    })

    if (!queryValidation.success) {
      return createErrorResponse('Invalid query parameters', 400, 'VALIDATION_ERROR')
    }

    const { includeDetails, includeChallenges } = queryValidation.data

    // Verify workshop exists and user has access
    const workshopAccess = await checkWorkshopAccess(workshopId, request.user)
    if (!workshopAccess.allowed) {
      return createErrorResponse(workshopAccess.message, workshopAccess.status, 'ACCESS_DENIED')
    }

    // Get user's progress for this workshop
    const progress = await getUserProgress(workshopId, request.user.id)
    
    let response: any = {
      workshopId,
      userId: request.user.id,
      progress: progress || {
        status: 'not_started',
        progressPercentage: 0,
        completedChallenges: [],
        xpEarned: 0,
        timeSpent: 0
      }
    }

    if (includeDetails) {
      const workshop = await getWorkshopDetails(workshopId)
      response.workshop = workshop
    }

    if (includeChallenges && progress) {
      const challenges = await getWorkshopChallenges(workshopId, progress.completed_challenges)
      response.challenges = challenges
    }

    return createApiResponse(response)

  } catch (error) {
    console.error('Get workshop progress error:', error)
    return createErrorResponse(
      'Failed to get workshop progress',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleUpdateProgress(
  request: AuthenticatedRequest,
  { params }: WorkshopProgressParams
) {
  try {
    const workshopId = params.id
    const body = await request.json()
    
    const validation = UpdateProgressSchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Invalid request format',
        400,
        'VALIDATION_ERROR'
      )
    }

    const updates = validation.data

    // Verify workshop exists and user has access
    const workshopAccess = await checkWorkshopAccess(workshopId, request.user)
    if (!workshopAccess.allowed) {
      return createErrorResponse(workshopAccess.message, workshopAccess.status, 'ACCESS_DENIED')
    }

    // Get or create progress record
    let progress = await getUserProgress(workshopId, request.user.id)
    
    if (!progress) {
      progress = await createProgressRecord(workshopId, request.user.id)
      if (!progress) {
        return createErrorResponse('Failed to create progress record', 500, 'DB_ERROR')
      }
    }

    // Calculate new progress values
    const updatedProgress = await calculateProgressUpdate(progress, updates, workshopId)
    
    // Update progress in database
    const result = await updateProgressRecord(progress.id, updatedProgress)
    if (!result) {
      return createErrorResponse('Failed to update progress', 500, 'DB_ERROR')
    }

    // Award XP if progress increased
    if (updatedProgress.xp_earned > progress.xp_earned) {
      const xpGained = updatedProgress.xp_earned - progress.xp_earned
      await awardXP(request.user.id, xpGained, 'workshop_progress')
    }

    // Check for achievements
    await checkProgressAchievements(request.user.id, workshopId, updatedProgress)

    // Update user analytics
    await updateUserAnalytics(request.user.id, updatedProgress)

    return createApiResponse({
      workshopId,
      progress: updatedProgress,
      xpGained: updatedProgress.xp_earned - progress.xp_earned,
      newAchievements: [] // This would be populated by checkProgressAchievements
    })

  } catch (error) {
    console.error('Update workshop progress error:', error)
    return createErrorResponse(
      'Failed to update workshop progress',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleResetProgress(
  request: AuthenticatedRequest,
  { params }: WorkshopProgressParams
) {
  try {
    const workshopId = params.id

    // Verify workshop exists and user has access
    const workshopAccess = await checkWorkshopAccess(workshopId, request.user)
    if (!workshopAccess.allowed) {
      return createErrorResponse(workshopAccess.message, workshopAccess.status, 'ACCESS_DENIED')
    }

    // Get existing progress
    const progress = await getUserProgress(workshopId, request.user.id)
    if (!progress) {
      return createErrorResponse('No progress found to reset', 404, 'NOT_FOUND')
    }

    // Reset progress
    const resetData = {
      status: 'not_started' as const,
      progress_percentage: 0,
      current_challenge_id: null,
      completed_challenges: [],
      xp_earned: 0,
      time_spent: 0,
      started_at: null,
      completed_at: null,
      last_accessed: new Date().toISOString(),
      notes: null,
      rating: null,
      review: null
    }

    const result = await updateProgressRecord(progress.id, resetData)
    if (!result) {
      return createErrorResponse('Failed to reset progress', 500, 'DB_ERROR')
    }

    return createApiResponse({
      workshopId,
      message: 'Progress reset successfully',
      progress: resetData
    })

  } catch (error) {
    console.error('Reset workshop progress error:', error)
    return createErrorResponse(
      'Failed to reset workshop progress',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Helper functions
async function checkWorkshopAccess(
  workshopId: string,
  user: AuthenticatedRequest['user']
): Promise<{ allowed: boolean; message: string; status: number }> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get workshop details
    const { data: workshop, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', workshopId)
      .eq('is_published', true)
      .single()

    if (error || !workshop) {
      return {
        allowed: false,
        message: 'Workshop not found or not published',
        status: 404
      }
    }

    // Check subscription requirements based on commandment number
    const requiresPremium = workshop.commandment_number > 2 // Free tier gets first 2 commandments
    
    if (requiresPremium && user.subscription_status === 'free') {
      return {
        allowed: false,
        message: 'Premium subscription required for this workshop',
        status: 403
      }
    }

    // Check advanced workshops for higher tiers
    if (workshop.difficulty_level === 'advanced' && 
        !['pro', 'divine'].includes(user.subscription_status)) {
      return {
        allowed: false,
        message: 'Pro subscription or higher required for advanced workshops',
        status: 403
      }
    }

    return { allowed: true, message: '', status: 200 }

  } catch (error) {
    console.error('Error checking workshop access:', error)
    return {
      allowed: false,
      message: 'Failed to verify workshop access',
      status: 500
    }
  }
}

async function getUserProgress(workshopId: string, userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error
      console.error('Error getting user progress:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting user progress:', error)
    return null
  }
}

async function createProgressRecord(workshopId: string, userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        workshop_id: workshopId,
        status: 'not_started',
        progress_percentage: 0,
        completed_challenges: [],
        xp_earned: 0,
        time_spent: 0,
        last_accessed: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating progress record:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating progress record:', error)
    return null
  }
}

async function calculateProgressUpdate(
  currentProgress: any,
  updates: z.infer<typeof UpdateProgressSchema>,
  workshopId: string
) {
  const supabase = await createServerSupabaseClient()
  
  // Get workshop details for XP calculation
  const { data: workshop } = await supabase
    .from('workshops')
    .select('xp_reward')
    .eq('id', workshopId)
    .single()

  // Get all challenges for this workshop
  const { data: challenges } = await supabase
    .from('challenges')
    .select('id, xp_reward')
    .eq('workshop_id', workshopId)
    .order('order_index')

  const totalChallenges = challenges?.length || 0
  const maxWorkshopXP = workshop?.xp_reward || 100

  // Calculate new completed challenges list
  let completedChallenges = currentProgress.completed_challenges || []
  if (updates.completedChallenges) {
    completedChallenges = updates.completedChallenges
  } else if (updates.challengeId && !completedChallenges.includes(updates.challengeId)) {
    completedChallenges = [...completedChallenges, updates.challengeId]
  }

  // Calculate progress percentage
  let progressPercentage = currentProgress.progress_percentage
  if (updates.progressPercentage !== undefined) {
    progressPercentage = updates.progressPercentage
  } else if (totalChallenges > 0) {
    progressPercentage = Math.round((completedChallenges.length / totalChallenges) * 100)
  }

  // Calculate XP earned
  let xpEarned = currentProgress.xp_earned
  if (challenges) {
    xpEarned = completedChallenges.reduce((total, challengeId) => {
      const challenge = challenges.find(c => c.id === challengeId)
      return total + (challenge?.xp_reward || 0)
    }, 0)
  }

  // Determine status
  let status = currentProgress.status
  if (updates.status) {
    status = updates.status
  } else if (progressPercentage === 100) {
    status = 'completed'
  } else if (progressPercentage > 0) {
    status = 'in_progress'
  }

  // Calculate time spent
  const timeSpent = updates.timeSpent !== undefined 
    ? currentProgress.time_spent + updates.timeSpent
    : currentProgress.time_spent

  return {
    status,
    progress_percentage: progressPercentage,
    current_challenge_id: updates.challengeId || currentProgress.current_challenge_id,
    completed_challenges: completedChallenges,
    xp_earned: xpEarned,
    time_spent: timeSpent,
    started_at: currentProgress.started_at || (status !== 'not_started' ? new Date().toISOString() : null),
    completed_at: status === 'completed' ? new Date().toISOString() : null,
    last_accessed: new Date().toISOString(),
    notes: updates.notes !== undefined ? updates.notes : currentProgress.notes
  }
}

async function updateProgressRecord(progressId: string, updates: any) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('id', progressId)
      .select()
      .single()

    if (error) {
      console.error('Error updating progress record:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating progress record:', error)
    return null
  }
}

async function getWorkshopDetails(workshopId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('workshops')
      .select('title, description, difficulty_level, estimated_duration, xp_reward, learning_objectives')
      .eq('id', workshopId)
      .single()

    if (error) {
      console.error('Error getting workshop details:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting workshop details:', error)
    return null
  }
}

async function getWorkshopChallenges(workshopId: string, completedChallenges: string[]) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('challenges')
      .select('id, title, description, type, difficulty, xp_reward, order_index')
      .eq('workshop_id', workshopId)
      .order('order_index')

    if (error) {
      console.error('Error getting workshop challenges:', error)
      return []
    }

    return data.map(challenge => ({
      ...challenge,
      completed: completedChallenges.includes(challenge.id)
    }))
  } catch (error) {
    console.error('Error getting workshop challenges:', error)
    return []
  }
}

async function awardXP(userId: string, xp: number, reason: string) {
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
      return
    }

    const newTotalXP = user.total_xp + xp
    const newLevel = Math.floor(newTotalXP / 1000) + 1 // 1000 XP per level

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
      return
    }

    console.log(`Awarded ${xp} XP to user ${userId} for ${reason}`)

  } catch (error) {
    console.error('Error awarding XP:', error)
  }
}

async function checkProgressAchievements(userId: string, workshopId: string, progress: any) {
  // This would check for various achievements based on progress
  // For now, we'll implement a simple completion achievement
  
  if (progress.status === 'completed') {
    try {
      const supabase = await createServerSupabaseClient()
      
      const achievementId = `workshop_${workshopId}_completed`
      
      // Check if achievement already exists
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)
        .single()

      if (!existing) {
        // Create achievement
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievementId,
            progress: 100,
            earned_at: new Date().toISOString()
          })

        console.log(`Created workshop completion achievement for user ${userId}`)
      }

    } catch (error) {
      console.error('Error checking progress achievements:', error)
    }
  }
}

async function updateUserAnalytics(userId: string, progress: any) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const today = new Date().toISOString().split('T')[0]
    
    // Get or create today's analytics record
    const { data: existing, error: fetchError } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user analytics:', fetchError)
      return
    }

    if (existing) {
      // Update existing record
      await supabase
        .from('user_analytics')
        .update({
          coding_time_minutes: existing.coding_time_minutes + (progress.time_spent || 0),
          workshops_completed: progress.status === 'completed' ? existing.workshops_completed + 1 : existing.workshops_completed,
          xp_earned: existing.xp_earned + (progress.xp_earned || 0)
        })
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabase
        .from('user_analytics')
        .insert({
          user_id: userId,
          date: today,
          coding_time_minutes: progress.time_spent || 0,
          workshops_completed: progress.status === 'completed' ? 1 : 0,
          challenges_solved: progress.completed_challenges?.length || 0,
          ai_interactions: 0,
          collaboration_sessions: 0,
          xp_earned: progress.xp_earned || 0,
          skill_improvements: {},
          learning_velocity: 0,
          engagement_score: 0,
          retention_risk_score: 0,
          personalized_insights: {}
        })
    }

  } catch (error) {
    console.error('Error updating user analytics:', error)
  }
}

// Create rate-limited handlers
const rateLimitedGetHandler = withRateLimit(
  withAuth(handleGetProgress, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedUpdateHandler = withRateLimit(
  withAuth(handleUpdateProgress, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedResetHandler = withRateLimit(
  withAuth(handleResetProgress, { requireSubscription: false }),
  rateLimitConfigs.api
)

export const GET = rateLimitedGetHandler
export const POST = rateLimitedUpdateHandler
export const DELETE = rateLimitedResetHandler