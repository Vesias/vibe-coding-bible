/**
 * Advanced Authentication & Authorization System
 * 
 * Comprehensive role-based access control with subscription tiers,
 * prophet rankings, and granular permissions for the Vibe Coding Bible.
 */

// Core Types
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise'
export type ProphetRank = 'seeker' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'

export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'moderate'
}

// All available permissions
export const PERMISSIONS = {
  // Workshop permissions
  WORKSHOP_read: { resource: 'workshop', action: 'read' as const },
  WORKSHOP_CREATE: { resource: 'workshop', action: 'create' as const },
  WORKSHOP_EXECUTE: { resource: 'workshop', action: 'execute' as const },
  WORKSHOP_MODERATE: { resource: 'workshop', action: 'moderate' as const },
  
  // AI permissions
  AI_BASIC_CHAT: { resource: 'ai', action: 'read' as const },
  AI_CODE_REVIEW: { resource: 'ai', action: 'execute' as const },
  AI_MENTORING: { resource: 'ai_mentor', action: 'execute' as const },
  AI_ADVANCED: { resource: 'ai_advanced', action: 'execute' as const },
  
  // Collaboration permissions
  COLLABORATION_JOIN: { resource: 'collaboration', action: 'read' as const },
  COLLABORATION_CREATE: { resource: 'collaboration', action: 'create' as const },
  COLLABORATION_MODERATE: { resource: 'collaboration', action: 'moderate' as const },
  
  // Certification permissions
  CERTIFICATION_VIEW: { resource: 'certification', action: 'read' as const },
  CERTIFICATION_EARN: { resource: 'certification', action: 'create' as const },
  CERTIFICATION_VERIFY: { resource: 'certification', action: 'moderate' as const },
  
  // Analytics & Insights
  ANALYTICS_VIEW: { resource: 'analytics', action: 'read' as const },
  ANALYTICS_ADVANCED: { resource: 'analytics_advanced', action: 'read' as const },
  
  // Team Management
  TEAM_CREATE: { resource: 'team', action: 'create' as const },
  TEAM_MANAGE: { resource: 'team', action: 'update' as const },
  TEAM_DELETE: { resource: 'team', action: 'delete' as const },
  
  // Marketplace
  MARKETPLACE_BUY: { resource: 'marketplace', action: 'create' as const },
  MARKETPLACE_SELL: { resource: 'marketplace', action: 'update' as const },
  
  // Admin permissions
  ADMIN_USER_MANAGE: { resource: 'admin_users', action: 'moderate' as const },
  ADMIN_CONTENT_MANAGE: { resource: 'admin_content', action: 'moderate' as const },
  ADMIN_SYSTEM: { resource: 'admin_system', action: 'moderate' as const },
  
  // Mentoring
  MENTORING_REQUEST: { resource: 'mentoring', action: 'create' as const },
  MENTORING_PROVIDE: { resource: 'mentoring', action: 'execute' as const },
} as const

// Define base permission sets to avoid circular reference
const FREE_PERMISSIONS = [
  PERMISSIONS.WORKSHOP_read,
  PERMISSIONS.WORKSHOP_EXECUTE,
  PERMISSIONS.AI_BASIC_CHAT,
  PERMISSIONS.COLLABORATION_JOIN,
  PERMISSIONS.MENTORING_REQUEST,
]

const BASIC_PERMISSIONS = [
  ...FREE_PERMISSIONS,
  PERMISSIONS.CERTIFICATION_VIEW,
  PERMISSIONS.CERTIFICATION_EARN,
  PERMISSIONS.AI_CODE_REVIEW,
  PERMISSIONS.ANALYTICS_VIEW,
  PERMISSIONS.MARKETPLACE_BUY,
]

const PRO_PERMISSIONS = [
  ...BASIC_PERMISSIONS,
  PERMISSIONS.WORKSHOP_CREATE,
  PERMISSIONS.COLLABORATION_CREATE,
  PERMISSIONS.COLLABORATION_MODERATE,
  PERMISSIONS.AI_MENTORING,
  PERMISSIONS.CERTIFICATION_VERIFY,
  PERMISSIONS.TEAM_CREATE,
  PERMISSIONS.TEAM_MANAGE,
  PERMISSIONS.MARKETPLACE_SELL,
  PERMISSIONS.ANALYTICS_ADVANCED,
  PERMISSIONS.MENTORING_PROVIDE,
]

const ENTERPRISE_PERMISSIONS = [
  ...PRO_PERMISSIONS,
  PERMISSIONS.TEAM_DELETE,
  PERMISSIONS.WORKSHOP_MODERATE,
  PERMISSIONS.AI_ADVANCED,
  PERMISSIONS.ADMIN_USER_MANAGE,
  PERMISSIONS.ADMIN_CONTENT_MANAGE,
]

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<SubscriptionTier, Permission[]> = {
  free: FREE_PERMISSIONS,
  basic: BASIC_PERMISSIONS,
  pro: PRO_PERMISSIONS,
  enterprise: ENTERPRISE_PERMISSIONS,
}

