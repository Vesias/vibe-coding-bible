'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWorkshopEngine, WorkshopStep, StepProgress } from '@/lib/workshop/engine'
import { workshops, WorkshopData } from '@/lib/workshop/workshop-data'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useToast } from '@/hooks/use-toast'

// Modular Components
import { ExerciseCard } from './parts/ExerciseCard'
import { LessonCard } from './parts/LessonCard'
import { WorkshopProgress } from './parts/WorkshopProgress'
import { RichContentRenderer } from './parts/RichContentRenderer'

// UI Components
import { 
  Play, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  Share2,
  Crown,
  Sparkles
} from 'lucide-react'

interface InteractiveWorkshopProps {
  workshopId: string
  className?: string
}

function InteractiveWorkshopRefactored({ workshopId, className = '' }: InteractiveWorkshopProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [currentTab, setCurrentTab] = useState<'overview' | 'lessons' | 'exercises' | 'progress'>('overview')
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [earnedXP, setEarnedXP] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  const workshop = workshops[workshopId as keyof typeof workshops] as WorkshopData | undefined
  
  if (!workshop) {
    return (
      <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-500/30">
        <CardContent className="text-center py-12">
          <Crown className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Workshop Not Found</h2>
          <p className="text-red-200">The requested workshop could not be loaded.</p>
        </CardContent>
      </Card>
    )
  }

  const handleStartLesson = (lessonId: string) => {
    setSelectedLesson(lessonId)
    setCurrentTab('lessons')
  }

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      // TODO: Fix lessons - using exercises for now
      const lesson = workshop.exercises.find(l => l.id === lessonId)
      setCompletedLessons([...completedLessons, lessonId])
      setEarnedXP(prev => prev + (lesson?.xpReward || 0))
      
      toast({
        title: "Lesson Completed!",
        description: `You earned ${lesson?.xpReward || 0} XP`,
      })
    }
  }

  const handleStartExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId)
    setCurrentTab('exercises')
  }

  const handleCompleteExercise = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      const exercise = workshop.exercises.find(e => e.id === exerciseId)
      setCompletedExercises([...completedExercises, exerciseId])
      setEarnedXP(prev => prev + (exercise?.xpReward || 0))
      
      toast({
        title: "Exercise Completed!",
        description: `You earned ${exercise?.xpReward || 0} XP`,
      })
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Workshop Header */}
      <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">📖</div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Commandment {workshop.commandmentNumber}: {workshop.title}
              </h1>
              <p className="text-xl text-blue-200 mb-4">{workshop.subtitle}</p>
              <div className="flex items-center gap-4 text-blue-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  {workshop.difficulty}
                </span>
                <span>{workshop.estimatedTime} minutes</span>
                <span>{workshop.xpReward} XP</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
            <p className="text-blue-100 italic text-center">
              {workshop.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <WorkshopProgress
        workshopTitle={workshop.title}
        totalLessons={workshop.exercises.length}
        completedLessons={completedLessons.length}
        totalExercises={workshop.exercises.length}
        completedExercises={completedExercises.length}
        totalXP={workshop.xpReward}
        earnedXP={earnedXP}
        estimatedTime={workshop.estimatedTime}
        timeSpent={timeSpent}
        difficulty={workshop.difficulty}
      />

      {/* Main Content Tabs */}
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <RichContentRenderer content={workshop.description} />
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Learning Objectives</h4>
                  <ul className="space-y-2">
                    {workshop.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-blue-200 flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Completion Criteria</h4>
                  <ul className="space-y-2">
                    {workshop.learningObjectives.map((criteria, index) => (
                      <li key={index} className="text-blue-200 flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <div className="text-center text-white p-8">
            <p>Lessons coming soon! For now, check out the exercises tab.</p>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="text-center text-white p-8">
            <p>Exercises functionality is being updated. Coming soon!</p>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Detailed Progress</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Progress Overview</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-blue-200">Completed Exercises</span>
                      <span className="text-green-400">{completedExercises.length} / {workshop.exercises.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Exercises Progress</h4>
                  <div className="space-y-2">
                    {workshop.exercises.map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-blue-200">{exercise.title}</span>
                        <span className={`text-sm ${
                          completedExercises.includes(exercise.id) 
                            ? 'text-green-400' 
                            : 'text-gray-400'
                        }`}>
                          {completedExercises.includes(exercise.id) ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InteractiveWorkshopRefactored