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
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, personality, model, context } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const aiProvider = getAIProvider()

    // Generate AI response
    const response = await aiProvider.generateResponse(messages, {
      personality,
      model: model || 'auto',
      temperature: 0.7,
      context
    })

    // Save conversation to database
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'chat',
      input_data: { messages, personality, model },
      output_data: response,
      tokens_used: response.tokensUsed,
      cost: response.cost,
      model_used: response.model,
      created_at: new Date().toISOString()
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}