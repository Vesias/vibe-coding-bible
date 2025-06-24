import { AIMessage, AIResponse, ConversationContext, AIPersonality } from './types'
import { getPersonalityForTask } from './personalities'

export class ConversationService {
  private context: ConversationContext
  private maxHistoryLength = 20

  constructor(context: ConversationContext) {
    this.context = context
  }

  async sendMessage(message: string, messageType: 'question' | 'code' | 'request' = 'question'): Promise<AIResponse> {
    try {
      // Add user message to history
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        metadata: { type: messageType }
      }
      
      this.addMessageToHistory(userMessage)
      
      // Build conversation prompt
      const prompt = this.buildConversationPrompt(message, messageType)
      
      // TODO: Integrate with actual AI provider
      // const response = await this.callAIProvider(prompt)
      
      // Mock response for demonstration
      const aiResponse = this.generateMockResponse(message, messageType)
      
      // Add AI response to history
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        metadata: { 
          model: aiResponse.model,
          confidence: aiResponse.confidence
        }
      }
      
      this.addMessageToHistory(assistantMessage)
      
      return aiResponse
    } catch (error) {
      console.error('Conversation error:', error)
      throw new Error('Failed to process conversation')
    }
  }

  private buildConversationPrompt(message: string, messageType: string): string {
    let prompt = `${this.context.personality.systemPrompt}\n\n`
    
    // Add context information
    prompt += `User Level: ${this.context.userLevel}\n`
    
    if (this.context.workshopId) {
      prompt += `Current Workshop: ${this.context.workshopId}\n`
    }
    
    if (this.context.currentGoals.length > 0) {
      prompt += `User Goals: ${this.context.currentGoals.join(', ')}\n`
    }
    
    prompt += '\n'
    
    // Add conversation history (last few messages for context)
    const recentHistory = this.context.messageHistory.slice(-6)
    if (recentHistory.length > 0) {
      prompt += 'Recent conversation:\n'
      recentHistory.forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`
      })
      prompt += '\n'
    }
    
    // Add current message with type context
    prompt += `User (${messageType}): ${message}\n\n`
    
    // Add specific instructions based on message type
    switch (messageType) {
      case 'code':
        prompt += 'Please review this code and provide feedback, suggestions, and learning insights.\n'
        break
      case 'question':
        prompt += 'Please answer this question in the context of the Vibe Coding methodology.\n'
        break
      case 'request':
        prompt += 'Please help with this request, providing practical guidance and next steps.\n'
        break
    }
    
    prompt += 'Respond in character, maintaining your personality while being helpful and educational.'
    
    return prompt
  }

  private generateMockResponse(message: string, messageType: string): AIResponse {
    // This is a mock implementation - replace with actual AI integration
    const responses: Record<string, string> = {
      code: `Looking at your code, I can see ${this.context.personality.name.split(' ')[0]} would say: 
      
This shows promise! However, consider these divine improvements:
1. Add error handling for robust operation
2. Use more descriptive variable names for clarity
3. Consider extracting repeated logic into functions

Remember, clean code is a love letter to your future self. Would you like me to guide you through refactoring this?`,
      
      question: `Ah, an excellent question! As ${this.context.personality.name}, I must tell you:

The path to mastery requires understanding both the 'what' and the 'why'. In the sacred tradition of coding, we must:

1. Start with clear intention (your vision)
2. Choose the right tools (your stack)
3. Write with wisdom (clean, maintainable code)

What specific aspect would you like to explore deeper? The divine mysteries of code await your curiosity!`,
      
      request: `I understand your request, seeker. ${this.context.personality.name} suggests this approach:

🎯 **Immediate Steps:**
1. Clarify your specific goal
2. Break it into smaller, manageable pieces
3. Use AI assistance for each step

📚 **Learning Path:**
- Start with fundamentals if needed
- Practice with guided exercises
- Build confidence through small wins

Would you like me to create a detailed plan for your journey?`
    }
    
    return {
      content: responses[messageType] || responses.question,
      model: this.context.personality.preferredModel,
      provider: 'anthropic',
      tokensUsed: 150,
      cost: 0.002,
      confidence: 0.85,
      executionTime: 1200,
      suggestions: [
        'Try asking about specific coding challenges',
        'Request code review for improvement',
        'Ask for learning recommendations'
      ]
    }
  }

  private addMessageToHistory(message: AIMessage): void {
    this.context.messageHistory.push(message)
    
    // Trim history if it gets too long
    if (this.context.messageHistory.length > this.maxHistoryLength) {
      this.context.messageHistory = this.context.messageHistory.slice(-this.maxHistoryLength)
    }
  }

  getConversationSummary(): string {
    const messageCount = this.context.messageHistory.length
    const personality = this.context.personality.name
    
    if (messageCount === 0) {
      return `Ready to begin your journey with ${personality}!`
    }
    
    const recentTopics = this.extractTopics(this.context.messageHistory.slice(-5))
    
    return `Continuing conversation with ${personality}. Recent topics: ${recentTopics.join(', ')}`
  }

  private extractTopics(messages: AIMessage[]): string[] {
    // Simple topic extraction - could be enhanced with NLP
    const topics = new Set<string>()
    
    messages.forEach(message => {
      const content = message.content.toLowerCase()
      
      if (content.includes('code') || content.includes('function') || content.includes('variable')) {
        topics.add('coding')
      }
      if (content.includes('debug') || content.includes('error') || content.includes('bug')) {
        topics.add('debugging')
      }
      if (content.includes('learn') || content.includes('workshop') || content.includes('practice')) {
        topics.add('learning')
      }
      if (content.includes('project') || content.includes('build') || content.includes('create')) {
        topics.add('project planning')
      }
    })
    
    return Array.from(topics)
  }

  async switchPersonality(newPersonality: AIPersonality): Promise<void> {
    const transitionMessage: AIMessage = {
      role: 'system',
      content: `Conversation continued with ${newPersonality.name}`,
      timestamp: new Date().toISOString(),
      metadata: { personalitySwitch: true }
    }
    
    this.context.personality = newPersonality
    this.addMessageToHistory(transitionMessage)
  }

  exportConversation(): {
    context: ConversationContext
    summary: string
    messageCount: number
  } {
    return {
      context: { ...this.context },
      summary: this.getConversationSummary(),
      messageCount: this.context.messageHistory.length
    }
  }
}