'use client'

import { WorkshopLesson } from '@/lib/workshop/workshop-content-migrated'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RichContentRenderer } from './RichContentRenderer'
import { 
  BookOpen, 
  Code, 
  CheckCircle, 
  Circle, 
  Clock, 
  Target,
  Award,
  Play
} from 'lucide-react'

interface LessonCardProps {
  lesson: WorkshopLesson
  isCompleted?: boolean
  isActive?: boolean
  onStart?: () => void
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'theory': return BookOpen
    case 'practice': return Code
    case 'exercise': return Target
    case 'reflection': return Circle
    default: return BookOpen
  }
}

const getLessonTypeColor = (type: string) => {
  switch (type) {
    case 'theory': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
    case 'practice': return 'text-green-400 bg-green-400/10 border-green-400/30'
    case 'exercise': return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
    case 'reflection': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
  }
}

export function LessonCard({ lesson, isCompleted = false, isActive = false, onStart }: LessonCardProps) {
  const Icon = getLessonIcon(lesson.type)
  const StatusIcon = isCompleted ? CheckCircle : Circle

  return (
    <Card className={`transition-all duration-300 ${
      isActive 
        ? 'bg-white/10 border-blue-500/50 shadow-lg shadow-blue-500/20' 
        : 'bg-white/5 border-white/10 hover:bg-white/10'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">{lesson.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs border ${getLessonTypeColor(lesson.type)}`}>
                  {lesson.type}
                </Badge>
                <div className="flex items-center gap-1 text-blue-300 text-sm">
                  <Clock className="h-3 w-3" />
                  {lesson.estimatedTime}min
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Award className="h-3 w-3" />
                  {lesson.xp} XP
                </div>
              </div>
            </div>
          </div>
          <StatusIcon className={`h-6 w-6 ${isCompleted ? 'text-green-400' : 'text-gray-400'}`} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4">
          <RichContentRenderer 
            content={lesson.content} 
            className="text-sm"
          />
        </div>
        
        {onStart && !isCompleted && (
          <div className="flex justify-end">
            <Button 
              onClick={onStart}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Lesson
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}