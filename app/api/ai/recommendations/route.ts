import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getAIProvider } from '@/lib/ai/provider'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile and progress data
    const [
      { data: profile },
      { data: progress },
      { data: completedWorkshops },
      { data: recentActivity }
    ] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id),
        
      supabase
        .from('user_progress')
        .select('workshop_id, status, xp_earned')
        .eq('user_id', user.id)
        .eq('status', 'completed'),
        
      supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
    ])

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Build user profile for AI recommendations
    const userProfile = {
      level: profile.prophet_rank || 1,
      xp: profile.total_xp || 0,
      completedWorkshops: completedWorkshops?.map(w => w.workshop_id) || [],
      currentStrengths: profile.skills || [],
      improvementAreas: profile.improvement_areas || [],
      learningGoals: profile.learning_goals || [],
      preferences: {
        difficulty: profile.preferred_difficulty || 'intermediate',
        topics: profile.preferred_topics || [],
        learningStyle: profile.learning_style || 'visual'
      }
    }

    // Get current context
    const context = {
      recentActivity: recentActivity || [],
      currentWorkshop: recentActivity?.[0]?.related_id,
      strugglingWith: profile.struggling_areas || []
    }

    const aiProvider = getAIProvider()

    // Generate personalized recommendations
    const recommendations = await aiProvider.generateLearningRecommendations(
      userProfile,
      context
    )

    // Save recommendations to database
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'learning_recommendations',
      input_data: { userProfile, context },
      output_data: recommendations,
      tokens_used: 800, // Estimate
      cost: 0.024, // Estimate
      model_used: 'gpt-4',
      created_at: new Date().toISOString()
    })

    // Cache recommendations for better performance
    await supabase.from('user_recommendations').upsert({
      user_id: user.id,
      recommendations: recommendations,
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    })

    return NextResponse.json(recommendations)

  } catch (error) {
    console.error('AI Recommendations Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}