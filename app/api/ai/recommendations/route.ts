import { NextRequest, NextResponse } from 'next/server'
import { getServerAIProvider } from '@/lib/ai/server-provider'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || (userId && user.id !== userId)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get user profile and progress data
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    const { data: workshopProgress } = await supabase
      .from('workshop_progress')
      .select('*')
      .eq('user_id', user.id)
    
    const { data: recentActivity } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Prepare user profile for AI
    const profileForAI = {
      level: userProfile?.level || 1,
      xp: userProfile?.total_xp || 0,
      completedWorkshops: workshopProgress?.map((p: any) => p.workshop_id) || [],
      currentStrengths: userProfile?.strengths || ['Beginner Programming'],
      improvementAreas: userProfile?.improvement_areas || ['All Areas'],
      learningGoals: userProfile?.learning_goals || ['Master AI-Assisted Development'],
      preferences: userProfile?.preferences || {}
    }
    
    const context = {
      recentActivity: recentActivity || [],
      currentWorkshop: recentActivity?.[0]?.activity_type === 'workshop_progress' ? recentActivity[0].metadata?.workshop_id : undefined,
      strugglingWith: userProfile?.struggling_with || []
    }
    
    // Generate AI recommendations
    const aiProvider = getServerAIProvider()
    const recommendations = await aiProvider.generateLearningRecommendations(profileForAI, context)
    
    // Save recommendations to database for tracking
    try {
      await supabase
        .from('learning_recommendations')
        .insert({
          user_id: user.id,
          recommendations_data: recommendations,
          user_level: profileForAI.level,
          context_type: context.currentWorkshop ? 'workshop_based' : 'general',
          generated_at: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Failed to save recommendations:', error)
    }
    
    return NextResponse.json({
      recommendations,
      userContext: {
        level: profileForAI.level,
        xp: profileForAI.xp,
        completedWorkshops: profileForAI.completedWorkshops.length,
        currentWorkshop: context.currentWorkshop
      },
      generatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Recommendations API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { feedback, recommendationId, action } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Track recommendation feedback
    if (action === 'feedback') {
      await supabase
        .from('recommendation_feedback')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          feedback_type: feedback.type, // 'helpful', 'not_helpful', 'irrelevant'
          rating: feedback.rating,
          comment: feedback.comment,
          created_at: new Date().toISOString()
        })
    }
    
    // Track recommendation actions
    if (action === 'started' || action === 'completed') {
      await supabase
        .from('recommendation_actions')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          action_type: action,
          created_at: new Date().toISOString()
        })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully'
    })
    
  } catch (error) {
    console.error('Recommendation Feedback API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to record feedback',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}