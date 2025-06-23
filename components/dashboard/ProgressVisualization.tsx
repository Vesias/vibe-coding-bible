'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Target, 
  Zap,
  Crown,
  Flame,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react'

interface ProgressVisualizationProps {
  xp: number
  level: number
  rank: string
  rankProgress: {
    progress: number
    xpNeeded: number
  }
  weeklyProgress: {
    workshopsCompleted: number
    xpEarned: number
    timeSpent: number
    streakDays: number
  }
  learningStreak: number
}

export function ProgressVisualization({
  xp,
  level,
  rank,
  rankProgress,
  weeklyProgress,
  learningStreak
}: ProgressVisualizationProps) {
  const [activeView, setActiveView] = useState<'overview' | 'weekly' | 'achievements'>('overview')
  const [animatedXP, setAnimatedXP] = useState(0)

  // Animate XP counter on mount
  useEffect(() => {
    const duration = 2000
    const increment = xp / (duration / 50)
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= xp) {
        setAnimatedXP(xp)
        clearInterval(timer)
      } else {
        setAnimatedXP(Math.floor(current))
      }
    }, 50)

    return () => clearInterval(timer)
  }, [xp])

  // Calculate level progress
  const currentLevelXP = (level - 1) * 1000
  const nextLevelXP = level * 1000
  const levelProgress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  // Mock weekly data for chart visualization
  const weeklyData = [
    { day: 'Mon', xp: 120, time: 45 },
    { day: 'Tue', xp: 250, time: 90 },
    { day: 'Wed', xp: 180, time: 60 },
    { day: 'Thu', xp: 300, time: 120 },
    { day: 'Fri', xp: 200, time: 80 },
    { day: 'Sat', xp: 150, time: 50 },
    { day: 'Sun', xp: 100, time: 30 }
  ]

  const maxDailyXP = Math.max(...weeklyData.map(d => d.xp))
  const maxDailyTime = Math.max(...weeklyData.map(d => d.time))

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'novice': return 'text-gray-600'
      case 'apprentice': return 'text-blue-600'
      case 'practitioner': return 'text-purple-600'
      case 'architect': return 'text-yellow-600'
      case 'prophet': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStreakIcon = (days: number) => {
    if (days >= 30) return '🔥'
    if (days >= 14) return '⚡'
    if (days >= 7) return '✨'
    if (days >= 3) return '🌟'
    return '💫'
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SacredGeometry 
          pattern="golden-spiral" 
          className="absolute top-4 right-4 opacity-5 scale-75" 
        />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Divine Progress</CardTitle>
              <CardDescription>
                Your ascension through the coding realms
              </CardDescription>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'weekly', label: 'Weekly', icon: Calendar },
            { id: 'achievements', label: 'Goals', icon: Target }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(tab.id as any)}
                className="flex-1"
              >
                <Icon className="h-4 w-4 mr-1" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* XP and Level Section */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {animatedXP.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Experience Points</div>
                
                {/* Rank Badge */}
                <div className="flex items-center justify-center mt-2">
                  <Badge 
                    variant="outline" 
                    className={`${getRankColor(rank)} border-current bg-background/50 backdrop-blur-sm`}
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    {rank.charAt(0).toUpperCase() + rank.slice(1)} (Level {level})
                  </Badge>
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {level}</span>
                  <span>Level {level + 1}</span>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {Math.round((nextLevelXP - xp))} XP to next level
                </div>
              </div>
            </div>

            {/* Rank Progress Circle */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted stroke-current opacity-20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${rankProgress.progress * 2.83} 283`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(rankProgress.progress)}%</div>
                    <div className="text-xs text-muted-foreground">to next rank</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200/50 dark:border-orange-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getStreakIcon(learningStreak)}</div>
                  <div>
                    <div className="font-semibold text-orange-800 dark:text-orange-200">
                      {learningStreak} Day Streak!
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      Keep the divine fire burning
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {learningStreak}
                  </div>
                  <div className="text-xs text-orange-500">
                    {learningStreak === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly View */}
        {activeView === 'weekly' && (
          <div className="space-y-6">
            {/* Weekly Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">XP Gained</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{weeklyProgress.xpEarned}</div>
                <div className="text-xs text-blue-500">+15% from last week</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Time Spent</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(weeklyProgress.timeSpent / 60)}h {weeklyProgress.timeSpent % 60}m
                </div>
                <div className="text-xs text-green-500">Avg {Math.round(weeklyProgress.timeSpent / 7)}m/day</div>
              </div>
            </div>

            {/* Daily XP Chart */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Daily Activity
              </h4>
              
              <div className="space-y-2">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-muted-foreground font-medium">
                      {day.day}
                    </div>
                    
                    {/* XP Bar */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">XP</span>
                        <span className="font-medium">{day.xp}</span>
                      </div>
                      <div className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.xp / maxDailyXP) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Time Indicator */}
                    <div className="w-12 text-xs text-right text-muted-foreground">
                      {day.time}m
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Weekly Goals
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complete 3 workshops</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{weeklyProgress.workshopsCompleted}/3</span>
                    <div className="w-16 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (weeklyProgress.workshopsCompleted / 3) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Earn 1000 XP</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{weeklyProgress.xpEarned}/1000</span>
                    <div className="w-16 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (weeklyProgress.xpEarned / 1000) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintain 7-day streak</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{weeklyProgress.streakDays}/7</span>
                    <div className="w-16 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (weeklyProgress.streakDays / 7) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements View */}
        {activeView === 'achievements' && (
          <div className="space-y-4">
            {/* Current Goals */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Goals
              </h4>
              
              {[
                { 
                  title: 'Reach Practitioner Rank', 
                  progress: rankProgress.progress, 
                  target: 100,
                  reward: '500 XP + Special Badge',
                  icon: Crown,
                  color: 'purple'
                },
                { 
                  title: 'Complete 10 Workshops', 
                  progress: 60, 
                  target: 100,
                  reward: '1000 XP + Achievement',
                  icon: Award,
                  color: 'blue'
                },
                { 
                  title: '30-Day Learning Streak', 
                  progress: (learningStreak / 30) * 100, 
                  target: 100,
                  reward: 'Elite Badge + Special Title',
                  icon: Flame,
                  color: 'orange'
                }
              ].map((goal, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <goal.icon className={`h-4 w-4 text-${goal.color}-600`} />
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                  
                  <Progress value={goal.progress} className="h-2" />
                  
                  <div className="text-xs text-muted-foreground">
                    <Award className="h-3 w-3 inline mr-1" />
                    Reward: {goal.reward}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Achievements */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Recent Achievements
              </h4>
              
              {[
                { 
                  title: 'First Workshop Completed', 
                  date: '2 days ago',
                  icon: '🎯',
                  rarity: 'Common'
                },
                { 
                  title: 'Week-long Streak', 
                  date: '1 week ago',
                  icon: '🔥',
                  rarity: 'Rare'
                }
              ].map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}