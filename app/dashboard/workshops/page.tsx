'use client'

import React from 'react'
import SacredProgressTracker from '@/components/workshop/SacredProgressTracker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  BookOpen, 
  Trophy, 
  Star, 
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Crown,
  ChevronRight
} from 'lucide-react'

export default function WorkshopsDashboard() {
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)'
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 50%, #FFCE00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Deine Sacred Journey
          </h1>
          <p className="text-xl" style={{ color: '#cbd5e1' }}>
            Verfolge deinen Fortschritt durch die 10 heiligen Gebote
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-2xl font-bold" style={{ color: '#FFCE00' }}>7</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Lessons Completed</div>
            </CardContent>
          </Card>
          
          <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-2xl font-bold" style={{ color: '#009EE0' }}>3</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Exercises Done</div>
            </CardContent>
          </Card>
          
          <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>450</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>XP Earned</div>
            </CardContent>
          </Card>
          
          <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>5</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Progress Tracker */}
        <SacredProgressTracker />

        {/* Quick Actions */}
        <Card className="mt-8" style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
              <Zap className="w-5 h-5" />
              Continue Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Continue Current Workshop */}
              <Card className="cursor-pointer transition-all duration-300 hover:scale-105" style={{ 
                background: 'rgba(15, 23, 42, 0.8)', 
                borderColor: '#FFCE00' 
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">👁️</div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#FFCE00' }}>
                        In Progress
                      </div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>
                        Die Heilige Vision
                      </div>
                    </div>
                  </div>
                  <Link href="/workshops/i">
                    <Button size="sm" className="w-full" style={{ 
                      background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' 
                    }}>
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Fortfahren
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Next Recommended */}
              <Card className="cursor-pointer transition-all duration-300 hover:scale-105" style={{ 
                background: 'rgba(15, 23, 42, 0.8)', 
                borderColor: '#009EE0' 
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🏗️</div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#009EE0' }}>
                        Recommended Next
                      </div>
                      <div className="text-xs" style={{ color: '#cbd5e1' }}>
                        Der Rechte Stack
                      </div>
                    </div>
                  </div>
                  <Link href="/workshops/ii">
                    <Button size="sm" variant="outline" className="w-full" style={{ 
                      borderColor: '#009EE0',
                      color: '#009EE0'
                    }}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Beginnen
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* All Workshops */}
              <Card className="cursor-pointer transition-all duration-300 hover:scale-105" style={{ 
                background: 'rgba(15, 23, 42, 0.8)', 
                borderColor: '#475569' 
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">📚</div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#cbd5e1' }}>
                        Browse All
                      </div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>
                        10 Sacred Commandments
                      </div>
                    </div>
                  </div>
                  <Link href="/workshops">
                    <Button size="sm" variant="outline" className="w-full" style={{ 
                      borderColor: '#475569',
                      color: '#cbd5e1'
                    }}>
                      <Target className="w-4 h-4 mr-2" />
                      Alle Ansehen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
                <TrendingUp className="w-5 h-5" />
                Learning Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ color: '#cbd5e1' }}>This Week</span>
                <Badge style={{ background: '#22c55e', color: 'white' }}>+120 XP</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#cbd5e1' }}>Avg. Session</span>
                <span style={{ color: '#FFCE00' }}>23 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#cbd5e1' }}>Completion Rate</span>
                <span style={{ color: '#009EE0' }}>87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#cbd5e1' }}>Next Milestone</span>
                <span style={{ color: '#f59e0b' }}>Level 4 (150 XP)</span>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
                <Calendar className="w-5 h-5" />
                This Week's Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm" style={{ color: '#cbd5e1' }}>
                  Complete "Die Heilige Vision"
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-yellow-500"></div>
                <span className="text-sm" style={{ color: '#cbd5e1' }}>
                  Start "Der Rechte Stack"
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
                <span className="text-sm" style={{ color: '#cbd5e1' }}>
                  Practice 3 Prompt Exercises
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
                <span className="text-sm" style={{ color: '#cbd5e1' }}>
                  Maintain 7-day streak
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}