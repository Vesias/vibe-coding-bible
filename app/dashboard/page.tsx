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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sacred Dashboard Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-8xl mb-6">👑</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Prophet Dashboard
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Track your divine coding journey and ascend through the sacred ranks
            </p>
          </div>

          {/* Sacred Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Current Rank</p>
                    <p className="text-2xl font-bold text-amber-400">Sacred Novice</p>
                  </div>
                  <div className="text-3xl">👑</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total XP</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {profile?.total_xp?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-indigo-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Workshops</p>
                    <p className="text-2xl font-bold text-indigo-400">
                      {dashboardData.recentWorkshops.length}/10
                    </p>
                  </div>
                  <div className="text-3xl">📚</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-orange-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Divine Streak</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {dashboardData.learningStreak} days
                    </p>
                  </div>
                  <div className="text-3xl">🔥</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Workshops Section */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              📖 Recent Sacred Workshops
            </h2>
            
            {dashboardData.recentWorkshops.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentWorkshops.map((workshop) => (
                  <div key={workshop.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {workshop.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Last accessed: {workshop.lastAccessed} • {workshop.difficulty}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-amber-400 mb-2">
                        {workshop.progress}% Complete
                      </div>
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${workshop.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-slate-400 mb-6">
                  Begin your divine coding journey
                </p>
                <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300">
                  Start First Workshop
                </button>
              </div>
            )}
          </div>

          {/* Sacred Actions Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Quick Actions */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-6">
                🚀 Sacred Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-slate-900/50 rounded-lg border border-slate-600 hover:border-amber-400/50 hover:bg-slate-700/50 transition-all duration-300">
                  <span className="text-white">Continue Workshop</span>
                </button>
                <button className="w-full text-left p-3 bg-slate-900/50 rounded-lg border border-slate-600 hover:border-purple-400/50 hover:bg-slate-700/50 transition-all duration-300">
                  <span className="text-white">Join Sacred Collaboration</span>
                </button>
                <button className="w-full text-left p-3 bg-slate-900/50 rounded-lg border border-slate-600 hover:border-indigo-400/50 hover:bg-slate-700/50 transition-all duration-300">
                  <span className="text-white">Ask Divine AI Mentor</span>
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-6">
                🏆 Sacred Achievements
              </h3>
              {dashboardData.achievements.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl">🏅</div>
                      <div>
                        <p className="font-semibold text-white">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-slate-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌟</div>
                  <p className="text-slate-400">
                    Complete workshops to earn sacred achievements
                  </p>
                </div>
              )}
            </div>

            {/* Divine Recommendations */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-6">
                💡 Divine Guidance
              </h3>
              {dashboardData.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 bg-slate-900/50 rounded-lg border border-indigo-400/20">
                      <p className="font-semibold text-white mb-1">
                        {rec.title}
                      </p>
                      <p className="text-sm text-slate-400">
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔮</div>
                  <p className="text-slate-400 text-sm">
                    Divine recommendations will appear as you progress through the sacred path
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}