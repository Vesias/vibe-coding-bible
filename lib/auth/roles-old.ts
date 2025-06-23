import { Database } from '@/lib/database.types'

export type SubscriptionTier = Database['public']['Enums']['subscription_status']
export type ProphetRank = Database['public']['Enums']['prophet_rank']
export type TeamRole = Database['public']['Enums']['team_member_role']

// Biblical tier system with divine progression
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Seeker',
    description: 'Begin your divine coding journey',
    maxWorkshops: 3,
    maxCollaborationSessions: 1,
    aiInteractionsPerMonth: 10,
    certificationAccess: false,
    mentorAccess: false,
    analyticsAccess: false,
    teamFeatures: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
    color: '#6B7280',
    icon: '🌱'
  },
  basic: {
    name: 'Apostle',
    description: 'Spread the coding gospel',
    maxWorkshops: 15,
    maxCollaborationSessions: 5,
    aiInteractionsPerMonth: 100,
    certificationAccess: true,
    mentorAccess: true,
    analyticsAccess: true,
    teamFeatures: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
    color: '#3B82F6',
    icon: '✨'
  },
  pro: {
    name: 'Prophet',
    description: 'Prophecy through code mastery',
    maxWorkshops: -1, // unlimited
    maxCollaborationSessions: 20,
    aiInteractionsPerMonth: 500,
    certificationAccess: true,
    mentorAccess: true,
    analyticsAccess: true,
    teamFeatures: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
    color: '#7C3AED',
    icon: '🔮'
  },
  divine: {
    name: 'Divine',
    description: 'Transcend mortal coding limits',
    maxWorkshops: -1, // unlimited
    maxCollaborationSessions: -1, // unlimited
    aiInteractionsPerMonth: -1, // unlimited
    certificationAccess: true,
    mentorAccess: true,
    analyticsAccess: true,
    teamFeatures: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
    whiteLabel: true,
    enterpriseFeatures: true,
    dedicatedManager: true,
    color: '#F59E0B',
    icon: '👑'
  }
} as const

export const PROPHET_RANKS = {
  novice: {
    name: 'Novice Coder',
    description: 'Taking first steps in the divine path',
    minXP: 0,
    maxXP: 999,
    benefits: ['Basic workshop access', 'Community participation'],
    color: '#6B7280',
    icon: '🌱'
  },
  apprentice: {
    name: 'Code Apprentice',
    description: 'Learning the sacred patterns',
    minXP: 1000,
    maxXP: 4999,
    benefits: ['Intermediate workshops', 'Peer collaboration', 'Basic certifications'],
    color: '#3B82F6',
    icon: '📚'
  },
  practitioner: {
    name: 'Code Practitioner',
    description: 'Wielding the divine tools',
    minXP: 5000,
    maxXP: 14999,
    benefits: ['Advanced workshops', 'AI mentoring', 'NFT certifications'],
    color: '#7C3AED',
    icon: '⚡'
  },
  architect: {
    name: 'Code Architect',
    description: 'Designing divine systems',
    minXP: 15000,
    maxXP: 39999,
    benefits: ['Expert workshops', 'Mentoring others', 'Blockchain verification'],
    color: '#F59E0B',
    icon: '🏗️'
  },
  prophet: {
    name: 'Code Prophet',
    description: 'Spreading the divine coding wisdom',
    minXP: 40000,
    maxXP: -1, // unlimited
    benefits: ['Create workshops', 'Divine AI access', 'Community leadership'],
    color: '#DC2626',
    icon: '🔮'
  }
} as const

// Permission system for fine-grained access control
export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'execute'
  conditions?: Record<string, any>
}

