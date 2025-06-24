import { CodeReviewRequest, CodeReviewResponse, AIPersonality } from './types'
import { getPersonalityForTask } from './personalities'

export class CodeReviewService {
  private personality: AIPersonality

  constructor(personality?: AIPersonality) {
    this.personality = personality || getPersonalityForTask('reviewing')
  }

  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
      // This would integrate with actual AI providers
      // For now, we'll return a mock response structure
      
      const prompt = this.buildReviewPrompt(request)
      
      // TODO: Integrate with actual AI provider
      // const response = await this.callAIProvider(prompt, request)
      
      // Mock response for demonstration
      return this.generateMockReview(request)
    } catch (error) {
      console.error('Code review error:', error)
      throw new Error('Failed to review code')
    }
  }

  private buildReviewPrompt(request: CodeReviewRequest): string {
    const { code, language, context, userLevel, focusAreas, workshopContext } = request
    
    let prompt = `${this.personality.systemPrompt}\n\n`
    
    prompt += `Please review the following ${language} code for a ${userLevel} developer:\n\n`
    prompt += `\`\`\`${language}\n${code}\n\`\`\`\n\n`
    
    if (context) {
      prompt += `Context: ${context}\n\n`
    }
    
    if (workshopContext) {
      prompt += `Workshop Context: ${workshopContext.workshopId}\n`
      prompt += `Learning Objectives: ${workshopContext.objectives.join(', ')}\n\n`
    }
    
    if (focusAreas && focusAreas.length > 0) {
      prompt += `Please focus on: ${focusAreas.join(', ')}\n\n`
    }
    
    prompt += `Provide a comprehensive review including:\n`
    prompt += `1. Overall assessment and score (1-10)\n`
    prompt += `2. Specific issues with line numbers\n`
    prompt += `3. Improvement suggestions\n`
    prompt += `4. Best practices recommendations\n`
    prompt += `5. Learning opportunities\n\n`
    
    prompt += `Format your response as structured JSON for easy parsing.`
    
    return prompt
  }

  private generateMockReview(request: CodeReviewRequest): CodeReviewResponse {
    // This is a mock implementation - replace with actual AI integration
    return {
      overall: {
        score: 7,
        summary: `Code shows good understanding of ${request.language} fundamentals with room for improvement in error handling and optimization.`,
        recommendations: [
          'Add proper error handling',
          'Consider performance optimizations',
          'Improve variable naming',
          'Add documentation comments'
        ]
      },
      issues: [
        {
          type: 'warning',
          line: 5,
          message: 'Variable name could be more descriptive',
          severity: 'medium',
          fixSuggestion: 'Consider renaming "data" to something more specific like "userData" or "apiResponse"'
        },
        {
          type: 'suggestion',
          message: 'Consider adding TypeScript for better type safety',
          severity: 'low',
          fixSuggestion: 'Add type annotations to function parameters and return values'
        }
      ],
      improvements: [
        {
          category: 'Code Quality',
          suggestions: [
            'Extract repeated logic into reusable functions',
            'Use consistent indentation',
            'Add meaningful comments for complex logic'
          ]
        },
        {
          category: 'Performance',
          suggestions: [
            'Consider using async/await for better readability',
            'Implement proper error boundaries',
            'Use memoization for expensive calculations'
          ]
        }
      ]
    }
  }

  async getImprovementSuggestions(code: string, language: string): Promise<string[]> {
    // Extract improvement logic into separate method
    const suggestions: string[] = []
    
    // Basic heuristics for common improvements
    if (code.includes('var ')) {
      suggestions.push('Use const/let instead of var for better scoping')
    }
    
    if (!code.includes('try') && code.includes('await')) {
      suggestions.push('Add try-catch blocks for async operations')
    }
    
    if (code.length > 1000) {
      suggestions.push('Consider breaking this into smaller, more focused functions')
    }
    
    return suggestions
  }

  async getBestPractices(language: string): Promise<string[]> {
    const practices: Record<string, string[]> = {
      javascript: [
        'Use strict mode',
        'Prefer const over let, let over var',
        'Use meaningful variable names',
        'Implement proper error handling',
        'Write pure functions when possible'
      ],
      typescript: [
        'Define explicit types for function parameters',
        'Use interfaces for object shapes',
        'Enable strict mode in tsconfig',
        'Avoid any type when possible',
        'Use type guards for runtime validation'
      ],
      python: [
        'Follow PEP 8 style guidelines',
        'Use type hints for better code documentation',
        'Implement proper exception handling',
        'Use virtual environments',
        'Write docstrings for functions and classes'
      ]
    }
    
    return practices[language.toLowerCase()] || practices.javascript
  }
}