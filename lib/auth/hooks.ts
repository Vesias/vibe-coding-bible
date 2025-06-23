import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { 
  SubscriptionTier, 
  ProphetRank, 
  Permission,
  hasPermission,
  canAccessFeature,
  getUsageLimit,
  getTierInfo,
  getRankInfo,
  getNextRankInfo,
  getProgressToNextRank,
  calculateRankFromXP
} from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/client'

// Enhanced authentication hook with role-based features
export function useAuthWithRoles() {
  const auth = useAuth()
  const [usage, setUsage] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  const tier = auth.profile?.subscription_status as SubscriptionTier || 'free'
  const rank = auth.profile?.prophet_rank as ProphetRank || 'novice'
  const xp = auth.profile?.total_xp || 0

  const tierInfo = useMemo(() => getTierInfo(tier), [tier])
  const rankInfo = useMemo(() => getRankInfo(rank), [rank])
  const nextRank = useMemo(() => getNextRankInfo(rank), [rank])
  const rankProgress = useMemo(() => getProgressToNextRank(xp, rank), [xp, rank])

  // Fetch user usage statistics
  const fetchUsage = async () => {
    if (!auth.user) return

    setLoading(true)
    const supabase = createClient()
    
    try {
      // Get current month usage
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const [
        { count: workshopsCompleted },
        { count: aiInteractions },
        { count: collaborationSessions }
      ] = await Promise.all([
        supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', auth.user.id)
          .eq('status', 'completed')
          .gte('completed_at', startOfMonth.toISOString()),
        
        supabase
          .from('ai_interactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', auth.user.id)
          .gte('created_at', startOfMonth.toISOString()),
        
        supabase
          .from('collaboration_participants')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', auth.user.id)
          .gte('joined_at', startOfMonth.toISOString())
      ])

      setUsage({
        workshopsCompleted: workshopsCompleted || 0,
        aiInteractions: aiInteractions || 0,
        collaborationSessions: collaborationSessions || 0
      })
    } catch (error) {
      console.error('Error fetching usage:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth.user) {
      fetchUsage()
    }
  }, [auth.user])

  return {
    ...auth,
    tier,
    tierInfo,
    rank,
    rankInfo,
    nextRank,
    rankProgress,
    xp,
    usage,
    loading: auth.loading || loading,
    refreshUsage: fetchUsage
  }
}

// Permission checking hook
export function usePermissions() {
  const { tier } = useAuthWithRoles()

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(tier, permission)
  }

  const checkFeatureAccess = (feature: string): boolean => {
    return canAccessFeature(tier, feature as any)
  }

  const getFeatureLimit = (feature: string): number => {
    return getUsageLimit(tier, feature as any)
  }

  return {
    checkPermission,
    checkFeatureAccess,
    getFeatureLimit,
    tier
  }
}

// Feature access hook with usage tracking
export function useFeatureAccess(feature: string) {
  const { tier, tierInfo, usage } = useAuthWithRoles()
  const { checkFeatureAccess, getFeatureLimit } = usePermissions()

  const hasAccess = checkFeatureAccess(feature)
  const limit = getFeatureLimit(feature)
  const currentUsage = usage[feature] || 0
  const remaining = limit === -1 ? -1 : Math.max(0, limit - currentUsage)
  const isAtLimit = limit !== -1 && currentUsage >= limit

  return {
    hasAccess,
    limit,
    currentUsage,
    remaining,
    isAtLimit,
    tierInfo
  }
}

// Workshop access hook
export function useWorkshopAccess() {
  const { tier, usage, tierInfo } = useAuthWithRoles()
  const workshopAccess = useFeatureAccess('maxWorkshops')

  const canAccessWorkshop = (workshopId: string, requiresPro = false): boolean => {
    if (requiresPro && (tier === 'free' || tier === 'basic')) {
      return false
    }
    return workshopAccess.hasAccess && !workshopAccess.isAtLimit
  }

  return {
    ...workshopAccess,
    canAccessWorkshop,
    tier,
    tierInfo
  }
}

// AI features access hook
export function useAIAccess() {
  const { tier, tierInfo } = useAuthWithRoles()
  const aiAccess = useFeatureAccess('aiInteractionsPerMonth')

  const canUseAI = (interactionType: 'basic' | 'advanced' | 'mentoring'): boolean => {
    if (interactionType === 'mentoring' && (tier === 'free' || tier === 'basic')) {
      return false
    }
    if (interactionType === 'advanced' && tier === 'free') {
      return false
    }
    return aiAccess.hasAccess && !aiAccess.isAtLimit
  }

  return {
    ...aiAccess,
    canUseAI,
    tier,
    tierInfo
  }
}

