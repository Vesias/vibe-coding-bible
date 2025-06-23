import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, AuthenticatedRequest, createApiResponse, createErrorResponse } from '@/lib/auth/middleware'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAIProvider, AIMessage } from '@/lib/ai/provider'
import { Database } from '@/lib/database.types'

// Validation schemas
const ChatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().optional(),
  personality: z.string().optional(),
  context: z.object({
    workshopId: z.string().optional(),
    challengeId: z.string().optional(),
    codeContext: z.string().optional(),
    userLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    currentStep: z.string().optional(),
    previousAttempts: z.number().optional(),
    strugglingWith: z.array(z.string()).optional()
  }).optional(),
  sessionId: z.string().optional(),
  requestHelp: z.boolean().optional().default(false)
})

const ConversationHistorySchema = z.object({
  conversationId: z.string(),
  limit: z.number().min(1).max(50).optional().default(20)
})

async function handleChatRequest(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const validation = ChatRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse(
        'Invalid request format',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { message, conversationId, personality, context, sessionId, requestHelp } = validation.data

    // Check subscription limits
    const canUseAI = await checkAIUsageLimits(request.user)
    if (!canUseAI.allowed) {
      return createErrorResponse(canUseAI.message, 403, 'USAGE_LIMIT_EXCEEDED')
    }

    // Get or create conversation
    const conversation = conversationId 
      ? await getConversation(conversationId, request.user.id)
      : await createConversation(request.user.id, context?.workshopId, sessionId)

    if (!conversation) {
      return createErrorResponse('Failed to get conversation', 500, 'CONVERSATION_ERROR')
    }

    // Get conversation history
    const history = await getConversationHistory(conversation.id, 10)
    
    // Prepare AI context
    const aiContext = await prepareAIContext(request.user, context, history)
    
    // Generate AI response
    const aiProvider = getAIProvider()
    
    // Build message history for AI
    const messages: AIMessage[] = [
      ...history.map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.message,
        timestamp: h.created_at
      })),
      {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }
    ]

    // Determine AI model based on request type and user subscription
    let aiModel: 'auto' | 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro' = 'auto'
    
    if (requestHelp && context?.codeContext) {
      aiModel = 'claude-3-5-sonnet' // Best for code analysis
    } else if (request.user.subscription_status === 'divine') {
      aiModel = 'gpt-4' // Premium model for top tier
    }

    const aiResponse = await aiProvider.generateResponse(messages, {
      personality,
      model: aiModel,
      context: aiContext,
      temperature: 0.7,
      maxTokens: 1000
    })

    // Save both user message and AI response to conversation
    await saveToConversation(conversation.id, 'user', message, context)
    await saveToConversation(conversation.id, 'assistant', aiResponse.content, {
      model: aiResponse.model,
      tokensUsed: aiResponse.tokensUsed,
      cost: aiResponse.cost,
      personality
    })

    // Track AI interaction
    await trackAIInteraction(
      request.user.id,
      aiResponse,
      context?.workshopId,
      context?.challengeId,
      conversation.id
    )

    // Update user's AI usage
    await updateAIUsage(request.user.id, aiResponse.tokensUsed, aiResponse.cost)

    // Generate follow-up suggestions
    const suggestions = await generateFollowUpSuggestions(
      message,
      aiResponse.content,
      context
    )

    return createApiResponse({
      response: aiResponse.content,
      conversationId: conversation.id,
      model: aiResponse.model,
      suggestions,
      personality: personality || 'Moses the Code Giver',
      metadata: {
        tokensUsed: aiResponse.tokensUsed,
        executionTime: aiResponse.executionTime,
        confidence: aiResponse.confidence
      },
      divineWisdom: generateDivineWisdom(aiResponse.content)
    })

  } catch (error) {
    console.error('AI Chat API error:', error)
    return createErrorResponse(
      'Failed to process chat request',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleConversationHistory(request: AuthenticatedRequest) {
  try {
    const url = new URL(request.url)
    const conversationId = url.searchParams.get('conversationId')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    if (!conversationId) {
      return createErrorResponse('conversationId is required', 400, 'MISSING_PARAM')
    }

    const validation = ConversationHistorySchema.safeParse({ conversationId, limit })
    if (!validation.success) {
      return createErrorResponse('Invalid parameters', 400, 'VALIDATION_ERROR')
    }

    // Verify user owns this conversation
    const conversation = await getConversation(conversationId, request.user.id)
    if (!conversation) {
      return createErrorResponse('Conversation not found', 404, 'NOT_FOUND')
    }

    const history = await getConversationHistory(conversationId, limit)
    
    return createApiResponse({
      conversationId,
      messages: history,
      totalMessages: history.length
    })

  } catch (error) {
    console.error('Conversation history API error:', error)
    return createErrorResponse(
      'Failed to get conversation history',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Helper functions
async function checkAIUsageLimits(user: AuthenticatedRequest['user']) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get user's AI interactions for today
    const today = new Date().toISOString().split('T')[0]
    const { data: todayUsage, error } = await supabase
      .from('ai_interactions')
      .select('tokens_used, cost')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)

    if (error) {
      console.error('Error checking AI usage:', error)
      return { allowed: true, message: '' } // Allow on error to avoid blocking
    }

    const totalTokens = todayUsage.reduce((sum, interaction) => sum + interaction.tokens_used, 0)
    const totalCost = todayUsage.reduce((sum, interaction) => sum + interaction.cost, 0)

    // Define limits based on subscription tier
    const limits = {
      free: { tokens: 10000, cost: 0.50, interactions: 10 },
      basic: { tokens: 50000, cost: 2.50, interactions: 50 },
      pro: { tokens: 200000, cost: 10.00, interactions: 200 },
      divine: { tokens: 1000000, cost: 50.00, interactions: 1000 }
    }

    const userLimits = limits[user.subscription_status]
    
    if (todayUsage.length >= userLimits.interactions) {
      return {
        allowed: false,
        message: `Daily AI interaction limit reached (${userLimits.interactions}). Upgrade your subscription for higher limits.`
      }
    }

    if (totalTokens >= userLimits.tokens) {
      return {
        allowed: false,
        message: `Daily token limit reached (${userLimits.tokens}). Upgrade your subscription for higher limits.`
      }
    }

    if (totalCost >= userLimits.cost) {
      return {
        allowed: false,
        message: `Daily cost limit reached ($${userLimits.cost}). Upgrade your subscription for higher limits.`
      }
    }

    return { allowed: true, message: '' }

  } catch (error) {
    console.error('Error checking AI usage limits:', error)
    return { allowed: true, message: '' } // Allow on error
  }
}

async function getConversation(conversationId: string, userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('ai_mentoring_sessions')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error getting conversation:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting conversation:', error)
    return null
  }
}

async function createConversation(userId: string, workshopId?: string, sessionId?: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('ai_mentoring_sessions')
      .insert({
        user_id: userId,
        workshop_id: workshopId,
        ai_model: 'gpt-4',
        session_name: `Chat Session ${new Date().toLocaleString()}`,
        goals: [],
        conversation_history: [],
        skill_assessment: {},
        personalized_recommendations: {},
        learning_path_adjustments: {},
        session_duration: 0,
        outcomes_achieved: [],
        next_session_recommendations: []
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating conversation:', error)
    return null
  }
}

async function getConversationHistory(conversationId: string, limit: number) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('ai_interactions')
      .select('*')
      .eq('session_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error getting conversation history:', error)
      return []
    }

    return data.map(interaction => ({
      role: interaction.interaction_type === 'mentoring' ? 'assistant' : 'user',
      message: interaction.interaction_type === 'mentoring' ? interaction.response : interaction.prompt,
      created_at: interaction.created_at,
      metadata: interaction.metadata
    }))
  } catch (error) {
    console.error('Error getting conversation history:', error)
    return []
  }
}

