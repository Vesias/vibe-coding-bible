import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, AuthenticatedRequest, createApiResponse, createErrorResponse } from '@/lib/auth/middleware'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

// Validation schemas
const UpdateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  github_username: z.string().max(39).optional().or(z.literal('')), // GitHub username max length
  discord_username: z.string().max(32).optional().or(z.literal('')), // Discord username max length
  timezone: z.string().max(50).optional(),
  learning_preferences: z.object({
    preferredLanguages: z.array(z.string()).optional(),
    learningPace: z.enum(['slow', 'moderate', 'fast']).optional(),
    difficultyPreference: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    notificationSettings: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      achievements: z.boolean().optional(),
      mentoring: z.boolean().optional(),
      community: z.boolean().optional()
    }).optional(),
    aiPersonality: z.string().optional(),
    preferredStudyTime: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
    weeklyGoal: z.number().min(1).max(50).optional() // hours per week
  }).optional()
})

const ChangeEmailSchema = z.object({
  new_email: z.string().email()
})

const ProfileQuerySchema = z.object({
  includeStats: z.boolean().optional().default(false),
  includeProgress: z.boolean().optional().default(false),
  includeAchievements: z.boolean().optional().default(false)
})

async function handleGetProfile(request: AuthenticatedRequest) {
  try {
    const url = new URL(request.url)
    
    const queryValidation = ProfileQuerySchema.safeParse({
      includeStats: url.searchParams.get('includeStats') === 'true',
      includeProgress: url.searchParams.get('includeProgress') === 'true',
      includeAchievements: url.searchParams.get('includeAchievements') === 'true'
    })

    if (!queryValidation.success) {
      return createErrorResponse('Invalid query parameters', 400, 'VALIDATION_ERROR')
    }

    const { includeStats, includeProgress, includeAchievements } = queryValidation.data

    // Get user profile
    const profile = await getUserProfile(request.user.id)
    if (!profile) {
      return createErrorResponse('Profile not found', 404, 'NOT_FOUND')
    }

    let response: any = {
      profile: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        subscription_status: profile.subscription_status,
        prophet_rank: profile.prophet_rank,
        total_xp: profile.total_xp,
        current_level: profile.current_level,
        github_username: profile.github_username,
        discord_username: profile.discord_username,
        timezone: profile.timezone,
        learning_preferences: profile.learning_preferences,
        created_at: profile.created_at,
        last_login: profile.last_login
      }
    }

    if (includeStats) {
      const stats = await getUserStats(request.user.id)
      response.stats = stats
    }

    if (includeProgress) {
      const progress = await getUserProgress(request.user.id)
      response.progress = progress
    }

    if (includeAchievements) {
      const achievements = await getUserAchievements(request.user.id)
      response.achievements = achievements
    }

    return createApiResponse(response)

  } catch (error) {
    console.error('Get profile error:', error)
    return createErrorResponse(
      'Failed to get profile',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleUpdateProfile(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    
    const validation = UpdateProfileSchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Invalid request format: ' + validation.error.issues.map(i => i.message).join(', '),
        400,
        'VALIDATION_ERROR'
      )
    }

    const updates = validation.data

    // Validate GitHub username if provided
    if (updates.github_username && updates.github_username !== '') {
      const isValidGitHub = await validateGitHubUsername(updates.github_username)
      if (!isValidGitHub) {
        return createErrorResponse(
          'Invalid GitHub username or user not found',
          400,
          'INVALID_GITHUB_USERNAME'
        )
      }
    }

    // Update profile in database
    const updatedProfile = await updateUserProfile(request.user.id, updates)
    if (!updatedProfile) {
      return createErrorResponse('Failed to update profile', 500, 'DB_ERROR')
    }

    // Track profile update activity
    await trackUserActivity(request.user.id, 'profile_updated', updates)

    // Check for profile completion achievements
    await checkProfileAchievements(request.user.id, updatedProfile)

    return createApiResponse({
      message: 'Profile updated successfully',
      profile: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        full_name: updatedProfile.full_name,
        avatar_url: updatedProfile.avatar_url,
        subscription_status: updatedProfile.subscription_status,
        prophet_rank: updatedProfile.prophet_rank,
        total_xp: updatedProfile.total_xp,
        current_level: updatedProfile.current_level,
        github_username: updatedProfile.github_username,
        discord_username: updatedProfile.discord_username,
        timezone: updatedProfile.timezone,
        learning_preferences: updatedProfile.learning_preferences,
        updated_at: updatedProfile.updated_at
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return createErrorResponse(
      'Failed to update profile',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleDeleteProfile(request: AuthenticatedRequest) {
  try {
    // This is a soft delete - we'll mark the account as deleted
    // but keep the data for analytics and potential recovery
    
    const supabase = await createServerSupabaseClient()
    
    // Mark user as deleted
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email: `deleted_${request.user.id}@deleted.com`,
        full_name: 'Deleted User',
        avatar_url: null,
        github_username: null,
        discord_username: null,
        learning_preferences: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.user.id)

    if (updateError) {
      console.error('Error marking user as deleted:', updateError)
      return createErrorResponse('Failed to delete profile', 500, 'DB_ERROR')
    }

    // Log the deletion
    await trackUserActivity(request.user.id, 'profile_deleted', {})

    // Sign out the user
    await supabase.auth.signOut()

    return createApiResponse({
      message: 'Profile deleted successfully'
    })

  } catch (error) {
    console.error('Delete profile error:', error)
    return createErrorResponse(
      'Failed to delete profile',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleChangeEmail(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    
    const validation = ChangeEmailSchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Invalid email format',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { new_email } = validation.data
    const supabase = await createServerSupabaseClient()

    // Check if email is already in use
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', new_email)
      .single()

    if (existingUser && existingUser.id !== request.user.id) {
      return createErrorResponse(
        'Email already in use',
        400,
        'EMAIL_IN_USE'
      )
    }

    // Update email through Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      email: new_email
    })

    if (authError) {
      console.error('Error updating email in auth:', authError)
      return createErrorResponse(
        'Failed to update email',
        500,
        'AUTH_ERROR'
      )
    }

    // Update email in users table
    const { error: dbError } = await supabase
      .from('users')
      .update({
        email: new_email,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.user.id)

    if (dbError) {
      console.error('Error updating email in database:', dbError)
      return createErrorResponse(
        'Failed to update email in database',
        500,
        'DB_ERROR'
      )
    }

    return createApiResponse({
      message: 'Email update initiated. Please check your new email for confirmation.',
      new_email
    })

  } catch (error) {
    console.error('Change email error:', error)
    return createErrorResponse(
      'Failed to change email',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Helper functions
async function getUserProfile(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error getting user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

async function updateUserProfile(userId: string, updates: z.infer<typeof UpdateProfileSchema>) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

async function getUserStats(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get user's overall stats
    const [
      workshopsProgress,
      challengesSubmissions,
      aiInteractions,
      achievements,
      analytics
    ] = await Promise.all([
      // Workshops progress
      supabase
        .from('user_progress')
        .select('status, xp_earned, time_spent')
        .eq('user_id', userId),
      
      // Challenge submissions
      supabase
        .from('challenge_submissions')
        .select('score, is_correct')
        .eq('user_id', userId),
      
      // AI interactions
      supabase
        .from('ai_interactions')
        .select('created_at, tokens_used, cost')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()), // Last 30 days
      
      // Achievements
      supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', userId),
      
      // Recent analytics
      supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(7) // Last 7 days
    ])

    const stats = {
      workshops: {
        total: workshopsProgress.data?.length || 0,
        completed: workshopsProgress.data?.filter(w => w.status === 'completed').length || 0,
        in_progress: workshopsProgress.data?.filter(w => w.status === 'in_progress').length || 0,
        total_xp: workshopsProgress.data?.reduce((sum, w) => sum + w.xp_earned, 0) || 0,
        total_time_minutes: workshopsProgress.data?.reduce((sum, w) => sum + w.time_spent, 0) || 0
      },
      challenges: {
        total_submitted: challengesSubmissions.data?.length || 0,
        correct_answers: challengesSubmissions.data?.filter(c => c.is_correct).length || 0,
        average_score: challengesSubmissions.data?.length > 0 
          ? Math.round(challengesSubmissions.data.reduce((sum, c) => sum + c.score, 0) / challengesSubmissions.data.length)
          : 0
      },
      ai_interactions: {
        last_30_days: aiInteractions.data?.length || 0,
        tokens_used: aiInteractions.data?.reduce((sum, ai) => sum + ai.tokens_used, 0) || 0,
        total_cost: aiInteractions.data?.reduce((sum, ai) => sum + ai.cost, 0) || 0
      },
      achievements: {
        total: achievements.data?.length || 0,
        recent: achievements.data?.slice(0, 5) || []
      },
      activity: {
        daily_stats: analytics.data?.map(day => ({
          date: day.date,
          coding_time: day.coding_time_minutes,
          workshops_completed: day.workshops_completed,
          challenges_solved: day.challenges_solved,
          xp_earned: day.xp_earned
        })) || []
      }
    }

    return stats
  } catch (error) {
    console.error('Error getting user stats:', error)
    return null
  }
}

async function getUserProgress(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        workshops (
          title,
          commandment_number,
          difficulty_level,
          xp_reward
        )
      `)
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false })

    if (error) {
      console.error('Error getting user progress:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting user progress:', error)
    return []
  }
}

async function getUserAchievements(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          name,
          description,
          icon,
          category,
          rarity,
          xp_reward
        )
      `)
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

async function validateGitHubUsername(username: string): Promise<boolean> {
  try {
    // Basic validation first
    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
      return false
    }

    // Optional: Check if user exists on GitHub
    // This requires careful rate limiting in production
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'VibeCoding-Bible-App'
      }
    })

    return response.status === 200
  } catch (error) {
    console.error('Error validating GitHub username:', error)
    return true // Allow on error to avoid blocking users
  }
}

async function trackUserActivity(userId: string, activity: string, metadata: any) {
  try {
    // This could be implemented with a dedicated activity tracking table
    // For now, we'll just log it
    console.log(`User ${userId} performed activity: ${activity}`, metadata)
  } catch (error) {
    console.error('Error tracking user activity:', error)
  }
}

async function checkProfileAchievements(userId: string, profile: any) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check for profile completion achievement
    const profileFields = [
      profile.full_name,
      profile.avatar_url,
      profile.github_username,
      profile.timezone,
      profile.learning_preferences
    ].filter(Boolean)

    if (profileFields.length >= 4) { // Consider profile complete if 4+ fields filled
      const achievementId = 'profile_completed'
      
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

        console.log(`Created profile completion achievement for user ${userId}`)
      }
    }

  } catch (error) {
    console.error('Error checking profile achievements:', error)
  }
}

// Create rate-limited handlers
const rateLimitedGetHandler = withRateLimit(
  withAuth(handleGetProfile, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedUpdateHandler = withRateLimit(
  withAuth(handleUpdateProfile, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedDeleteHandler = withRateLimit(
  withAuth(handleDeleteProfile, { requireSubscription: false }),
  rateLimitConfigs.api
)

// Additional route for email changes
async function handleEmailChange(request: AuthenticatedRequest) {
  return withRateLimit(
    withAuth(handleChangeEmail, { requireSubscription: false }),
    rateLimitConfigs.auth
  )(request)
}

export const GET = rateLimitedGetHandler
export const PUT = rateLimitedUpdateHandler
export const DELETE = rateLimitedDeleteHandler
export const PATCH = rateLimitedUpdateHandler // Alias for partial updates