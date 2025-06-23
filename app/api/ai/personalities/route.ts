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

    // Get user's tier to determine available personalities
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_tier, prophet_rank')
      .eq('user_id', user.id)
      .single()

    const aiProvider = getAIProvider()
    const allPersonalities = aiProvider.getPersonalities()

    // Filter personalities based on user tier
    const availablePersonalities = allPersonalities.filter(personality => {
      switch (personality.role) {
        case 'mentor':
          return true // Available to all tiers
        case 'reviewer':
          return profile?.current_tier !== 'free' // Apostle tier and above
        case 'guide':
          return profile?.current_tier === 'prophet' || profile?.current_tier === 'divine' // Prophet tier and above
        case 'prophet':
          return profile?.current_tier === 'divine' || profile?.prophet_rank >= 10 // Divine tier or high-rank prophets
        default:
          return true
      }
    })

    // Get usage stats for each personality
    const personalityStats = await Promise.all(
      availablePersonalities.map(async (personality) => {
        const { count } = await supabase
          .from('ai_interactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .contains('input_data', { personality: personality.name })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        return {
          ...personality,
          monthlyUsage: count || 0,
          available: true
        }
      })
    )

    // Add locked personalities for upgrade promotion
    const lockedPersonalities = allPersonalities
      .filter(p => !availablePersonalities.find(a => a.name === p.name))
      .map(personality => ({
        ...personality,
        monthlyUsage: 0,
        available: false,
        requiredTier: personality.role === 'reviewer' ? 'apostle' :
                     personality.role === 'guide' ? 'prophet' : 'divine'
      }))

    return NextResponse.json({
      available: personalityStats,
      locked: lockedPersonalities,
      userTier: profile?.current_tier || 'free',
      prophetRank: profile?.prophet_rank || 1
    })

  } catch (error) {
    console.error('AI Personalities Error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI personalities' },
      { status: 500 }
    )
  }
}