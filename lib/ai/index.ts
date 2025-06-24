// AI System - Modular AI provider for Vibe Coding Bible

// Core types
export type {
  AIMessage,
  AIResponse,
  CodeSnippet,
  AIPersonality,
  CodeReviewRequest,
  CodeReviewResponse,
  LearningRecommendation,
  AIProviderConfig,
  ConversationContext
} from './types'

// Services
export { CodeReviewService } from './code-review'
export { LearningRecommendationService } from './learning-recommendations'
export { ConversationService } from './conversation'

// Personalities
export { 
  aiPersonalities,
  getPersonalityByName,
  getPersonalitiesByRole,
  getRandomPersonality,
  getPersonalityForTask
} from './personalities'

// Main provider class
export { AIProvider } from './provider-refactored'