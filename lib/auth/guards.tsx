'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthWithRoles, usePermissions } from '@/lib/auth/hooks'
import { SubscriptionTier, ProphetRank, Permission } from '@/lib/auth/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

// Basic authentication guard - requires any authenticated user
export function AuthGuard({ children, fallback, redirectTo = '/auth/login' }: AuthGuardProps) {
  const { user, loading } = useAuthWithRoles()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Tier-based guard - requires specific subscription tier or higher
interface TierGuardProps extends AuthGuardProps {
  requiredTier: SubscriptionTier
  showUpgrade?: boolean
}

export function TierGuard({ 
  children, 
  requiredTier, 
  fallback, 
  showUpgrade = true,
  redirectTo 
}: TierGuardProps) {
  const { user, tier, tierInfo, loading } = useAuthWithRoles()
  const router = useRouter()

  const tierOrder: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise']
  const hasRequiredTier = tierOrder.indexOf(tier) >= tierOrder.indexOf(requiredTier)

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  if (!hasRequiredTier) {
    if (showUpgrade) {
      return <TierUpgradePrompt currentTier={tier} requiredTier={requiredTier} />
    }
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Rank-based guard - requires specific prophet rank or higher
interface RankGuardProps extends AuthGuardProps {
  requiredRank: ProphetRank
  showProgress?: boolean
}

export function RankGuard({ 
  children, 
  requiredRank, 
  fallback, 
  showProgress = true,
  redirectTo 
}: RankGuardProps) {
  const { user, rank, rankInfo, nextRank, rankProgress, loading } = useAuthWithRoles()
  const router = useRouter()

  const rankOrder: ProphetRank[] = ['seeker', 'apprentice', 'practitioner', 'architect', 'prophet']
  const hasRequiredRank = rankOrder.indexOf(rank) >= rankOrder.indexOf(requiredRank)

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  if (!hasRequiredRank) {
    if (showProgress) {
      return <RankProgressPrompt 
        currentRank={rank} 
        requiredRank={requiredRank}
        nextRank={nextRank}
        rankProgress={rankProgress}
      />
    }
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Permission-based guard - requires specific permission
interface PermissionGuardProps extends AuthGuardProps {
  permission: Permission
  showDenied?: boolean
}

export function PermissionGuard({ 
  children, 
  permission, 
  fallback, 
  showDenied = true,
  redirectTo 
}: PermissionGuardProps) {
  const { user, loading } = useAuthWithRoles()
  const { checkPermission } = usePermissions()
  const router = useRouter()

  const hasPermission = checkPermission(permission)

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  if (!hasPermission) {
    if (showDenied) {
      return <PermissionDeniedPrompt permission={permission} />
    }
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Feature access guard - checks feature limits and access
interface FeatureGuardProps extends AuthGuardProps {
  feature: string
  showLimits?: boolean
}

export function FeatureGuard({ 
  children, 
  feature, 
  fallback, 
  showLimits = true,
  redirectTo 
}: FeatureGuardProps) {
  const { user, tier, tierInfo, usage, loading } = useAuthWithRoles()
  const router = useRouter()

  const limit = tierInfo[feature as keyof typeof tierInfo] as number | boolean
  const currentUsage = usage[feature] || 0
  const hasAccess = limit === true || limit === -1 || (typeof limit === 'number' && currentUsage < limit)

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  if (!hasAccess) {
    if (showLimits) {
      return <FeatureLimitPrompt 
        feature={feature}
        tier={tier}
        limit={limit}
        currentUsage={currentUsage}
      />
    }
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Combined guard for complex authorization
interface AdvancedGuardProps extends AuthGuardProps {
  requiredTier?: SubscriptionTier
  requiredRank?: ProphetRank
  permissions?: Permission[]
  features?: string[]
  requireAll?: boolean // If true, all conditions must be met; if false, any condition is sufficient
}

export function AdvancedGuard({
  children,
  requiredTier,
  requiredRank,
  permissions = [],
  features = [],
  requireAll = true,
  fallback,
  redirectTo
}: AdvancedGuardProps) {
  const { user, tier, rank, loading } = useAuthWithRoles()
  const { checkPermission, checkFeatureAccess } = usePermissions()
  const router = useRouter()

  const tierOrder: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise']
  const rankOrder: ProphetRank[] = ['seeker', 'apprentice', 'practitioner', 'architect', 'prophet']

  const conditions = [
    !requiredTier || tierOrder.indexOf(tier) >= tierOrder.indexOf(requiredTier),
    !requiredRank || rankOrder.indexOf(rank) >= rankOrder.indexOf(requiredRank),
    permissions.length === 0 || permissions.some(p => checkPermission(p)),
    features.length === 0 || features.some(f => checkFeatureAccess(f))
  ]

  const hasAccess = requireAll 
    ? conditions.every(condition => condition)
    : conditions.some(condition => condition)

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : (
      <AccessDeniedPrompt 
        requiredTier={requiredTier}
        requiredRank={requiredRank}
        currentTier={tier}
        currentRank={rank}
      />
    )
  }

  return <>{children}</>
}

// Prompt components for various access scenarios

function TierUpgradePrompt({ 
  currentTier, 
  requiredTier 
}: { 
  currentTier: SubscriptionTier
  requiredTier: SubscriptionTier 
}) {
  const router = useRouter()
  
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔒 Upgrade Required
          <Badge variant="outline">{requiredTier.toUpperCase()}</Badge>
        </CardTitle>
        <CardDescription>
          This feature requires a higher subscription tier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Current tier: <Badge variant="secondary">{currentTier.toUpperCase()}</Badge>
        </p>
        <p className="text-sm text-muted-foreground">
          Required tier: <Badge>{requiredTier.toUpperCase()}</Badge>
        </p>
        <Button 
          onClick={() => router.push('/pricing')}
          className="w-full"
        >
          Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
        </Button>
      </CardContent>
    </Card>
  )
}

function RankProgressPrompt({ 
  currentRank, 
  requiredRank,
  nextRank,
  rankProgress
}: { 
  currentRank: ProphetRank
  requiredRank: ProphetRank
  nextRank: any
  rankProgress: any
}) {
  const router = useRouter()
  
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Rank Up Required
          <Badge variant="outline">{requiredRank.toUpperCase()}</Badge>
        </CardTitle>
        <CardDescription>
          Continue your divine coding journey to unlock this feature
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Current rank: <Badge variant="secondary">{currentRank.toUpperCase()}</Badge>
        </p>
        <p className="text-sm text-muted-foreground">
          Required rank: <Badge>{requiredRank.toUpperCase()}</Badge>
        </p>
        {nextRank && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Progress to {nextRank.rank}: {Math.round(rankProgress.progress)}%
            </p>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${rankProgress.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {rankProgress.xpNeeded} XP needed
            </p>
          </div>
        )}
        <Button 
          onClick={() => router.push('/workshops')}
          className="w-full"
        >
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  )
}

function PermissionDeniedPrompt({ permission }: { permission: Permission }) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚫 Access Denied
        </CardTitle>
        <CardDescription>
          You don't have permission to access this feature
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Required permission: <Badge variant="outline">
            {permission.action.toUpperCase()} {permission.resource.toUpperCase()}
          </Badge>
        </p>
      </CardContent>
    </Card>
  )
}

function FeatureLimitPrompt({ 
  feature, 
  tier, 
  limit, 
  currentUsage 
}: { 
  feature: string
  tier: SubscriptionTier
  limit: number | boolean
  currentUsage: number
}) {
  const router = useRouter()
  
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Usage Limit Reached
        </CardTitle>
        <CardDescription>
          You've reached your monthly limit for this feature
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Current tier: <Badge variant="secondary">{tier.toUpperCase()}</Badge>
        </p>
        <p className="text-sm text-muted-foreground">
          Usage: {currentUsage} / {typeof limit === 'number' ? limit : '∞'}
        </p>
        <Button 
          onClick={() => router.push('/pricing')}
          className="w-full"
        >
          Upgrade for More Access
        </Button>
      </CardContent>
    </Card>
  )
}

function AccessDeniedPrompt({ 
  requiredTier,
  requiredRank,
  currentTier,
  currentRank
}: {
  requiredTier?: SubscriptionTier
  requiredRank?: ProphetRank
  currentTier: SubscriptionTier
  currentRank: ProphetRank
}) {
  const router = useRouter()
  
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔐 Access Restricted
        </CardTitle>
        <CardDescription>
          This feature has multiple access requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Current Status:</p>
          <div className="flex gap-2">
            <Badge variant="secondary">{currentTier.toUpperCase()}</Badge>
            <Badge variant="secondary">{currentRank.toUpperCase()}</Badge>
          </div>
        </div>
        
        {(requiredTier || requiredRank) && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Requirements:</p>
            <div className="flex gap-2">
              {requiredTier && <Badge>{requiredTier.toUpperCase()}</Badge>}
              {requiredRank && <Badge>{requiredRank.toUpperCase()}</Badge>}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {requiredTier && (
            <Button 
              onClick={() => router.push('/pricing')}
              size="sm"
            >
              Upgrade Tier
            </Button>
          )}
          {requiredRank && (
            <Button 
              onClick={() => router.push('/workshops')}
              variant="outline"
              size="sm"
            >
              Gain XP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}