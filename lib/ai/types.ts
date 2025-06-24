// AI Provider Types - Core interfaces for the AI system

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
  metadata?: Record<string, any>
}

export interface AIResponse {
  content: string
  model: string
  provider: 'openai' | 'anthropic' | 'gemini' | 'custom'
  tokensUsed: number
  cost: number
  confidence: number
  suggestions?: string[]
  codeSnippets?: CodeSnippet[]
  executionTime: number
  reasoning?: string
}

export interface CodeSnippet {
  language: string
  code: string
  explanation: string
  title?: string
}

export interface AIPersonality {
  name: string
  role: 'mentor' | 'reviewer' | 'guide' | 'prophet'
  description: string
  systemPrompt: string
  preferredModel: string
  avatar: string
  traits: string[]
}

export interface CodeReviewRequest {
  code: string
  language: string
  context?: string
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  focusAreas?: ('bugs' | 'performance' | 'readability' | 'security' | 'best-practices')[]
  workshopContext?: {
    workshopId: string
    stepId: string
    objectives: string[]
  }
}

export interface CodeReviewResponse {
  overall: {
    score: number
    summary: string
    recommendations: string[]
  }
  issues: {
    type: 'error' | 'warning' | 'suggestion'
    line?: number
    message: string
    severity: 'high' | 'medium' | 'low'
    fixSuggestion?: string
  }[]
  improvements: {
    category: string
    suggestions: string[]
    examples?: CodeSnippet[]
  }[]
}

export interface LearningRecommendation {
  id: string
  title: string
  description: string
  type: 'workshop' | 'exercise' | 'reading' | 'video'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  xpReward: number
  relatedSkills: string[]
  personalizedReason: string
}

export interface AIProviderConfig {
  openai?: {
    apiKey: string
    model: string
    maxTokens?: number
  }
  anthropic?: {
    apiKey: string
    model: string
    maxTokens?: number
  }
  gemini?: {
    apiKey: string
    model: string
    maxTokens?: number
  }
}

export interface ConversationContext {
  sessionId: string
  userId?: string
  workshopId?: string
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  currentGoals: string[]
  recentCode?: string[]
  personality: AIPersonality
  messageHistory: AIMessage[]
}