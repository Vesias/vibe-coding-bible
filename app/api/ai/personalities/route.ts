import { NextResponse } from 'next/server'
import { getServerAIProvider } from '@/lib/ai/server-provider'

export async function GET() {
  try {
    const aiProvider = getServerAIProvider()
    const personalities = aiProvider.getPersonalities()
    
    // Enhanced personality data with additional features
    const enhancedPersonalities = personalities.map(personality => ({
      ...personality,
      id: personality.name.toLowerCase().replace(/\s+/g, '-'),
      expertise: personality.traits,
      languages: ['deutsch', 'english'], // Multi-language support
      tier: 'premium' as const,
      rating: 4.8 + Math.random() * 0.2, // Random rating between 4.8-5.0
      responseTime: Math.floor(1000 + Math.random() * 2000) + 'ms',
      specialties: personality.traits,
      xpBonus: Math.floor(10 + Math.random() * 20) // Random XP bonus 10-30
    }))
    
    return NextResponse.json({
      available: enhancedPersonalities,
      total: enhancedPersonalities.length,
      defaultPersonality: enhancedPersonalities[0].id
    })
    
  } catch (error) {
    console.error('AI Personalities API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to load AI personalities',
        available: [],
        total: 0
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  // Future: Allow users to create custom personalities
  return NextResponse.json(
    { error: 'Custom personality creation not yet implemented' },
    { status: 501 }
  )
}