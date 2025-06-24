import { LearningRecommendation } from './types'

export class LearningRecommendationService {
  private userSkills: string[] = []
  private userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  private completedWorkshops: string[] = []

  constructor(userLevel?: 'beginner' | 'intermediate' | 'advanced') {
    if (userLevel) {
      this.userLevel = userLevel
    }
  }

  async getPersonalizedRecommendations(
    userGoals: string[],
    recentActivity: string[] = [],
    completedWorkshops: string[] = []
  ): Promise<LearningRecommendation[]> {
    this.completedWorkshops = completedWorkshops
    
    const recommendations: LearningRecommendation[] = []
    
    // Add foundational recommendations
    recommendations.push(...this.getFoundationalRecommendations())
    
    // Add goal-based recommendations
    for (const goal of userGoals) {
      recommendations.push(...this.getGoalBasedRecommendations(goal))
    }
    
    // Add activity-based recommendations
    recommendations.push(...this.getActivityBasedRecommendations(recentActivity))
    
    // Filter and rank recommendations
    return this.rankAndFilterRecommendations(recommendations)
  }

  private getFoundationalRecommendations(): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = []
    
    if (this.userLevel === 'beginner') {
      recommendations.push({
        id: 'foundation-vision',
        title: 'The Holy Vision - Product Conceptualization',
        description: 'Learn to create clear product visions before coding',
        type: 'workshop',
        difficulty: 'beginner',
        estimatedTime: 45,
        xpReward: 150,
        relatedSkills: ['product-vision', 'planning', 'ai-assisted-development'],
        personalizedReason: 'Essential foundation for all AI-assisted development projects'
      })
      
      recommendations.push({
        id: 'foundation-stack',
        title: 'The Right Stack - Technology Selection',
        description: 'Master AI-guided technology selection and setup',
        type: 'workshop',
        difficulty: 'beginner',
        estimatedTime: 60,
        xpReward: 200,
        relatedSkills: ['technology-selection', 'setup', 'decision-making'],
        personalizedReason: 'Critical for making smart technology choices with AI assistance'
      })
    }
    
    return recommendations
  }

  private getGoalBasedRecommendations(goal: string): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = []
    
    const goalMappings: Record<string, LearningRecommendation[]> = {
      'web-development': [
        {
          id: 'web-dev-fundamentals',
          title: 'Modern Web Development with AI',
          description: 'Build full-stack web applications using AI-assisted development',
          type: 'workshop',
          difficulty: 'intermediate',
          estimatedTime: 120,
          xpReward: 300,
          relatedSkills: ['react', 'next.js', 'ai-assistance'],
          personalizedReason: 'Directly aligned with your web development goals'
        }
      ],
      'ai-integration': [
        {
          id: 'ai-integration-mastery',
          title: 'AI Integration Patterns',
          description: 'Learn to effectively integrate AI into your applications',
          type: 'workshop',
          difficulty: 'advanced',
          estimatedTime: 90,
          xpReward: 400,
          relatedSkills: ['ai-apis', 'prompt-engineering', 'integration'],
          personalizedReason: 'Perfect for advancing your AI integration skills'
        }
      ],
      'debugging': [
        {
          id: 'divine-debugging',
          title: 'Divine Debugging - AI-Assisted Problem Solving',
          description: 'Master debugging with AI assistance and systematic approaches',
          type: 'workshop',
          difficulty: 'intermediate',
          estimatedTime: 75,
          xpReward: 250,
          relatedSkills: ['debugging', 'problem-solving', 'ai-assistance'],
          personalizedReason: 'Essential for improving your debugging workflow'
        }
      ]
    }
    
    return goalMappings[goal] || []
  }

  private getActivityBasedRecommendations(recentActivity: string[]): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = []
    
    // Analyze recent activity patterns
    const hasJavaScript = recentActivity.some(activity => 
      activity.toLowerCase().includes('javascript') || activity.toLowerCase().includes('js')
    )
    
    const hasReact = recentActivity.some(activity => 
      activity.toLowerCase().includes('react')
    )
    
    const hasDebuggging = recentActivity.some(activity => 
      activity.toLowerCase().includes('debug') || activity.toLowerCase().includes('error')
    )
    
    if (hasJavaScript && !hasReact) {
      recommendations.push({
        id: 'react-next-steps',
        title: 'React Fundamentals for JavaScript Developers',
        description: 'Take your JavaScript skills to the next level with React',
        type: 'workshop',
        difficulty: 'intermediate',
        estimatedTime: 90,
        xpReward: 300,
        relatedSkills: ['react', 'components', 'state-management'],
        personalizedReason: 'Natural progression from your JavaScript work'
      })
    }
    
    if (hasDebuggging) {
      recommendations.push({
        id: 'advanced-debugging',
        title: 'Advanced Debugging Techniques',
        description: 'Master complex debugging scenarios with AI assistance',
        type: 'exercise',
        difficulty: 'advanced',
        estimatedTime: 60,
        xpReward: 200,
        relatedSkills: ['debugging', 'tools', 'systematic-thinking'],
        personalizedReason: 'Based on your recent debugging activities'
      })
    }
    
    return recommendations
  }

  private rankAndFilterRecommendations(recommendations: LearningRecommendation[]): LearningRecommendation[] {
    // Remove duplicates
    const uniqueRecommendations = recommendations.filter((rec, index, self) => 
      index === self.findIndex(r => r.id === rec.id)
    )
    
    // Filter out completed workshops
    const availableRecommendations = uniqueRecommendations.filter(rec => 
      !this.completedWorkshops.includes(rec.id)
    )
    
    // Sort by relevance (difficulty match, estimated time, XP reward)
    return availableRecommendations.sort((a, b) => {
      // Prioritize appropriate difficulty level
      const aDifficultyMatch = this.getDifficultyScore(a.difficulty)
      const bDifficultyMatch = this.getDifficultyScore(b.difficulty)
      
      if (aDifficultyMatch !== bDifficultyMatch) {
        return bDifficultyMatch - aDifficultyMatch
      }
      
      // Then by XP reward (higher is better)
      return b.xpReward - a.xpReward
    }).slice(0, 6) // Return top 6 recommendations
  }

  private getDifficultyScore(difficulty: string): number {
    const userLevelScore = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    }
    
    const difficultyScore = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    }
    
    const userScore = userLevelScore[this.userLevel]
    const contentScore = difficultyScore[difficulty as keyof typeof difficultyScore]
    
    // Perfect match gets highest score
    if (userScore === contentScore) return 10
    
    // One level difference gets medium score
    if (Math.abs(userScore - contentScore) === 1) return 5
    
    // Larger differences get lower scores
    return 1
  }

  async getSkillGapAnalysis(targetSkills: string[]): Promise<{
    gaps: string[]
    recommendations: LearningRecommendation[]
  }> {
    const gaps = targetSkills.filter(skill => !this.userSkills.includes(skill))
    
    const recommendations = gaps.map(skill => ({
      id: `skill-${skill}`,
      title: `Master ${skill}`,
      description: `Comprehensive learning path for ${skill}`,
      type: 'workshop' as const,
      difficulty: this.userLevel,
      estimatedTime: 90,
      xpReward: 250,
      relatedSkills: [skill],
      personalizedReason: `Fill the gap in your ${skill} knowledge`
    }))
    
    return { gaps, recommendations }
  }
}