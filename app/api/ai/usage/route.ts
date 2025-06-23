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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000)

    // Get user's AI usage statistics
    const { data: interactions } = await supabase
      .from('ai_interactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (!interactions) {
      return NextResponse.json({
        totalInteractions: 0,
        totalTokens: 0,
        totalCost: 0,
        byType: {} as any,
        byModel: {} as any,
        byDay: [] as any[],
        monthlyLimits: {} as any
      })
    }

    // Calculate statistics
    const stats = {
      totalInteractions: interactions.length,
      totalTokens: interactions.reduce((sum, i) => sum + (i.tokens_used || 0), 0),
      totalCost: interactions.reduce((sum, i) => sum + (i.cost || 0), 0),
      byType: {} as any,
      byModel: {} as any,
      byDay: [] as any[],
      monthlyLimits: {} as any
    }

    // Group by interaction type
    stats.byType = interactions.reduce((acc, interaction) => {
      const type = interaction.interaction_type
      if (!acc[type]) {
        acc[type] = { count: 0, tokens: 0, cost: 0 }
      }
      acc[type].count += 1
      acc[type].tokens += interaction.tokens_used || 0
      acc[type].cost += interaction.cost || 0
      return acc
    }, {})

    // Group by model
    stats.byModel = interactions.reduce((acc, interaction) => {
      const model = interaction.model_used || 'unknown'
      if (!acc[model]) {
        acc[model] = { count: 0, tokens: 0, cost: 0 }
      }
      acc[model].count += 1
      acc[model].tokens += interaction.tokens_used || 0
      acc[model].cost += interaction.cost || 0
      return acc
    }, {})

    // Group by day for charts
    const dailyUsage = new Map()
    interactions.forEach(interaction => {
      const day = interaction.created_at.split('T')[0]
      if (!dailyUsage.has(day)) {
        dailyUsage.set(day, { date: day, interactions: 0, tokens: 0, cost: 0 })
      }
      const dayStats = dailyUsage.get(day)
      dayStats.interactions += 1
      dayStats.tokens += interaction.tokens_used || 0
      dayStats.cost += interaction.cost || 0
    })
    stats.byDay = Array.from(dailyUsage.values()).sort((a, b) => a.date.localeCompare(b.date))

    // Get user tier and calculate limits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('current_tier')
      .eq('user_id', user.id)
      .single()

    const tier = profile?.current_tier || 'free'

    // Define monthly limits by tier
    const limits: any = {
      free: { chat: 10, review: 5, help: 5, recommendations: 3 },
      apostle: { chat: 100, review: 50, help: 50, recommendations: 20 },
      prophet: { chat: 500, review: 200, help: 200, recommendations: 100 },
      divine: { chat: -1, review: -1, help: -1, recommendations: -1 } // unlimited
    }

    stats.monthlyLimits = {
      limits: limits[tier] || limits.free,
      usage: Object.keys(stats.byType).reduce((acc: Record<string, number>, type) => {
        acc[type] = stats.byType[type].count
        return acc
      }, {}),
      tier
    }

    // Get AI provider usage stats (global)
    const aiProvider = getAIProvider()
    const providerStats = aiProvider.getUsageStats()

    return NextResponse.json({
      userStats: stats,
      providerStats,
      insights: {
        mostUsedFeature: Object.keys(stats.byType).reduce((a, b) => 
          stats.byType[a].count > stats.byType[b].count ? a : b, Object.keys(stats.byType)[0]
        ),
        mostUsedModel: Object.keys(stats.byModel).reduce((a, b) => 
          stats.byModel[a].count > stats.byModel[b].count ? a : b, Object.keys(stats.byModel)[0]
        ),
        averageCostPerInteraction: stats.totalCost / (stats.totalInteractions || 1),
        averageTokensPerInteraction: stats.totalTokens / (stats.totalInteractions || 1)
      }
    })

  } catch (error) {
    console.error('AI Usage Stats Error:', error)
    return NextResponse.json(
      { error: 'Failed to get usage statistics' },
      { status: 500 }
    )
  }
}