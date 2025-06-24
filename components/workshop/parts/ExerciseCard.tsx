'use client'

import { WorkshopExercise } from '@/lib/workshop/workshop-content-migrated'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  Brain, 
  Monitor, 
  Palette, 
  BookOpen, 
  Target, 
  Award, 
  Clock,
  Play
} from 'lucide-react'

interface ExerciseCardProps {
  exercise: WorkshopExercise
  onStart: () => void
}

const getExerciseIcon = (type: string) => {
  switch (type) {
    case 'challenge': return Code
    case 'quiz': return Brain
    case 'coding': return Monitor
    case 'design': return Palette
    case 'research': return BookOpen
    default: return Target
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/30'
    case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/30'
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
  }
}

export function ExerciseCard({ exercise, onStart }: ExerciseCardProps) {
  const Icon = getExerciseIcon(exercise.type || 'default')

  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">{exercise.title}</CardTitle>
              <CardDescription className="text-blue-200">{exercise.description}</CardDescription>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <Badge className={`text-xs border ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <Award className="h-4 w-4" />
            {exercise.xp} XP
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-blue-100 text-sm mb-4">{exercise.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            {exercise.aiAssistance && (
              <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                AI Assistant
              </Badge>
            )}
          </div>
          <Button 
            onClick={onStart}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}