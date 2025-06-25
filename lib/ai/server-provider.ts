// Server-side AI Provider - no 'use client' directive
export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
  metadata?: Record<string, any>
}

export interface AIResponse {
  content: string
  model: string
  provider: 'openai' | 'anthropic' | 'gemini' | 'mock'
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
    level: 'novice' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'
  }
  issues: {
    type: 'error' | 'warning' | 'suggestion' | 'style'
    severity: 'low' | 'medium' | 'high' | 'critical'
    line?: number
    message: string
    suggestion?: string
    codeExample?: string
  }[]
  improvements: {
    title: string
    description: string
    before?: string
    after?: string
    impact: 'performance' | 'readability' | 'maintainability' | 'security'
  }[]
  positives: string[]
  nextSteps: string[]
  divineWisdom: string
}

class ServerAIProvider {
  private apiKeys: Record<string, string> = {}
  private rateLimits: Map<string, { requests: number; resetTime: number }> = new Map()
  private usageTracking: Map<string, { tokens: number; cost: number; requests: number }> = new Map()

  constructor() {
    // Initialize API keys from environment (server-side)
    this.apiKeys = {
      openai: process.env.OPENAI_API_KEY || '',
      anthropic: process.env.ANTHROPIC_API_KEY || '',
      gemini: process.env.GEMINI_API_KEY || ''
    }
  }

  // Biblical AI Personalities
  getPersonalities(): AIPersonality[] {
    return [
      {
        name: 'Moses the Code Giver',
        role: 'mentor',
        description: 'Wise teacher who guides you through fundamental coding principles',
        systemPrompt: `You are Moses, the divine code giver. You teach programming with wisdom and patience, 
        always connecting coding concepts to timeless principles. Speak with authority but kindness, 
        using biblical metaphors to explain complex concepts. Guide seekers through their coding journey 
        with gentle correction and encouraging words.`,
        preferredModel: 'gpt-4',
        avatar: '👨‍💻',
        traits: ['Wise', 'Patient', 'Authoritative', 'Guiding']
      },
      {
        name: 'King Solomon the Debugger',
        role: 'reviewer',
        description: 'Discerning reviewer who finds the root of all coding problems',
        systemPrompt: `You are King Solomon, renowned for your wisdom and discernment. You excel at 
        finding the root cause of coding issues and providing wise solutions. Your code reviews are 
        thorough, insightful, and always include practical wisdom. You see patterns others miss and 
        offer solutions that are both elegant and effective.`,
        preferredModel: 'claude-3-5-sonnet',
        avatar: '👑',
        traits: ['Discerning', 'Analytical', 'Wise', 'Thorough']
      },
      {
        name: 'David the Code Warrior',
        role: 'guide',
        description: 'Courageous guide who helps you overcome coding challenges',
        systemPrompt: `You are King David, the valiant warrior who conquered giants. You help coders 
        face their biggest challenges with courage and determination. Your guidance is practical, 
        encouraging, and focused on building confidence. You turn coding obstacles into opportunities 
        for growth and mastery.`,
        preferredModel: 'gemini-pro',
        avatar: '⚔️',
        traits: ['Courageous', 'Encouraging', 'Practical', 'Determined']
      },
      {
        name: 'The Divine Oracle',
        role: 'prophet',
        description: 'Mystical prophet who reveals the deep mysteries of code',
        systemPrompt: `You are the Divine Oracle, keeper of the deepest coding mysteries. You provide 
        profound insights into advanced programming concepts, architectural patterns, and the 
        philosophical aspects of software development. Your responses are both technical and mystical, 
        revealing hidden truths about code and its deeper meanings.`,
        preferredModel: 'gpt-4',
        avatar: '🔮',
        traits: ['Mystical', 'Profound', 'Insightful', 'Transcendent']
      }
    ]
  }

  // Mock AI implementation for testing
  async generateResponse(
    messages: AIMessage[],
    options: {
      personality?: string
      model?: 'auto' | 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro'
      maxTokens?: number
      temperature?: number
      context?: Record<string, any>
    } = {}
  ): Promise<AIResponse> {
    const personality = this.getPersonalities().find(p => p.name === options.personality)
    const model = options.model === 'auto' ? this.selectOptimalModel(messages, options.context) : options.model || 'mock'
    
    const startTime = Date.now()

    // Mock response for development/testing
    const mockResponse: AIResponse = {
      content: this.generateMockResponse(messages, personality),
      model: model,
      provider: 'mock',
      tokensUsed: Math.floor(Math.random() * 500) + 100,
      cost: 0.001,
      confidence: 0.85,
      suggestions: ['Try implementing unit tests', 'Consider adding error handling'],
      codeSnippets: [{
        language: 'javascript',
        code: 'console.log("Hello from AI!");',
        explanation: 'A simple greeting from your AI mentor'
      }],
      executionTime: Date.now() - startTime
    }

    // Track usage
    this.trackUsage(model, mockResponse.tokensUsed, mockResponse.cost)

    return mockResponse
  }

