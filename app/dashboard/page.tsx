'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    <main className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)'
    }}>
      {/* Sacred Dashboard Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-8xl mb-6">👑</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
              background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 50%, #FFCE00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Prophet Dashboard
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#cbd5e1' }}>
              Track your divine coding journey and ascend through the sacred ranks
            </p>
          </div>

          {/* Sacred Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, rgba(255, 206, 0, 0.2) 0%, rgba(0, 158, 224, 0.2) 100%)'
              }} />
              <div className="relative backdrop-blur-sm p-6 rounded-xl border transition-all duration-300" style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 206, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#475569'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>Current Rank</p>
                    <p className="text-2xl font-bold" style={{ color: '#FFCE00' }}>Sacred Novice</p>
                  </div>
                  <div className="text-3xl">👑</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, rgba(0, 158, 224, 0.2) 0%, rgba(0, 74, 143, 0.2) 100%)'
              }} />
              <div className="relative backdrop-blur-sm p-6 rounded-xl border transition-all duration-300" style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 158, 224, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#475569'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>Total XP</p>
                    <p className="text-2xl font-bold" style={{ color: '#009EE0' }}>
                      {profile?.total_xp?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, rgba(0, 74, 143, 0.2) 0%, rgba(0, 158, 224, 0.2) 100%)'
              }} />
              <div className="relative backdrop-blur-sm p-6 rounded-xl border transition-all duration-300" style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 74, 143, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#475569'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>Workshops</p>
                    <p className="text-2xl font-bold" style={{ color: '#004A8F' }}>
                      {dashboardData.recentWorkshops.length}/10
                    </p>
                  </div>
                  <div className="text-3xl">📚</div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 rounded-xl blur-xl group-hover:blur-lg transition-all duration-300" style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
              }} />
              <div className="relative backdrop-blur-sm p-6 rounded-xl border transition-all duration-300" style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(221, 0, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#475569'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>Divine Streak</p>
                    <p className="text-2xl font-bold" style={{ color: '#DD0000' }}>
                      {dashboardData.learningStreak} days
                    </p>
                  </div>
                  <div className="text-3xl">🔥</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress Section */}
          <div className="backdrop-blur-sm rounded-xl border p-8 mb-8" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#475569'
          }}>
            <h2 className="text-2xl font-bold mb-6" style={{
              background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              📊 Weekly Divine Progress
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#FFCE00' }}>
                  {dashboardData.weeklyProgress.workshopsCompleted}
                </div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Workshops</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#c084fc' }}>
                  {dashboardData.weeklyProgress.xpEarned}
                </div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>XP Earned</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#004A8F' }}>
                  {Math.floor(dashboardData.weeklyProgress.timeSpent / 60)}h
                </div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Time Spent</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#fb923c' }}>
                  {dashboardData.weeklyProgress.streakDays}
                </div>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Streak Days</p>
              </div>
            </div>
          </div>

          {/* Recent Workshops Section */}
          <div className="backdrop-blur-sm rounded-xl border p-8 mb-8" style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#475569'
          }}>
            <h2 className="text-2xl font-bold mb-6" style={{
              background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              📖 Recent Sacred Workshops
            </h2>
            
            {dashboardData.recentWorkshops.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentWorkshops.map((workshop) => (
                  <div key={workshop.id} className="flex items-center justify-between p-4 rounded-lg border" style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: '#475569'
                  }}>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#fff' }}>
                        {workshop.title}
                      </h3>
                      <p className="text-sm" style={{ color: '#94a3b8' }}>
                        Last accessed: {workshop.lastAccessed} • {workshop.difficulty}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold mb-2" style={{ color: '#FFCE00' }}>
                        {workshop.progress}% Complete
                      </div>
                      <div className="w-24 rounded-full h-2" style={{ background: '#374151' }}>
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${workshop.progress}%`,
                            background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌟</div>
                <p className="mb-6" style={{ color: '#94a3b8' }}>
                  Begin your divine coding journey
                </p>
                <button className="px-8 py-3 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300" style={{
                  background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)'
                }}>
                  Start First Workshop
                </button>
              </div>
            )}
          </div>

          {/* Sacred Actions Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Quick Actions */}
            <div className="backdrop-blur-sm rounded-xl border p-6" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              borderColor: '#475569'
            }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#FFCE00' }}>
                🚀 Sacred Actions
              </h3>
              <div className="space-y-3">
                <a href="/workshops" 
                  className="block w-full text-left p-3 rounded-lg border transition-all duration-300" 
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: '#475569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.5)'
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#475569'
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)'
                  }}
                >
                  <span style={{ color: '#fff' }}>📚 Continue Workshop</span>
                </a>
                <a href="/community" 
                  className="block w-full text-left p-3 rounded-lg border transition-all duration-300" 
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: '#475569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.5)'
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#475569'
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)'
                  }}
                >
                  <span style={{ color: '#fff' }}>👥 Join Sacred Community</span>
                </a>
                <a href="/ai-assistant" 
                  className="block w-full text-left p-3 rounded-lg border transition-all duration-300" 
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: '#475569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 74, 143, 0.5)'
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#475569'
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)'
                  }}
                >
                  <span style={{ color: '#fff' }}>🤖 Ask Divine AI Mentor</span>
                </a>
                <a href="/account" 
                  className="block w-full text-left p-3 rounded-lg border transition-all duration-300" 
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderColor: '#475569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(76, 29, 149, 0.5)'
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#475569'
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)'
                  }}
                >
                  <span style={{ color: '#fff' }}>⚙️ Account Settings</span>
                </a>
              </div>
            </div>

            {/* Achievements */}
            <div className="backdrop-blur-sm rounded-xl border p-6" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              borderColor: '#475569'
            }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#c084fc' }}>
                🏆 Sacred Achievements
              </h3>
              {dashboardData.achievements.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg" style={{
                      background: 'rgba(15, 23, 42, 0.5)'
                    }}>
                      <div className="text-2xl">🏅</div>
                      <div>
                        <p className="font-semibold" style={{ color: '#fff' }}>
                          {achievement.title}
                        </p>
                        <p className="text-sm" style={{ color: '#94a3b8' }}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌟</div>
                  <p style={{ color: '#94a3b8' }}>
                    Complete workshops to earn sacred achievements
                  </p>
                </div>
              )}
            </div>

            {/* Divine Recommendations */}
            <div className="backdrop-blur-sm rounded-xl border p-6" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              borderColor: '#475569'
            }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#2563eb' }}>
                💡 AgentLand Guidance
              </h3>
              {dashboardData.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-lg border" style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderColor: 'rgba(37, 99, 235, 0.2)'
                    }}>
                      <p className="font-semibold mb-1" style={{ color: '#fff' }}>
                        {rec.title}
                      </p>
                      <p className="text-sm" style={{ color: '#94a3b8' }}>
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔮</div>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>
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