// Prophet rank configuration
export const PROPHET_RANKS: Record<ProphetRank, {
  name: string
  minXP: number
  maxXP: number | null
  description: string
  benefits: string[]
  icon: string
}> = {
  seeker: {
    name: 'Divine Seeker',
    minXP: 0,
    maxXP: 999,
    description: 'Begin your journey into AI-assisted development',
    benefits: ['Access to basic workshops', 'Community access', 'Progress tracking'],
    icon: '🔍'
  },
  apprentice: {
    name: 'Code Apprentice', 
    minXP: 1000,
    maxXP: 4999,
    description: 'Learning the fundamentals of Vibe Coding',
    benefits: ['Intermediate workshops', 'AI chat assistant', 'Achievement system'],
    icon: '📚'
  },
  practitioner: {
    name: 'Sacred Practitioner',
    minXP: 5000,
    maxXP: 14999,
    description: 'Actively practicing AI-assisted development',
    benefits: ['Advanced workshops', 'Code review AI', 'Collaboration tools'],
    icon: '⚡'
  },
  architect: {
    name: 'Divine Architect',
    minXP: 15000,
    maxXP: 49999,
    description: 'Designing and building with AI mastery',
    benefits: ['Expert workshops', 'AI mentoring', 'Team management'],
    icon: '🏗️'
  },
  prophet: {
    name: 'Sacred Prophet',
    minXP: 50000,
    maxXP: null,
    description: 'Master of AI-assisted development, guiding others',
    benefits: ['All features', 'Admin privileges', 'Prophet community'],
    icon: '👑'
  }
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, {
  name: string
  price: number
  interval: 'month' | 'year'
  description: string
  features: string[]
  popular?: boolean
}> = {
  free: {
    name: 'Divine Seeker',
    price: 0,
    interval: 'month',
    description: 'Start your sacred coding journey',
    features: [
      'Access to 3 basic workshops',
      'Community forum access',
      'Progress tracking',
      'Basic AI chat (10 messages/month)'
    ]
  },
  basic: {
    name: 'Code Apostle',
    price: 19,
    interval: 'month', 
    description: 'Accelerate your learning',
    features: [
      'All free features',
      'Access to all 10 workshops',
      'AI code review (5/month)',
      'Certification eligibility',
      'Analytics dashboard'
    ],
    popular: true
  },
  pro: {
    name: 'Sacred Prophet',
    price: 49,
    interval: 'month',
    description: 'Master AI-assisted development',
    features: [
      'All basic features',
      'Unlimited AI interactions',
      'Create custom workshops',
      'Team collaboration tools',
      'Priority support',
      'Marketplace access'
    ]
  },
  enterprise: {
    name: 'Divine Collective',
    price: 199,
    interval: 'month',
    description: 'For teams and organizations',
    features: [
      'All pro features',
      'Team management',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated success manager',
      'SLA guarantee'
    ]
  }
}

// Utility functions
export function getRankFromXP(xp: number): ProphetRank {
  const ranks = Object.entries(PROPHET_RANKS) as [ProphetRank, typeof PROPHET_RANKS[ProphetRank]][]
  
  for (const [rank, config] of ranks.reverse()) {
    if (xp >= config.minXP) {
      return rank
    }
  }
  
  return 'seeker'
}

export function getNextRank(currentRank: ProphetRank): ProphetRank | null {
  const ranks: ProphetRank[] = ['seeker', 'apprentice', 'practitioner', 'architect', 'prophet']
  const currentIndex = ranks.indexOf(currentRank)
  
  if (currentIndex === -1 || currentIndex === ranks.length - 1) {
    return null
  }
  
  return ranks[currentIndex + 1]
}

export function getRankProgress(xp: number, rank: ProphetRank): number {
  const rankConfig = PROPHET_RANKS[rank]
  const nextRankConfig = getNextRank(rank) ? PROPHET_RANKS[getNextRank(rank)!] : null
  
  if (!nextRankConfig) return 100 // Max rank
  
  const currentRankXP = xp - rankConfig.minXP
  const xpNeededForNext = nextRankConfig.minXP - rankConfig.minXP
  
  return Math.min(100, (currentRankXP / xpNeededForNext) * 100)
}

export function hasPermission(
  userTier: SubscriptionTier, 
  requiredPermission: Permission
): boolean {
  const userPermissions = ROLE_PERMISSIONS[userTier] || []
  
  return userPermissions.some(
    permission => 
      permission.resource === requiredPermission.resource && 
      permission.action === requiredPermission.action
  )
}

export function getSubscriptionLimits(tier: SubscriptionTier) {
  const limits = {
    free: {
      workshops: 3,
      aiMessages: 10,
      codeReviews: 0,
      collaborations: 1,
      teamSize: 1
    },
    basic: {
      workshops: 10,
      aiMessages: 100,
      codeReviews: 5,
      collaborations: 5,
      teamSize: 1
    },
    pro: {
      workshops: -1, // unlimited
      aiMessages: -1,
      codeReviews: -1,
      collaborations: -1,
      teamSize: 10
    },
    enterprise: {
      workshops: -1,
      aiMessages: -1,
      codeReviews: -1,
      collaborations: -1,
      teamSize: -1 // unlimited
    }
  }
  
  return limits[tier]
}

// Additional utility functions for compatibility
export function getTierInfo(tier: SubscriptionTier) {
  return SUBSCRIPTION_TIERS[tier]
}

export function getRankInfo(rank: ProphetRank) {
  return PROPHET_RANKS[rank]
}

export function getNextRankInfo(rank: ProphetRank) {
  const nextRank = getNextRank(rank)
  return nextRank ? PROPHET_RANKS[nextRank] : null
}

export function getProgressToNextRank(xp: number, currentRank: ProphetRank) {
  return getRankProgress(xp, currentRank)
}

export function canAccessFeature(tier: SubscriptionTier, feature: string) {
  // Simple feature check - can be expanded
  const limits = getSubscriptionLimits(tier)
  return limits[feature as keyof typeof limits] !== 0
}

export function getUsageLimit(tier: SubscriptionTier, feature: string) {
  const limits = getSubscriptionLimits(tier)
  return limits[feature as keyof typeof limits] || 0
}

export function calculateRankFromXP(xp: number) {
  return getRankFromXP(xp)
}