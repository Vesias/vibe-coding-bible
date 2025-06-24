// Lazy-loaded components for better performance
import React from 'react'
import { withLazyLoading, withPriorityLazyLoading } from '@/lib/utils/lazy-loading'
import { 
  WorkshopLoadingFallback, 
  DashboardLoadingFallback,
  NavigationLoadingFallback,
  LazyLoadingFallback
} from '@/lib/utils/lazy-loading'

// High-priority Workshop Components (preloaded)
export const LazyInteractiveWorkshop = withPriorityLazyLoading(
  () => import('@/components/workshop/InteractiveWorkshopRefactored'),
  'high',
  <WorkshopLoadingFallback />
)

export const LazySacredWorkshopEngine = withPriorityLazyLoading(
  () => import('@/components/workshop/SacredWorkshopEngine'),
  'high',
  <WorkshopLoadingFallback />
)

// TODO: Fix other lazy-loaded components - temporarily disabled for deployment
// Navigation Components
// export const LazyDivineNavigation = withLazyLoading(
//   () => import('@/components/navigation/DivineNavigationRefactored'),
//   <NavigationLoadingFallback />
// )

// AI Components
// export const LazyEnhancedAIMentorChat = withLazyLoading(
//   () => import('@/components/ai/EnhancedAIMentorChat'),
//   <LazyLoadingFallback message="Loading AI mentor..." />
// )

// export const LazyCodeReviewPanel = withLazyLoading(
//   () => import('@/components/ai/CodeReviewPanel'),
//   <LazyLoadingFallback message="Preparing code review..." />
// )

// Dashboard Components
// export const LazyAchievementsPanel = withLazyLoading(
//   () => import('@/components/dashboard/AchievementsPanel'),
//   <LazyLoadingFallback message="Loading achievements..." />
// )

// export const LazyCollaborationHub = withLazyLoading(
//   () => import('@/components/dashboard/CollaborationHub'),
//   <LazyLoadingFallback message="Loading collaboration features..." />
// )

// export const LazyProgressVisualization = withLazyLoading(
//   () => import('@/components/dashboard/ProgressVisualization'),
//   <LazyLoadingFallback message="Generating progress charts..." />
// )

// Collaboration Components
// export const LazySessionManager = withLazyLoading(
//   () => import('@/components/collaboration/SessionManager'),
//   <LazyLoadingFallback message="Loading session manager..." />
// )

// export const LazyCollaborativeEditor = withLazyLoading(
//   () => import('@/components/collaboration/CollaborativeEditor'),
//   <LazyLoadingFallback message="Initializing collaborative editor..." />
// )

// Community Components
// export const LazyUserContentHub = withLazyLoading(
//   () => import('@/components/community/UserContentHub'),
//   <LazyLoadingFallback message="Loading community content..." />
// )

// Auth Components  
// export const LazyOnboardingFlow = withLazyLoading(
//   () => import('@/components/auth/onboarding/OnboardingFlow'),
//   <LazyLoadingFallback message="Preparing your journey..." />
// )

// Landing Page Components
// export const LazyCommandmentsPreview = withLazyLoading(
//   () => import('@/components/landing/CommandmentsPreview'),
//   <LazyLoadingFallback message="Loading sacred commandments..." />
// )

// export const LazyMysticalEffects = withLazyLoading(
//   () => import('@/components/landing/MysticalEffects'),
//   <div className="absolute inset-0" /> // Invisible fallback for effects
// )

// export const LazyPricingSection = withLazyLoading(
//   () => import('@/components/landing/PricingSection'),
//   <LazyLoadingFallback message="Loading pricing options..." />
// )

// Referrals
// export const LazyReferralDashboard = withLazyLoading(
//   () => import('@/components/referrals/ReferralDashboard'),
//   <LazyLoadingFallback message="Loading referral dashboard..." />
// )