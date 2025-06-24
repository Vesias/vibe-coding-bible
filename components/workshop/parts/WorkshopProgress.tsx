'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Clock, 
  Target, 
  Star,
  Award,
  CheckCircle,
  Circle
} from 'lucide-react'

interface WorkshopProgressProps {
  workshopTitle: string
  totalLessons: number
  completedLessons: number
  totalExercises: number
  completedExercises: number
  totalXP: number
  earnedXP: number
  estimatedTime: number
  timeSpent?: number
  difficulty: string
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30'
    case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    case 'advanced': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
    case 'expert': return 'text-red-400 bg-red-400/10 border-red-400/30'
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
  }
}

export function WorkshopProgress({
  workshopTitle,
  totalLessons,
  completedLessons,
  totalExercises,
  completedExercises,
  totalXP,
  earnedXP,
  estimatedTime,
  timeSpent = 0,
  difficulty
}: WorkshopProgressProps) {
  const overallProgress = Math.round(
    ((completedLessons + completedExercises) / (totalLessons + totalExercises)) * 100
  )
  
  const lessonProgress = Math.round((completedLessons / totalLessons) * 100)
  const exerciseProgress = Math.round((completedExercises / totalExercises) * 100)
  const xpProgress = Math.round((earnedXP / totalXP) * 100)

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">{workshopTitle}</CardTitle>
          <Badge className={`border ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">Overall Progress</span>
            <span className="text-white font-semibold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lessons */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-200">Lessons</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{completedLessons}/{totalLessons}</span>
              <span className="text-blue-300">{lessonProgress}%</span>
            </div>
            <Progress value={lessonProgress} className="h-2" />
          </div>

          {/* Exercises */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-blue-200">Exercises</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{completedExercises}/{totalExercises}</span>
              <span className="text-purple-300">{exerciseProgress}%</span>
            </div>
            <Progress value={exerciseProgress} className="h-2" />
          </div>
        </div>

        {/* XP and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-blue-200">Experience</span>
            </div>
            <div className="text-white font-semibold">{earnedXP} / {totalXP} XP</div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-400" />
              <span className="text-sm text-blue-200">Time</span>
            </div>
            <div className="text-white font-semibold">
              {timeSpent > 0 ? `${timeSpent}min / ` : ''}{estimatedTime}min
            </div>
            {timeSpent > 0 && (
              <Progress value={(timeSpent / estimatedTime) * 100} className="h-2" />
            )}
          </div>
        </div>

        {/* Achievement Status */}
        {overallProgress === 100 && (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-300 font-semibold">Workshop Completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}