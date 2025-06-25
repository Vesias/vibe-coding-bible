'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Target, BookOpen, Clock, Zap, Crown, Award } from 'lucide-react'
import { getAllWorkshops } from '@/lib/workshop/commandments'

interface UserProgress {
  workshopsCompleted: string[]
  totalXPEarned: number
  lessonsCompleted: { [workshopId: string]: string[] }
  exercisesCompleted: { [workshopId: string]: string[] }
  achievements: string[]
  currentStreak: number
  longestStreak: number
  lastActivity: Date
}

const SacredProgressTracker: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    workshopsCompleted: [],
    totalXPEarned: 0,
    lessonsCompleted: {},
    exercisesCompleted: {},
    achievements: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: new Date()
  })

  const workshops = getAllWorkshops()

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('sacred-vibe-coding-progress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  const getUserLevel = (totalXP: number) => {
    if (totalXP >= 3075) return { level: 10, title: 'Divine Prophet', color: '#FFD700', icon: '👑' }
    if (totalXP >= 2500) return { level: 9, title: 'Sacred Architect', color: '#FF6B6B', icon: '🏛️' }
    if (totalXP >= 2000) return { level: 8, title: 'Code Wizard', color: '#4ECDC4', icon: '🧙‍♂️' }
    if (totalXP >= 1500) return { level: 7, title: 'AI Master', color: '#45B7D1', icon: '🤖' }
    if (totalXP >= 1200) return { level: 6, title: 'Stack Sage', color: '#96CEB4', icon: '📚' }
    if (totalXP >= 900) return { level: 5, title: 'Prompt Artisan', color: '#FFEAA7', icon: '🎨' }
    if (totalXP >= 600) return { level: 4, title: 'Code Monk', color: '#DDA0DD', icon: '🧘‍♂️' }
    if (totalXP >= 400) return { level: 3, title: 'Debug Knight', color: '#F39C12', icon: '⚔️' }
    if (totalXP >= 200) return { level: 2, title: 'Vision Seeker', color: '#E74C3C', icon: '👁️' }
    return { level: 1, title: 'Sacred Novice', color: '#95A5A6', icon: '🌱' }
  }

  const currentLevel = getUserLevel(userProgress.totalXPEarned)
  const nextLevel = getUserLevel(userProgress.totalXPEarned + 1)
  const xpForNextLevel = nextLevel.level > currentLevel.level ? 
    getXPRequiredForLevel(nextLevel.level) - userProgress.totalXPEarned : 0

  function getXPRequiredForLevel(level: number): number {
    const thresholds = [0, 200, 400, 600, 900, 1200, 1500, 2000, 2500, 3075]
    return thresholds[level - 1] || 3075
  }

  const getOverallProgress = () => {
    const totalPossibleXP = workshops.reduce((sum, workshop) => sum + workshop.totalXP, 0)
    return (userProgress.totalXPEarned / totalPossibleXP) * 100
  }

  const getWorkshopProgress = (workshopId: string) => {
    const workshop = workshops.find(w => w.id === workshopId)
    if (!workshop) return 0

    const lessonsCompleted = userProgress.lessonsCompleted[workshopId]?.length || 0
    const exercisesCompleted = userProgress.exercisesCompleted[workshopId]?.length || 0
    const totalTasks = workshop.lessons.length + workshop.exercises.length

    return totalTasks > 0 ? ((lessonsCompleted + exercisesCompleted) / totalTasks) * 100 : 0
  }

  const achievements = [
    {
      id: 'first_lesson',
      title: 'Erste Lektion',
      description: 'Schließe deine erste Lektion ab',
      icon: '📖',
      unlocked: Object.values(userProgress.lessonsCompleted).some(lessons => lessons.length > 0)
    },
    {
      id: 'first_exercise',
      title: 'Erste Übung',
      description: 'Absolviere deine erste praktische Übung',
      icon: '💪',
      unlocked: Object.values(userProgress.exercisesCompleted).some(exercises => exercises.length > 0)
    },
    {
      id: 'first_commandment',
      title: 'Erstes Gebot',
      description: 'Vervollständige dein erstes heiliges Gebot',
      icon: '⭐',
      unlocked: userProgress.workshopsCompleted.length > 0
    },
    {
      id: 'vision_master',
      title: 'Vision Master',
      description: 'Meistere das erste Gebot: Die Heilige Vision',
      icon: '👁️',
      unlocked: userProgress.workshopsCompleted.includes('i')
    },
    {
      id: 'stack_architect',
      title: 'Stack Architect',
      description: 'Beherrsche das zweite Gebot: Der Rechte Stack',
      icon: '🏗️',
      unlocked: userProgress.workshopsCompleted.includes('ii')
    },
    {
      id: 'prompt_artist',
      title: 'Prompt Artist',
      description: 'Perfektioniere das dritte Gebot: Die Prompt-Kunst',
      icon: '🧠',
      unlocked: userProgress.workshopsCompleted.includes('iii')
    },
    {
      id: 'five_commandments',
      title: 'Halber Prophet',
      description: 'Vervollständige 5 heilige Gebote',
      icon: '🔥',
      unlocked: userProgress.workshopsCompleted.length >= 5
    },
    {
      id: 'all_commandments',
      title: 'Divine Prophet',
      description: 'Meistere alle 10 heiligen Gebote',
      icon: '👑',
      unlocked: userProgress.workshopsCompleted.length >= 10
    },
    {
      id: 'streak_master',
      title: 'Consistency King',
      description: '7 Tage learning streak',
      icon: '🔥',
      unlocked: userProgress.currentStreak >= 7
    },
    {
      id: 'xp_collector',
      title: 'XP Collector',
      description: 'Sammle 1000 XP',
      icon: '💎',
      unlocked: userProgress.totalXPEarned >= 1000
    }
  ]

  return (
    <div className="space-y-6">
      {/* Level and Progress Header */}
      <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3" style={{ color: '#FFCE00' }}>
            <div className="text-3xl">{currentLevel.icon}</div>
            <div>
              <div className="text-xl">Level {currentLevel.level}</div>
              <div className="text-sm font-normal" style={{ color: currentLevel.color }}>
                {currentLevel.title}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#cbd5e1' }}>Gesamt-Fortschritt</span>
              <span style={{ color: '#FFCE00' }}>
                {userProgress.totalXPEarned} / 3,075 XP
              </span>
            </div>
            <Progress 
              value={getOverallProgress()} 
              className="h-3"
              style={{ backgroundColor: '#1e293b' }}
            />
          </div>

          {xpForNextLevel > 0 && (
            <div className="text-sm text-center" style={{ color: '#94a3b8' }}>
              {xpForNextLevel} XP bis zum nächsten Level: {nextLevel.title}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#FFCE00' }}>
                {userProgress.workshopsCompleted.length}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Gebote erfüllt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#009EE0' }}>
                {Object.values(userProgress.lessonsCompleted).flat().length}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Lektionen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#004A8F' }}>
                {Object.values(userProgress.exercisesCompleted).flat().length}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Übungen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                {userProgress.currentStreak}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Tage Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workshop Progress Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map((workshop) => {
          const progress = getWorkshopProgress(workshop.id)
          const isCompleted = userProgress.workshopsCompleted.includes(workshop.id)
          
          return (
            <Card 
              key={workshop.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'rgba(30, 41, 59, 0.8)', 
                borderColor: isCompleted ? '#22c55e' : '#475569' 
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{workshop.sacredSymbol}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: '#FFCE00' }}>
                      Gebot {workshop.commandmentNumber}
                    </div>
                    <div className="text-xs" style={{ color: '#cbd5e1' }}>
                      {workshop.title}
                    </div>
                  </div>
                  {isCompleted && (
                    <Trophy className="w-5 h-5" style={{ color: '#22c55e' }} />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#94a3b8' }}>Fortschritt</span>
                    <span style={{ color: '#FFCE00' }}>{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                    style={{ backgroundColor: '#1e293b' }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-3 text-xs" style={{ color: '#94a3b8' }}>
                  <span>{workshop.totalXP} XP</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: isCompleted ? '#22c55e' : '#475569',
                      color: isCompleted ? '#22c55e' : '#94a3b8'
                    }}
                  >
                    {isCompleted ? 'Completed' : workshop.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Achievements */}
      <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
            <Award className="w-5 h-5" />
            Sacred Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`text-center p-3 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                    : 'bg-gray-800/50 border-gray-600/30'
                }`}
              >
                <div className={`text-2xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className={`text-xs font-semibold mb-1 ${
                  achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </div>
                <div className={`text-xs ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SacredProgressTracker