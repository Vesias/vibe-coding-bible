import { AIProviderConfig, ConversationContext, AIPersonality } from './types'
import { CodeReviewService } from './code-review'
import { LearningRecommendationService } from './learning-recommendations'
import { ConversationService } from './conversation'
import { getPersonalityForTask, getPersonalityByName } from './personalities'

export class AIProvider {
  private config: AIProviderConfig
  private codeReviewService: CodeReviewService
  private learningService: LearningRecommendationService
  private activeConversations: Map<string, ConversationService> = new Map()

  constructor(config?: AIProviderConfig) {
    this.config = config || {
      openai: {
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
        model: 'gpt-4',
        maxTokens: 2000
      },
      anthropic: {
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
        model: 'claude-3-5-sonnet',
        maxTokens: 4000
      },
      gemini: {
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
        model: 'gemini-pro',
        maxTokens: 2000
      }
    }

    this.codeReviewService = new CodeReviewService()
    this.learningService = new LearningRecommendationService()
  }

  // Code Review Methods
  async reviewCode(request: any) {
    return await this.codeReviewService.reviewCode(request)
  }

  async getCodeImprovements(code: string, language: string) {
    return await this.codeReviewService.getImprovementSuggestions(code, language)
  }

  async getLanguageBestPractices(language: string) {
    return await this.codeReviewService.getBestPractices(language)
  }

  // Learning Recommendation Methods
  async getPersonalizedLearning(
    userGoals: string[],
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    recentActivity: string[] = [],
    completedWorkshops: string[] = []
  ) {
    this.learningService = new LearningRecommendationService(userLevel)
    return await this.learningService.getPersonalizedRecommendations(
      userGoals,
      recentActivity,
      completedWorkshops
    )
  }

  async analyzeSkillGaps(targetSkills: string[]) {
    return await this.learningService.getSkillGapAnalysis(targetSkills)
  }

  // Conversation Methods
  createConversation(
    sessionId: string,
    userId: string,
    options: {
      personality?: AIPersonality | string
      userLevel?: 'beginner' | 'intermediate' | 'advanced'
      workshopId?: string
      currentGoals?: string[]
    } = {}
  ): ConversationService {
    let personality: AIPersonality
    
    if (typeof options.personality === 'string') {
      personality = getPersonalityByName(options.personality) || getPersonalityForTask('learning')
    } else {
      personality = options.personality || getPersonalityForTask('learning')
    }

    const context: ConversationContext = {
      sessionId,
      userId,
      workshopId: options.workshopId,
      userLevel: options.userLevel || 'beginner',
      currentGoals: options.currentGoals || [],
      personality,
      messageHistory: []
    }

    const conversation = new ConversationService(context)
    this.activeConversations.set(sessionId, conversation)
    
    return conversation
  }

  getConversation(sessionId: string): ConversationService | undefined {
    return this.activeConversations.get(sessionId)
  }

  closeConversation(sessionId: string): void {
    this.activeConversations.delete(sessionId)
  }

  // Utility Methods
  isConfigured(): boolean {
    return !!(
      this.config.openai?.apiKey || 
      this.config.anthropic?.apiKey || 
      this.config.gemini?.apiKey
    )
  }

  getAvailableProviders(): string[] {
    const providers: string[] = []
    
    if (this.config.openai?.apiKey) providers.push('openai')
    if (this.config.anthropic?.apiKey) providers.push('anthropic')
    if (this.config.gemini?.apiKey) providers.push('gemini')
    
    return providers
  }

  async testConnection(): Promise<{ 
    success: boolean
    availableProviders: string[]
    errors: string[]
  }> {
    const availableProviders = this.getAvailableProviders()
    const errors: string[] = []

    // TODO: Add actual connection tests to providers
    
    if (availableProviders.length === 0) {
      errors.push('No AI providers configured')
    }

    return {
      success: availableProviders.length > 0,
      availableProviders,
      errors
    }
  }

  // Workshop Integration Methods
  async getWorkshopGuidance(
    workshopId: string,
    stepId: string,
    userQuestion: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ) {
    const personality = getPersonalityForTask('learning')
    const sessionId = `workshop-${workshopId}-${Date.now()}`
    
    const conversation = this.createConversation(sessionId, 'anonymous', {
      personality,
      userLevel,
      workshopId,
      currentGoals: [`Complete workshop ${workshopId} step ${stepId}`]
    })

    return await conversation.sendMessage(userQuestion, 'question')
  }

  async getExerciseHelp(
    exerciseCode: string,
    language: string,
    exerciseGoal: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ) {
    const personality = getPersonalityForTask('reviewing')
    const sessionId = `exercise-help-${Date.now()}`
    
    const conversation = this.createConversation(sessionId, 'anonymous', {
      personality,
      userLevel,
      currentGoals: [exerciseGoal]
    })

    const message = `I'm working on this ${language} code for: ${exerciseGoal}\n\n\`\`\`${language}\n${exerciseCode}\n\`\`\`\n\nCan you help me improve it?`
    
    return await conversation.sendMessage(message, 'code')
  }

  // Progress Tracking
  getProviderUsage(): {
    conversationsActive: number
    totalSessions: number
    averageMessagesPerSession: number
  } {
    const conversationsActive = this.activeConversations.size
    const totalSessions = this.activeConversations.size // This would be tracked properly in production
    
    let totalMessages = 0
    this.activeConversations.forEach(conversation => {
      const exported = conversation.exportConversation()
      totalMessages += exported.messageCount
    })
    
    const averageMessagesPerSession = conversationsActive > 0 
      ? Math.round(totalMessages / conversationsActive) 
      : 0

    return {
      conversationsActive,
      totalSessions,
      averageMessagesPerSession
    }
  }
}