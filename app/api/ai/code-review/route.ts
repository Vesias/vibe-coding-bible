import { NextRequest, NextResponse } from 'next/server'
import { getAIProvider } from '@/lib/ai/provider'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const reviewRequest = await request.json()
    
    // Validate request
    if (!reviewRequest.code || !reviewRequest.language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      )
    }
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required for code review' },
        { status: 401 }
      )
    }
    
    // Initialize AI provider
    const aiProvider = getAIProvider()
    
    // Perform code review
    const reviewResponse = await aiProvider.reviewCode({
      code: reviewRequest.code,
      language: reviewRequest.language,
      context: reviewRequest.context,
      userLevel: reviewRequest.userLevel || 'intermediate',
      focusAreas: reviewRequest.focusAreas || ['bugs', 'readability', 'best-practices'],
      workshopContext: reviewRequest.workshopContext
    }, user.id)
    
    // Save review to database for future reference
    try {
      await supabase
        .from('code_reviews')
        .insert({
          user_id: user.id,
          code_language: reviewRequest.language,
          code_length: reviewRequest.code.length,
          overall_score: reviewResponse.overall.score,
          issues_count: reviewResponse.issues.length,
          improvements_count: reviewResponse.improvements.length,
          workshop_context: reviewRequest.workshopContext?.workshopId,
          review_data: reviewResponse
        })
    } catch (error) {
      console.warn('Failed to save code review:', error)
    }
    
    return NextResponse.json(reviewResponse)
    
  } catch (error) {
    console.error('Code Review API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to perform code review',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get user's recent code reviews
    const { data: reviews, error } = await supabase
      .from('code_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      reviews: reviews || [],
      total: reviews?.length || 0
    })
    
  } catch (error) {
    console.error('Get Code Reviews API Error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch code reviews' },
      { status: 500 }
    )
  }
}