export const PERMISSIONS = {
  // Workshop permissions
  WORKSHOP_CREATE: { resource: 'workshop', action: 'create' as const },
  WORKSHOP_READ: { resource: 'workshop', action: 'read' as const },
  WORKSHOP_UPDATE: { resource: 'workshop', action: 'update' as const },
  WORKSHOP_DELETE: { resource: 'workshop', action: 'delete' as const },
  WORKSHOP_EXECUTE: { resource: 'workshop', action: 'execute' as const },
  
  // Collaboration permissions
  COLLABORATION_CREATE: { resource: 'collaboration', action: 'create' as const },
  COLLABORATION_JOIN: { resource: 'collaboration', action: 'read' as const },
  COLLABORATION_MODERATE: { resource: 'collaboration', action: 'update' as const },
  
  // AI permissions
  AI_BASIC_CHAT: { resource: 'ai', action: 'read' as const },
  AI_CODE_REVIEW: { resource: 'ai', action: 'execute' as const },
  AI_MENTORING: { resource: 'ai', action: 'create' as const },
  
  // Certification permissions
  CERTIFICATION_VIEW: { resource: 'certification', action: 'read' as const },
  CERTIFICATION_EARN: { resource: 'certification', action: 'create' as const },
  CERTIFICATION_VERIFY: { resource: 'certification', action: 'execute' as const },
  
  // Team permissions
  TEAM_CREATE: { resource: 'team', action: 'create' as const },
  TEAM_MANAGE: { resource: 'team', action: 'update' as const },
  TEAM_DELETE: { resource: 'team', action: 'delete' as const },
  
  // Analytics permissions
  ANALYTICS_VIEW: { resource: 'analytics', action: 'read' as const },
  ANALYTICS_EXPORT: { resource: 'analytics', action: 'execute' as const },
  
  // Marketplace permissions
  MARKETPLACE_SELL: { resource: 'marketplace', action: 'create' as const },
  MARKETPLACE_BUY: { resource: 'marketplace', action: 'execute' as const },
  
  // Mentoring permissions
  MENTORING_REQUEST: { resource: 'mentoring', action: 'create' as const },
  MENTORING_PROVIDE: { resource: 'mentoring', action: 'execute' as const },
} as const

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<SubscriptionTier, Permission[]> = {
  free: [
    PERMISSIONS.WORKSHOP_READ,
    PERMISSIONS.WORKSHOP_EXECUTE,
    PERMISSIONS.AI_BASIC_CHAT,
    PERMISSIONS.COLLABORATION_JOIN,
    PERMISSIONS.MENTORING_REQUEST,
  ],
  basic: [
    ...ROLE_PERMISSIONS.free,
    PERMISSIONS.CERTIFICATION_VIEW,
    PERMISSIONS.CERTIFICATION_EARN,
    PERMISSIONS.AI_CODE_REVIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.MARKETPLACE_BUY,
  ],
  pro: [
    ...ROLE_PERMISSIONS.basic,
    PERMISSIONS.WORKSHOP_CREATE,
    PERMISSIONS.COLLABORATION_CREATE,
    PERMISSIONS.COLLABORATION_MODERATE,
    PERMISSIONS.AI_MENTORING,
    PERMISSIONS.CERTIFICATION_VERIFY,
    PERMISSIONS.TEAM_CREATE,
    PERMISSIONS.TEAM_MANAGE,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.MARKETPLACE_SELL,
    PERMISSIONS.MENTORING_PROVIDE,
  ],
  divine: [
    ...ROLE_PERMISSIONS.pro,
    PERMISSIONS.WORKSHOP_UPDATE,
    PERMISSIONS.WORKSHOP_DELETE,
    PERMISSIONS.TEAM_DELETE,
  ]
}

// Utility functions for role and permission management
export function getTierInfo(tier: SubscriptionTier) {
  return SUBSCRIPTION_TIERS[tier]
}

export function getRankInfo(rank: ProphetRank) {
  return PROPHET_RANKS[rank]
}

export function hasPermission(
  userTier: SubscriptionTier,
  permission: Permission
): boolean {
  const userPermissions = ROLE_PERMISSIONS[userTier]
  return userPermissions.some(p => 
    p.resource === permission.resource && p.action === permission.action
  )
}

export function canAccessFeature(
  userTier: SubscriptionTier,
  feature: keyof typeof SUBSCRIPTION_TIERS.free
): boolean {
  const tierInfo = SUBSCRIPTION_TIERS[userTier]
  return tierInfo[feature] === true || tierInfo[feature] === -1
}

export function getUsageLimit(
  userTier: SubscriptionTier,
  feature: keyof typeof SUBSCRIPTION_TIERS.free
): number {
  const tierInfo = SUBSCRIPTION_TIERS[userTier]
  const limit = tierInfo[feature]
  return typeof limit === 'number' ? limit : 0
}

export function calculateRankFromXP(xp: number): ProphetRank {
  if (xp >= PROPHET_RANKS.prophet.minXP) return 'prophet'
  if (xp >= PROPHET_RANKS.architect.minXP) return 'architect'
  if (xp >= PROPHET_RANKS.practitioner.minXP) return 'practitioner'
  if (xp >= PROPHET_RANKS.apprentice.minXP) return 'apprentice'
  return 'novice'
}

export function getNextRankInfo(currentRank: ProphetRank) {
  const ranks = Object.keys(PROPHET_RANKS) as ProphetRank[]
  const currentIndex = ranks.indexOf(currentRank)
  const nextRank = ranks[currentIndex + 1]
  
  if (!nextRank) return null
  
  return {
    rank: nextRank,
    info: PROPHET_RANKS[nextRank],
    xpRequired: PROPHET_RANKS[nextRank].minXP
  }
}

export function getProgressToNextRank(currentXP: number, currentRank: ProphetRank) {
  const nextRank = getNextRankInfo(currentRank)
  if (!nextRank) return { progress: 100, xpNeeded: 0 }
  
  const currentRankInfo = PROPHET_RANKS[currentRank]
  const xpInThisRank = currentXP - currentRankInfo.minXP
  const xpNeededForNextRank = nextRank.xpRequired - currentRankInfo.minXP
  const progress = Math.min(100, (xpInThisRank / xpNeededForNextRank) * 100)
  
  return {
    progress,
    xpNeeded: nextRank.xpRequired - currentXP
  }
}