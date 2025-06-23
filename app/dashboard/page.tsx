'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 Prophet Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your divine coding journey and ascend through the sacred ranks.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Rank</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{'Novice'}</p>
              </div>
              <div className="text-3xl">👑</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile?.total_xp?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Workshops</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.recentWorkshops.length}
                </p>
              </div>
              <div className="text-3xl">📚</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.learningStreak} days
                </p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Recent Workshops */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            📖 Recent Workshops
          </h2>
          
          {dashboardData.recentWorkshops.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentWorkshops.map((workshop) => (
                <div key={workshop.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {workshop.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last accessed: {workshop.lastAccessed} • {workshop.difficulty}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">
                      {workshop.progress}% Complete
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${workshop.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Begin your divine coding journey
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start First Workshop
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🚀 Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Continue Workshop
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Join Collaboration
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Ask AI Mentor
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏆 Recent Achievements
            </h3>
            {dashboardData.achievements.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="text-2xl">🏅</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Complete workshops to earn achievements
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 Recommendations
            </h3>
            {dashboardData.recommendations.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 border rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {rec.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rec.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Personalized recommendations will appear as you progress
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}