async function saveToConversation(
  conversationId: string,
  role: 'user' | 'assistant',
  message: string,
  context?: any
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // This would be stored in ai_interactions table
    // For now, we'll update the conversation_history in ai_mentoring_sessions
    const { data: session, error: fetchError } = await supabase
      .from('ai_mentoring_sessions')
      .select('conversation_history')
      .eq('id', conversationId)
      .single()

    if (fetchError) {
      console.error('Error fetching conversation for update:', fetchError)
      return
    }

    const history = Array.isArray(session.conversation_history) ? session.conversation_history : []
    history.push({
      role,
      message,
      timestamp: new Date().toISOString(),
      context
    })

    const { error: updateError } = await supabase
      .from('ai_mentoring_sessions')
      .update({
        conversation_history: history,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId)

    if (updateError) {
      console.error('Error updating conversation history:', updateError)
    }

  } catch (error) {
    console.error('Error saving to conversation:', error)
  }
}

async function trackAIInteraction(
  userId: string,
  aiResponse: any,
  workshopId?: string,
  challengeId?: string,
  sessionId?: string
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    await supabase
      .from('ai_interactions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        workshop_id: workshopId,
        challenge_id: challengeId,
        ai_model: aiResponse.model as Database['public']['Enums']['ai_model_type'],
        interaction_type: 'mentoring',
        prompt: '', // This would be the user's message
        response: aiResponse.content,
        feedback_rating: null,
        was_helpful: true,
        processing_time: aiResponse.executionTime,
        tokens_used: aiResponse.tokensUsed,
        cost: aiResponse.cost,
        metadata: {
          personality: aiResponse.personality,
          confidence: aiResponse.confidence
        }
      })

  } catch (error) {
    console.error('Error tracking AI interaction:', error)
  }
}

