import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getAIProvider } from '@/lib/ai/provider'

export async function POST(request: NextRequest) {
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

    const reviewRequest = await request.json()

    if (!reviewRequest.code || !reviewRequest.language) {
      return NextResponse.json({ 
        error: 'Code and language are required' 
      }, { status: 400 })
    }

    // Get user's level for personalized review
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('experience_level, current_tier')
      .eq('user_id', user.id)
      .single()

    const userLevel = profile?.experience_level || 'beginner'

    const aiProvider = getAIProvider()

    // Perform code review
    const reviewResponse = await aiProvider.reviewCode({
      ...reviewRequest,
      userLevel: userLevel as any
    }, user.id)

    // Save review to database
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'code_review',
      input_data: {
        code: reviewRequest.code,
        language: reviewRequest.language,
        context: reviewRequest.context,
        focusAreas: reviewRequest.focusAreas
      },
      output_data: reviewResponse,
      tokens_used: 1500, // Estimate for review
      cost: 0.045, // Estimate
      model_used: 'claude-3-5-sonnet',
      created_at: new Date().toISOString()
    })

    // Track code review for user progress
    if (reviewRequest.workshopContext?.workshopId) {
      await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'ai_code_review',
        related_id: reviewRequest.workshopContext.workshopId,
        data: {
          overall_score: reviewResponse.overall.score,
          issues_count: reviewResponse.issues.length,
          improvements_count: reviewResponse.improvements.length
        },
        created_at: new Date().toISOString()
      })
    }

    return NextResponse.json(reviewResponse)

  } catch (error) {
    console.error('AI Code Review Error:', error)
    return NextResponse.json(
      { error: 'Failed to review code' },
      { status: 500 }
    )
  }
}