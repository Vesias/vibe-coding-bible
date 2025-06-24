import { NextRequest, NextResponse } from 'next/server'
import { getAIProvider } from '@/lib/ai/provider'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, personality, model, context } = await request.json()
    
    // Get authenticated user (optional for demo)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Initialize AI provider
    const aiProvider = getAIProvider()
    
    // Generate AI response with personality
    const response = await aiProvider.generateResponse(messages, {
      personality,
      model: model || 'auto',
      temperature: 0.7,
      maxTokens: 2000,
      context
    })
    
    // Log usage for analytics (if user is authenticated)
    if (user) {
      try {
        await supabase
          .from('ai_interactions')
          .insert({
            user_id: user.id,
            personality,
            model: response.model,
            tokens_used: response.tokensUsed,
            cost: response.cost,
            execution_time: response.executionTime,
            context_type: context?.workshopId ? 'workshop' : 'general'
          })
      } catch (error) {
        console.warn('Failed to log AI interaction:', error)
      }
    }
    
    return NextResponse.json({
      content: response.content,
      model: response.model,
      provider: response.provider,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      confidence: response.confidence,
      suggestions: response.suggestions,
      codeSnippets: response.codeSnippets,
      executionTime: response.executionTime
    })
    
  } catch (error) {
    console.error('AI Chat API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate AI response',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Chat API is running',
    models: ['gpt-4', 'claude-3-5-sonnet', 'gemini-pro'],
    personalities: ['Moses the Code Giver', 'King Solomon the Debugger', 'David the Code Warrior', 'The Divine Oracle']
  })
}