async function updateAIUsage(userId: string, tokens: number, cost: number) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Update daily analytics
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing, error: fetchError } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
      console.error('Error fetching user analytics:', fetchError)
      return
    }

    if (existing) {
      // Update existing record
      await supabase
        .from('user_analytics')
        .update({
          ai_interactions: existing.ai_interactions + 1
        })
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabase
        .from('user_analytics')
        .insert({
          user_id: userId,
          date: today,
          ai_interactions: 1,
          coding_time_minutes: 0,
          workshops_completed: 0,
          challenges_solved: 0,
          collaboration_sessions: 0,
          xp_earned: 0,
          skill_improvements: {},
          learning_velocity: 0,
          engagement_score: 0,
          retention_risk_score: 0,
          personalized_insights: {}
        })
    }

  } catch (error) {
    console.error('Error updating AI usage:', error)
  }
}

async function prepareAIContext(
  user: AuthenticatedRequest['user'],
  context?: any,
  history?: any[]
) {
  return {
    user: {
      level: user.subscription_status,
      rank: user.prophet_rank
    },
    workshop: context?.workshopId,
    challenge: context?.challengeId,
    conversationLength: history?.length || 0,
    codeContext: context?.codeContext,
    strugglingWith: context?.strugglingWith
  }
}

async function generateFollowUpSuggestions(
  userMessage: string,
  aiResponse: string,
  context?: any
): Promise<string[]> {
  // Simple rule-based suggestions - could be enhanced with AI
  const suggestions = []
  
  if (context?.codeContext) {
    suggestions.push("Can you explain this code in more detail?")
    suggestions.push("How can I improve this code's performance?")
    suggestions.push("What are some common mistakes in this pattern?")
  } else {
    suggestions.push("Can you give me a practical example?")
    suggestions.push("What should I learn next?")
    suggestions.push("How does this relate to real-world projects?")
  }
  
  return suggestions.slice(0, 3)
}

function generateDivineWisdom(response: string): string {
  const wisdomSayings = [
    "As it is written in the sacred code, 'Every bug is a blessing in disguise, teaching us the true path.'",
    "Remember, young seeker, 'The journey of a thousand lines begins with a single function.'",
    "In the words of the ancient prophets, 'Error messages are not failures, but divine guidance.'",
    "The sacred scrolls teach us, 'Refactoring is the art of spiritual cleansing for code.'",
    "As the coding commandments declare, 'Clean code is next to godliness.'"
  ]
  
  return wisdomSayings[Math.floor(Math.random() * wisdomSayings.length)]
}

// Create rate-limited handlers
const rateLimitedChatHandler = withRateLimit(
  withAuth(handleChatRequest, { requireSubscription: false }),
  rateLimitConfigs.aiChat
)

const rateLimitedHistoryHandler = withRateLimit(
  withAuth(handleConversationHistory, { requireSubscription: false }),
  rateLimitConfigs.api
)

export const POST = rateLimitedChatHandler
export const GET = rateLimitedHistoryHandler