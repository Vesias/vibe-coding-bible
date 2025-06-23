import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // The `set` method was called from a Server Component.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // The `remove` method was called from a Server Component.
            }
          },
        },
      }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, question, context } = await request.json()

    if (!code || !question || !context?.language) {
      return NextResponse.json({ 
        error: 'Code, question, and language context are required' 
      }, { status: 400 })
    }

    // Get user's experience level
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('experience_level, current_tier')
      .eq('user_id', user.id)
      .single()

    const userLevel = profile?.experience_level || 'beginner'

    // Check if user has reached help limit for their tier
    const helpLimit = profile?.current_tier === 'free' ? 5 : 
                     profile?.current_tier === 'apostle' ? 50 : 
                     profile?.current_tier === 'prophet' ? 200 : 999

    const { count: helpCount } = await supabase
      .from('ai_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('interaction_type', 'coding_help')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    if ((helpCount || 0) >= helpLimit) {
      return NextResponse.json({ 
        error: 'Monthly AI help limit reached. Upgrade your tier for more assistance.',
        upgradeRequired: true
      }, { status: 429 })
    }

    const aiProvider = getAIProvider()

    // Get coding help
    const helpResponse = await aiProvider.getCodingHelp(code, question, {
      ...context,
      userLevel: userLevel as any
    })

    // Save help interaction to database
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'coding_help',
      input_data: { code, question, context },
      output_data: helpResponse,
      tokens_used: 1000, // Estimate
      cost: 0.03, // Estimate
      model_used: 'gpt-4',
      created_at: new Date().toISOString()
    })

    // Track help request for analytics
    await supabase.from('user_activity').insert({
      user_id: user.id,
      activity_type: 'ai_help_request',
      related_id: context.workshopStep || null,
      data: {
        language: context.language,
        question_type: question.length > 100 ? 'detailed' : 'quick',
        code_length: code.length
      },
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      ...helpResponse,
      helpUsed: (helpCount || 0) + 1,
      helpLimit: helpLimit,
      tierLimitReached: (helpCount || 0) + 1 >= helpLimit
    })

  } catch (error) {
    console.error('AI Coding Help Error:', error)
    return NextResponse.json(
      { error: 'Failed to get coding help' },
      { status: 500 }
    )
  }
}