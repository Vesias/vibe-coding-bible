'use client'

import { businessAnalytics, trackEvent } from './gtag'
import { analyticsConfig, businessMetrics } from './config'

// User Journey Tracking
export class UserJourneyTracker {
  private journeyStartTime: number
  private currentFunnel: string[]
  private sessionId: string

  constructor() {
    this.journeyStartTime = Date.now()
    this.currentFunnel = []
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Track funnel progression
  trackFunnelStep(step: string, metadata?: Record<string, any>) {
    this.currentFunnel.push(step)
    
    businessAnalytics.trackFunnelStep(step, {
      session_id: this.sessionId,
      funnel_position: this.currentFunnel.length,
      time_since_start: Date.now() - this.journeyStartTime,
      previous_steps: this.currentFunnel.slice(0, -1),
      ...metadata
    })

    // Track conversion rate at each step
    this.trackConversionRate(step)
  }

  // Calculate and track conversion rates
  private trackConversionRate(currentStep: string) {
    const stepIndex = businessMetrics.revenue.funnel_steps.indexOf(currentStep)
    if (stepIndex > 0) {
      const conversionRate = (stepIndex / businessMetrics.revenue.funnel_steps.length) * 100
      
      trackEvent('conversion_rate', {
        category: 'business_metrics',
        step: currentStep,
        conversion_rate: conversionRate,
        session_id: this.sessionId
      })
    }
  }

  // Get current journey status
  getJourneyStatus() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.journeyStartTime,
      steps: this.currentFunnel,
      currentStep: this.currentFunnel[this.currentFunnel.length - 1]
    }
  }
}

// Revenue Tracking
export class RevenueTracker {
  // Track subscription lifecycle
  trackSubscriptionLifecycle(event: 'trial_started' | 'trial_converted' | 'subscription_renewed' | 'subscription_cancelled' | 'churn', data: {
    userId: string
    plan: string
    amount?: number
    reason?: string
    tenure?: number // days subscribed
  }) {
    const eventData = {
      category: 'revenue',
      user_id: data.userId,
      plan: data.plan,
      value: data.amount,
      currency: 'EUR',
      tenure_days: data.tenure,
      churn_reason: data.reason,
      timestamp: new Date().toISOString()
    }

    trackEvent(event, eventData)

    // Calculate and track business metrics
    this.updateBusinessMetrics(event, data)
  }

  // Calculate Monthly Recurring Revenue (MRR)
  private updateBusinessMetrics(event: string, data: any) {
    switch (event) {
      case 'subscription_started':
      case 'trial_converted':
        this.trackMRRIncrease(data.amount, data.plan)
        break
      case 'subscription_cancelled':
        this.trackMRRDecrease(data.amount, data.plan)
        this.trackChurnRate(data.tenure)
        break
      case 'subscription_renewed':
        this.trackRetention(data.plan)
        break
    }
  }

  private trackMRRIncrease(amount: number, plan: string) {
    trackEvent('mrr_increase', {
      category: 'business_metrics',
      value: amount,
      plan,
      metric_type: 'mrr'
    })
  }

  private trackMRRDecrease(amount: number, plan: string) {
    trackEvent('mrr_decrease', {
      category: 'business_metrics',
      value: amount,
      plan,
      metric_type: 'mrr'
    })
  }

  private trackChurnRate(tenure: number) {
    trackEvent('churn_event', {
      category: 'business_metrics',
      tenure_days: tenure,
      metric_type: 'churn'
    })
  }

  private trackRetention(plan: string) {
    trackEvent('retention_event', {
      category: 'business_metrics',
      plan,
      metric_type: 'retention'
    })
  }

  // Track Customer Lifetime Value (LTV)
  trackLTV(userId: string, totalValue: number, acquisitionCost: number) {
    const ltv = totalValue - acquisitionCost
    
    trackEvent('ltv_calculation', {
      category: 'business_metrics',
      user_id: userId,
      total_revenue: totalValue,
      acquisition_cost: acquisitionCost,
      ltv_value: ltv,
      metric_type: 'ltv'
    })
  }
}

// Workshop Performance Tracking
export class WorkshopPerformanceTracker {
  // Track workshop engagement metrics
  trackWorkshopMetrics(workshopId: string, metrics: {
    startTime: number
    endTime?: number
    completionRate: number
    exercisesCompleted: number
    totalExercises: number
    hintsUsed: number
    aiMentorInteractions: number
    difficulty: 'easy' | 'medium' | 'hard'
    userRating?: number
  }) {
    const duration = metrics.endTime ? metrics.endTime - metrics.startTime : 0
    
    trackEvent('workshop_performance', {
      category: 'education_metrics',
      workshop_id: workshopId,
      duration_minutes: Math.round(duration / 60000),
      completion_rate: metrics.completionRate,
      exercises_completed: metrics.exercisesCompleted,
      total_exercises: metrics.totalExercises,
      exercise_completion_rate: (metrics.exercisesCompleted / metrics.totalExercises) * 100,
      hints_used: metrics.hintsUsed,
      ai_interactions: metrics.aiMentorInteractions,
      difficulty: metrics.difficulty,
      user_rating: metrics.userRating
    })
  }

