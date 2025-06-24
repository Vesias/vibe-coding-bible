/**
 * Subscription-based access control for workshops and premium features
 */

import { createClient } from '@/lib/supabase/server'

export interface SubscriptionTier {
  id: string
  name: string
  level: number
  features: string[]
  commandmentAccess: number[]
  aiInteractionLimit: number
  teamFeatures: boolean
  prioritySupport: boolean
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    id: 'free',
    name: 'Seeker',
    level: 0,
    features: ['basic_content', 'community_read'],
    commandmentAccess: [1, 2], // First 2 commandments
    aiInteractionLimit: 10, // 10 AI interactions per month
    teamFeatures: false,
    prioritySupport: false
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    level: 1,
    features: ['basic_content', 'community_full', 'workshops', 'challenges', 'progress_tracking'],
    commandmentAccess: [1, 2, 3, 4, 5], // First 5 commandments
    aiInteractionLimit: 100, // 100 AI interactions per month
    teamFeatures: false,
    prioritySupport: false
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    level: 2,
    features: [
      'basic_content', 'community_full', 'workshops', 'challenges', 
      'progress_tracking', 'collaboration', 'mentoring', 'certificates'
    ],
    commandmentAccess: [1, 2, 3, 4, 5, 6, 7, 8], // First 8 commandments
    aiInteractionLimit: 500, // 500 AI interactions per month
    teamFeatures: true,
    prioritySupport: true
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    level: 3,
    features: [
      'basic_content', 'community_full', 'workshops', 'challenges',
      'progress_tracking', 'collaboration', 'mentoring', 'certificates',
      'vip_support', 'revenue_sharing', 'white_label', 'api_access'
    ],
    commandmentAccess: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // All commandments
    aiInteractionLimit: -1, // Unlimited AI interactions
    teamFeatures: true,
    prioritySupport: true
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime',
    level: 4,
    features: [
      'basic_content', 'community_full', 'workshops', 'challenges',
      'progress_tracking', 'collaboration', 'mentoring', 'certificates',
      'vip_support', 'revenue_sharing', 'white_label', 'api_access',
      'lifetime_updates', 'exclusive_content'
    ],
    commandmentAccess: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // All commandments
    aiInteractionLimit: -1, // Unlimited AI interactions
    teamFeatures: true,
    prioritySupport: true
  }
}

export class SubscriptionGuard {
  private supabase: any