// Collaboration access hook
export function useCollaborationAccess() {
  const { tier, tierInfo } = useAuthWithRoles()
  const collaborationAccess = useFeatureAccess('maxCollaborationSessions')

  const canCreateSession = (): boolean => {
    return tier !== 'free' && collaborationAccess.hasAccess && !collaborationAccess.isAtLimit
  }

  const canJoinSession = (): boolean => {
    return collaborationAccess.hasAccess
  }

  return {
    ...collaborationAccess,
    canCreateSession,
    canJoinSession,
    tier,
    tierInfo
  }
}

// Certification access hook
export function useCertificationAccess() {
  const { tier, tierInfo } = useAuthWithRoles()

  const canEarnCertifications = (): boolean => {
    return tier !== "free"
  }

  const canCreateNFTCertificates = (): boolean => {
    return tier === 'pro' || tier === 'enterprise'
  }

  const canVerifyOnBlockchain = (): boolean => {
    return tier === 'pro' || tier === 'enterprise'
  }

  return {
    canEarnCertifications,
    canCreateNFTCertificates,
    canVerifyOnBlockchain,
    tier,
    tierInfo
  }
}

// Team features access hook
export function useTeamAccess() {
  const { tier, tierInfo } = useAuthWithRoles()

  const canCreateTeam = (): boolean => {
    return tier === "pro" || tier === "enterprise"
  }

  const canManageTeam = (): boolean => {
    return tier === "pro" || tier === "enterprise"
  }

  const canUseCustomBranding = (): boolean => {
    return tier === "enterprise"
  }

  return {
    canCreateTeam,
    canManageTeam,
    canUseCustomBranding,
    tier,
    tierInfo
  }
}

// Mentoring access hook
export function useMentoringAccess() {
  const { tier, tierInfo, rank, rankInfo } = useAuthWithRoles()

  const canRequestMentoring = (): boolean => {
    return tier !== "free"
  }

  const canProvideMentoring = (): boolean => {
    return (tier === 'pro' || tier === 'enterprise') && 
           (rank === 'architect' || rank === 'prophet')
  }

  const canScheduleSessions = (): boolean => {
    return tier !== "free"
  }

  return {
    canRequestMentoring,
    canProvideMentoring,
    canScheduleSessions,
    tier,
    tierInfo,
    rank,
    rankInfo
  }
}

// Analytics access hook
export function useAnalyticsAccess() {
  const { tier, tierInfo } = useAuthWithRoles()

  const canViewAnalytics = (): boolean => {
    return tier !== "free"
  }

  const canExportData = (): boolean => {
    return tier === 'pro' || tier === 'enterprise'
  }

  const canViewAdvancedMetrics = (): boolean => {
    return tier === 'enterprise'
  }

  return {
    canViewAnalytics,
    canExportData,
    canViewAdvancedMetrics,
    tier,
    tierInfo
  }
}

// XP and progression hook
export function useXPProgression() {
  const { user, xp, rank, rankInfo, nextRank, rankProgress } = useAuthWithRoles()
  const [recentXPGains, setRecentXPGains] = useState<Array<{
    amount: number
    source: string
    timestamp: string
  }>>([])

  const addXP = async (amount: number, source: string) => {
    if (!user) return

    const supabase = createClient()
    
    try {
      // Update user XP
      const newXP = xp + amount
      const newRank = calculateRankFromXP(newXP)
      
      await supabase
        .from('users')
        .update({ 
          total_xp: newXP,
          current_level: Math.floor(newXP / 100) + 1,
          prophet_rank: newRank
        })
        .eq('id', user.id)

      // Add to recent gains
      setRecentXPGains(prev => [
        { amount, source, timestamp: new Date().toISOString() },
        ...prev.slice(0, 9) // Keep last 10 gains
      ])

      return { newXP, newRank, leveledUp: newRank !== rank }
    } catch (error) {
      console.error('Error adding XP:', error)
      throw error
    }
  }

  return {
    xp,
    rank,
    rankInfo,
    nextRank,
    rankProgress,
    recentXPGains,
    addXP
  }
}

// Combined authorization hook for complex permission checks
export function useAdvancedAuth() {
  const auth = useAuthWithRoles()
  const permissions = usePermissions()
  const workshopAccess = useWorkshopAccess()
  const aiAccess = useAIAccess()
  const collaborationAccess = useCollaborationAccess()
  const certificationAccess = useCertificationAccess()
  const teamAccess = useTeamAccess()
  const mentoringAccess = useMentoringAccess()
  const analyticsAccess = useAnalyticsAccess()
  const xpProgression = useXPProgression()

  return {
    ...auth,
    permissions,
    workshopAccess,
    aiAccess,
    collaborationAccess,
    certificationAccess,
    teamAccess,
    mentoringAccess,
    analyticsAccess,
    xpProgression
  }
}