  // Track learning path progression
  trackLearningPath(userId: string, pathId: string, progress: {
    workshopsCompleted: number
    totalWorkshops: number
    currentLevel: string
    timeSpent: number
    skillsAcquired: string[]
  }) {
    trackEvent('learning_path_progress', {
      category: 'education_metrics',
      user_id: userId,
      learning_path: pathId,
      workshops_completed: progress.workshopsCompleted,
      total_workshops: progress.totalWorkshops,
      progress_percentage: (progress.workshopsCompleted / progress.totalWorkshops) * 100,
      current_level: progress.currentLevel,
      time_spent_hours: Math.round(progress.timeSpent / 3600000),
      skills_count: progress.skillsAcquired.length
    })
  }

  // Track certification achievements
  trackCertification(userId: string, certificationType: string, workshopsCompleted: string[]) {
    trackEvent('certification_earned', {
      category: 'achievement',
      user_id: userId,
      certification_type: certificationType,
      workshops_count: workshopsCompleted.length,
      workshops_list: workshopsCompleted.join(',')
    })
  }
}

// User Engagement Tracking
export class UserEngagementTracker {
  private sessionStart: number
  private pageViews: number
  private interactions: number

  constructor() {
    this.sessionStart = Date.now()
    this.pageViews = 0
    this.interactions = 0
  }

  // Track page engagement
  trackPageEngagement(page: string, timeSpent: number, interactions: number) {
    this.pageViews++
    this.interactions += interactions

    trackEvent('page_engagement', {
      category: 'engagement',
      page,
      time_spent_seconds: Math.round(timeSpent / 1000),
      interactions_count: interactions,
      session_page_views: this.pageViews,
      session_total_interactions: this.interactions
    })
  }

  // Track social sharing
  trackSocialShare(platform: string, contentType: string, contentId: string) {
    trackEvent('social_share', {
      category: 'viral_growth',
      platform,
      content_type: contentType,
      content_id: contentId,
      timestamp: new Date().toISOString()
    })
  }

  // Track referral usage
  trackReferralConversion(referralCode: string, referrerUserId: string, newUserId: string) {
    // Track for referrer
    trackEvent('referral_successful', {
      category: 'growth',
      referral_code: referralCode,
      referrer_user_id: referrerUserId,
      new_user_id: newUserId,
      type: 'referrer_reward'
    })

    // Track for new user
    trackEvent('referred_signup', {
      category: 'acquisition',
      referral_code: referralCode,
      referrer_user_id: referrerUserId,
      new_user_id: newUserId,
      type: 'new_user_acquisition'
    })
  }

  // Calculate engagement score
  calculateEngagementScore(userId: string, sessionData: {
    duration: number
    pageViews: number
    interactions: number
    workshopsStarted: number
    exercisesCompleted: number
    aiInteractions: number
  }) {
    // Weighted engagement score algorithm
    const weights = {
      duration: 0.1,
      pageViews: 0.1,
      interactions: 0.2,
      workshopsStarted: 0.3,
      exercisesCompleted: 0.2,
      aiInteractions: 0.1
    }

    const score = (
      sessionData.duration * weights.duration +
      sessionData.pageViews * weights.pageViews +
      sessionData.interactions * weights.interactions +
      sessionData.workshopsStarted * weights.workshopsStarted +
      sessionData.exercisesCompleted * weights.exercisesCompleted +
      sessionData.aiInteractions * weights.aiInteractions
    )

    trackEvent('engagement_score', {
      category: 'user_analytics',
      user_id: userId,
      engagement_score: Math.round(score),
      session_duration: sessionData.duration,
      session_interactions: sessionData.interactions
    })

    return score
  }
}

// A/B Testing and Experimentation
export class ExperimentTracker {
  // Track A/B test participation
  trackExperiment(experimentId: string, variant: string, userId: string) {
    trackEvent('experiment_participation', {
      category: 'experiments',
      experiment_id: experimentId,
      variant,
      user_id: userId,
      timestamp: new Date().toISOString()
    })
  }

  // Track experiment conversion
  trackExperimentConversion(experimentId: string, variant: string, userId: string, goalReached: string) {
    trackEvent('experiment_conversion', {
      category: 'experiments',
      experiment_id: experimentId,
      variant,
      user_id: userId,
      goal: goalReached,
      timestamp: new Date().toISOString()
    })
  }
}

// Global instances for easy access
export const userJourneyTracker = typeof window !== 'undefined' ? new UserJourneyTracker() : null
export const revenueTracker = new RevenueTracker()
export const workshopTracker = new WorkshopPerformanceTracker()
export const engagementTracker = typeof window !== 'undefined' ? new UserEngagementTracker() : null
export const experimentTracker = new ExperimentTracker()

// Helper function to initialize all tracking
export function initializeBusinessTracking() {
  if (typeof window === 'undefined') return

  // Track initial page load as funnel start
  userJourneyTracker?.trackFunnelStep('landing_page_view')

  // Set up automatic engagement tracking
  let pageStartTime = Date.now()
  let interactionCount = 0

  // Track clicks and interactions
  document.addEventListener('click', () => {
    interactionCount++
  })

  // Track when user leaves page
  window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - pageStartTime
    engagementTracker?.trackPageEngagement(window.location.pathname, timeSpent, interactionCount)
  })

  // Track scroll depth for engagement
  let maxScrollDepth = 0
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
      
      // Track scroll milestones
      if ([25, 50, 75, 100].includes(scrollDepth)) {
        trackEvent('scroll_depth', {
          category: 'engagement',
          scroll_depth: scrollDepth,
          page: window.location.pathname
        })
      }
    }
  })
}