  constructor() {
    this.supabase = null
  }

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Get user's current subscription tier
   */
  async getUserSubscriptionTier(userId: string): Promise<SubscriptionTier> {
    const supabase = await this.getSupabase()

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_expires_at')
        .eq('id', userId)
        .single()

      if (!profile) {
        return SUBSCRIPTION_TIERS.free
      }

      // Check if subscription is expired
      if (profile.subscription_expires_at) {
        const expiresAt = new Date(profile.subscription_expires_at)
        if (expiresAt < new Date()) {
          return SUBSCRIPTION_TIERS.free
        }
      }

      const tierKey = profile.subscription_status || 'free'
      return SUBSCRIPTION_TIERS[tierKey] || SUBSCRIPTION_TIERS.free
    } catch (error) {
      console.error('Error getting user subscription tier:', error)
      return SUBSCRIPTION_TIERS.free
    }
  }

  /**
   * Check if user has access to a specific commandment
   */
  async hasCommandmentAccess(userId: string, commandmentId: number): Promise<boolean> {
    const tier = await this.getUserSubscriptionTier(userId)
    return tier.commandmentAccess.includes(commandmentId)
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
    const tier = await this.getUserSubscriptionTier(userId)
    return tier.features.includes(feature)
  }

  /**
   * Check AI interaction limits
   */
  async checkAIInteractionLimit(userId: string): Promise<{
    hasAccess: boolean
    remaining: number
    limit: number
    tier: string
  }> {
    const tier = await this.getUserSubscriptionTier(userId)
    
    if (tier.aiInteractionLimit === -1) {
      return {
        hasAccess: true,
        remaining: -1,
        limit: -1,
        tier: tier.id
      }
    }

    const supabase = await this.getSupabase()

    // Get current month's usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: usage } = await supabase
      .from('ai_usage_tracking')
      .select('total_interactions')
      .eq('user_id', userId)
      .eq('period_type', 'monthly')
      .gte('period_start', startOfMonth.toISOString().split('T')[0])
      .maybeSingle()

    const currentUsage = usage?.total_interactions || 0
    const remaining = Math.max(0, tier.aiInteractionLimit - currentUsage)

    return {
      hasAccess: remaining > 0,
      remaining,
      limit: tier.aiInteractionLimit,
      tier: tier.id
    }
  }

  /**
   * Get upgrade suggestions for user
   */
  async getUpgradeSuggestions(userId: string, requestedFeature?: string): Promise<{
    currentTier: SubscriptionTier
    suggestedTiers: SubscriptionTier[]
    reason: string
  }> {
    const currentTier = await this.getUserSubscriptionTier(userId)
    
    let suggestedTiers: SubscriptionTier[] = []
    let reason = ''

    if (requestedFeature) {
      // Find tiers that have the requested feature
      suggestedTiers = Object.values(SUBSCRIPTION_TIERS)
        .filter(tier => tier.level > currentTier.level && tier.features.includes(requestedFeature))
        .sort((a, b) => a.level - b.level)
      
      reason = `To access ${requestedFeature}, you need to upgrade your subscription.`
    } else {
      // General upgrade suggestions
      suggestedTiers = Object.values(SUBSCRIPTION_TIERS)
        .filter(tier => tier.level > currentTier.level)
        .sort((a, b) => a.level - b.level)
      
      reason = 'Upgrade to unlock more features and content.'
    }

    return {
      currentTier,
      suggestedTiers,
      reason
    }
  }

  /**
   * Log feature access attempt for analytics
   */
  async logFeatureAccess(userId: string, feature: string, granted: boolean) {
    const supabase = await this.getSupabase()

    try {
      await supabase
        .from('feature_access_logs')
        .insert({
          user_id: userId,
          feature,
          access_granted: granted,
          timestamp: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging feature access:', error)
    }
  }

  /**
   * Check if user can upgrade to a specific tier
   */
  async canUpgradeTo(userId: string, targetTier: string): Promise<{
    canUpgrade: boolean
    reason?: string
    requiredAction?: string
  }> {
    const currentTier = await this.getUserSubscriptionTier(userId)
    const targetTierInfo = SUBSCRIPTION_TIERS[targetTier]

    if (!targetTierInfo) {
      return {
        canUpgrade: false,
        reason: 'Invalid target tier'
      }
    }

    if (targetTierInfo.level <= currentTier.level) {
      return {
        canUpgrade: false,
        reason: 'Cannot downgrade or upgrade to same tier'
      }
    }

    const supabase = await this.getSupabase()

    // Check if user has any payment issues
    const { data: failedPayments } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'failed')
      .gte('payment_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (failedPayments && failedPayments.length > 0) {
      return {
        canUpgrade: false,
        reason: 'Recent failed payments detected',
        requiredAction: 'Please resolve payment issues before upgrading'
      }
    }

    return {
      canUpgrade: true
    }
  }

  /**
   * Get feature comparison between tiers
   */
  getFeatureComparison(): Record<string, Record<string, boolean>> {
    const features = [
      'basic_content',
      'community_full',
      'workshops',
      'challenges',
      'progress_tracking',
      'collaboration',
      'mentoring',
      'certificates',
      'vip_support',
      'revenue_sharing',
      'white_label',
      'api_access',
      'lifetime_updates',
      'exclusive_content'
    ]

    const comparison: Record<string, Record<string, boolean>> = {}

    features.forEach(feature => {
      comparison[feature] = {}
      Object.entries(SUBSCRIPTION_TIERS).forEach(([tierKey, tier]) => {
        comparison[feature][tierKey] = tier.features.includes(feature)
      })
    })

    return comparison
  }
}

export const subscriptionGuard = new SubscriptionGuard()

/**
 * Middleware function for protecting routes based on subscription
 */
export async function requireSubscription(
  userId: string, 
  requiredTier: string
): Promise<{
  hasAccess: boolean
  userTier: SubscriptionTier
  requiredTier: SubscriptionTier
  upgrade?: SubscriptionTier[]
}> {
  const userTier = await subscriptionGuard.getUserSubscriptionTier(userId)
  const requiredTierInfo = SUBSCRIPTION_TIERS[requiredTier]

  const hasAccess = userTier.level >= requiredTierInfo.level

  let upgrade: SubscriptionTier[] = []
  if (!hasAccess) {
    upgrade = Object.values(SUBSCRIPTION_TIERS)
      .filter(tier => tier.level >= requiredTierInfo.level)
      .sort((a, b) => a.level - b.level)
  }

  return {
    hasAccess,
    userTier,
    requiredTier: requiredTierInfo,
    upgrade: upgrade.length > 0 ? upgrade : undefined
  }
}

/**
 * React hook for subscription checking (for client-side)
 */
export function getSubscriptionStatus(tier: string) {
  const tierInfo = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free
  
  return {
    tier: tierInfo,
    canAccess: (feature: string) => tierInfo.features.includes(feature),
    canAccessCommandment: (id: number) => tierInfo.commandmentAccess.includes(id),
    hasUnlimitedAI: tierInfo.aiInteractionLimit === -1,
    aiLimit: tierInfo.aiInteractionLimit
  }
}