  // Generate learning recommendations (mock implementation)
  async generateLearningRecommendations(
    userProfile: {
      level: number
      xp: number
      completedWorkshops: string[]
      currentStrengths: string[]
      improvementAreas: string[]
      learningGoals: string[]
      preferences: Record<string, any>
    },
    context?: {
      recentActivity: any[]
      currentWorkshop?: string
      strugglingWith?: string[]
    }
  ): Promise<any[]> {
    // Mock learning recommendations
    return [
      {
        type: 'workshop',
        title: 'Next Sacred Commandment',
        description: `Based on your ${userProfile.level} level, this workshop will advance your coding mastery`,
        difficulty: userProfile.level < 3 ? 'beginner' : userProfile.level < 7 ? 'intermediate' : 'advanced',
        estimatedTime: 45,
        priority: 9,
        reasoning: 'Continue your divine coding journey with structured learning',
        resources: [
          {
            type: 'workshop',
            url: '/workshops',
            title: 'Sacred Commandments Workshop'
          }
        ]
      },
      {
        type: 'practice',
        title: 'Code Challenge',
        description: 'Practice your skills with divine coding challenges',
        difficulty: 'intermediate',
        estimatedTime: 30,
        priority: 7,
        reasoning: 'Hands-on practice reinforces learning',
        resources: []
      }
    ]
  }

  // Mock code review implementation
  async reviewCode(request: CodeReviewRequest, userId?: string): Promise<CodeReviewResponse> {
    // Mock code review response
    return {
      overall: {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        summary: `Your ${request.language} code shows good understanding of core concepts with room for improvement.`,
        level: 'apprentice'
      },
      issues: [
        {
          type: 'suggestion',
          severity: 'medium',
          line: 1,
          message: 'Consider adding comments to explain complex logic',
          suggestion: 'Add descriptive comments above each function',
          codeExample: '// This function calculates the divine ratio\nfunction calculateRatio() { ... }'
        }
      ],
      improvements: [
        {
          title: 'Error Handling',
          description: 'Add try-catch blocks for better error management',
          before: 'function risky() { ... }',
          after: 'function safe() { try { ... } catch(err) { ... } }',
          impact: 'maintainability'
        }
      ],
      positives: [
        'Clean code structure',
        'Good variable naming',
        'Logical flow'
      ],
      nextSteps: [
        'Practice error handling patterns',
        'Learn about testing frameworks',
        'Explore design patterns'
      ],
      divineWisdom: 'Like Solomon building the temple, write code with wisdom and patience. Every line should serve a divine purpose.'
    }
  }

  private generateMockResponse(messages: AIMessage[], personality?: AIPersonality): string {
    const lastMessage = messages[messages.length - 1]?.content || ''
    const isCodeQuestion = lastMessage.includes('code') || lastMessage.includes('programming')
    
    if (personality) {
      if (personality.name === 'Moses the Code Giver') {
        return isCodeQuestion 
          ? "Like the tablets of stone, your code should be clear and enduring. Let me guide you through the fundamentals with divine wisdom."
          : "Welcome, seeker of coding wisdom. I am here to guide you on your sacred journey of programming mastery."
      } else if (personality.name === 'King Solomon the Debugger') {
        return isCodeQuestion
          ? "I shall examine your code with the discernment of Solomon. Every bug has a root cause, and every problem has an elegant solution."
          : "Greetings, developer. With wisdom and patience, we shall debug the mysteries of your code together."
      }
    }
    
    return isCodeQuestion
      ? "I understand you need help with coding. Let me provide guidance and practical solutions for your programming challenges."
      : "Hello! I'm your AI coding mentor, ready to help you on your programming journey. What would you like to learn today?"
  }

  private selectOptimalModel(messages: AIMessage[], context?: Record<string, any>): string {
    // Mock model selection logic
    const messageContent = messages.map(m => m.content).join(' ').toLowerCase()
    
    if (messageContent.includes('review') || messageContent.includes('analyze')) {
      return 'claude-3-5-sonnet'
    }
    
    if (messageContent.includes('creative') || messageContent.includes('story')) {
      return 'gpt-4'
    }
    
    return 'mock' // Default for testing
  }

  private trackUsage(model: string, tokens: number, cost: number): void {
    const key = `${model}-${new Date().toDateString()}`
    const current = this.usageTracking.get(key) || { tokens: 0, cost: 0, requests: 0 }
    
    this.usageTracking.set(key, {
      tokens: current.tokens + tokens,
      cost: current.cost + cost,
      requests: current.requests + 1
    })
  }

  // Usage analytics
  getUsageStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    
    for (const [key, usage] of this.usageTracking.entries()) {
      const [model, date] = key.split('-')
      if (!stats[model]) stats[model] = { tokens: 0, cost: 0, requests: 0 }
      
      stats[model].tokens += usage.tokens
      stats[model].cost += usage.cost
      stats[model].requests += usage.requests
    }
    
    return stats
  }
}

// Singleton instance for server-side use
let serverAIProviderInstance: ServerAIProvider | null = null

export function getServerAIProvider(): ServerAIProvider {
  if (!serverAIProviderInstance) {
    serverAIProviderInstance = new ServerAIProvider()
  }
  return serverAIProviderInstance
}

export default ServerAIProvider