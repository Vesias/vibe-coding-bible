'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EnhancedDashboard } from '@/components/dashboard/EnhancedDashboard'

export default function DashboardPage() {
  const {
    user,
    profile,
    loading
  } = useAuth()

  const [dashboardData, setDashboardData] = useState({
    recentWorkshops: [] as any[],
    recommendations: [] as any[],
    achievements: [] as any[],
    collaborationSessions: [] as any[],
    weeklyProgress: {} as Record<string, any>,
    learningStreak: 0
  })
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user && profile) {
      loadDashboardData()
    }
  }, [user, profile])

  const loadDashboardData = async () => {
    try {
      setDataLoading(true)
      
      // Mock data - replace with actual API calls
      setDashboardData({
        recentWorkshops: [
          {
            id: '1',
            title: 'The Holy Vision',
            progress: 85,
            lastAccessed: '2024-01-15',
            difficulty: 'Beginner'
          },
          {
            id: '2', 
            title: 'The Right Stack',
            progress: 60,
            lastAccessed: '2024-01-14',
            difficulty: 'Intermediate'
          }
        ],
        recommendations: [
          {
            id: '1',
            title: 'Master AI Prompting',
            type: 'workshop',
            reason: 'Based on your progress in Code Generation'
          }
        ],
        achievements: [
          {
            id: '1',
            title: 'First Steps',
            description: 'Completed your first workshop',
            unlockedAt: '2024-01-10',
            rarity: 'common'
          }
        ],
        collaborationSessions: [
          {
            id: '1',
            title: 'AI Development Meetup',
            participants: 8,
            status: 'active',
            startedAt: '2024-01-15T10:00:00Z'
          }
        ],
        weeklyProgress: {
          workshopsCompleted: 2,
          xpEarned: 450,
          timeSpent: 180,
          streakDays: 5
        },
        learningStreak: 5
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading your divine dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <EnhancedDashboard 
          user={user}
          profile={profile}
          tier={(profile as any)?.subscription_tier || 'free'}
          dashboardData={dashboardData}
        />
      </div>
    </main>
  )
}