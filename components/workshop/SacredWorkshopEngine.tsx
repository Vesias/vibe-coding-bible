'use client'

import React, { useState, useEffect } from 'react'
import { WorkshopData, WorkshopLesson, WorkshopExercise } from '@/lib/workshop/workshop-content-migrated'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SacredAIMentor from './SacredAIMentor'
import { 
  BookOpen, 
  Code, 
  CheckCircle, 
  Circle, 
  Star, 
  Clock, 
  Target,
  Lightbulb,
  Trophy,
  Zap,
  Brain,
  Users,
  Eye
} from 'lucide-react'

interface WorkshopProgress {
  lessonsCompleted: string[]
  exercisesCompleted: string[]
  totalXPEarned: number
  currentLesson: string
  startedAt: Date
  lastActivity: Date
}

interface SacredWorkshopEngineProps {
  workshop: WorkshopData
  onProgress?: (progress: WorkshopProgress) => void
}

const SacredWorkshopEngine: React.FC<SacredWorkshopEngineProps> = ({ 
  workshop, 
  onProgress 
}) => {
  const [progress, setProgress] = useState<WorkshopProgress>({
    lessonsCompleted: [],
    exercisesCompleted: [],
    totalXPEarned: 0,
    currentLesson: workshop.lessons[0]?.id || '',
    startedAt: new Date(),
    lastActivity: new Date()
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [selectedLesson, setSelectedLesson] = useState<WorkshopLesson | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<WorkshopExercise | null>(null)

  useEffect(() => {
    // Load progress from localStorage if available
    const savedProgress = localStorage.getItem(`workshop-progress-${workshop.id}`)
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [workshop.id])

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem(`workshop-progress-${workshop.id}`, JSON.stringify(progress))
    onProgress?.(progress)
  }, [progress, workshop.id, onProgress])

  const completeLesson = (lessonId: string) => {
    if (!progress.lessonsCompleted.includes(lessonId)) {
      const lesson = workshop.lessons.find(l => l.id === lessonId)
      if (lesson) {
        setProgress(prev => ({
          ...prev,
          lessonsCompleted: [...prev.lessonsCompleted, lessonId],
          totalXPEarned: prev.totalXPEarned + lesson.xp,
          lastActivity: new Date()
        }))
      }
    }
  }

  const completeExercise = (exerciseId: string) => {
    if (!progress.exercisesCompleted.includes(exerciseId)) {
      const exercise = workshop.exercises.find(e => e.id === exerciseId)
      if (exercise) {
        setProgress(prev => ({
          ...prev,
          exercisesCompleted: [...prev.exercisesCompleted, exerciseId],
          totalXPEarned: prev.totalXPEarned + exercise.xp,
          lastActivity: new Date()
        }))
      }
    }
  }

  const getProgressPercentage = () => {
    const totalLessons = workshop.lessons.length
    const totalExercises = workshop.exercises.length
    const completedLessons = progress.lessonsCompleted.length
    const completedExercises = progress.exercisesCompleted.length
    
    return ((completedLessons + completedExercises) / (totalLessons + totalExercises)) * 100
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theory': return <BookOpen className="w-4 h-4" />
      case 'practice': return <Code className="w-4 h-4" />
      case 'exercise': return <Target className="w-4 h-4" />
      case 'reflection': return <Brain className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const WorkshopOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">{workshop.sacredSymbol}</div>
        <h1 className="text-3xl font-bold" style={{ color: '#FFCE00' }}>
          {workshop.title}
        </h1>
        <p className="text-lg" style={{ color: '#cbd5e1' }}>
          {workshop.subtitle}
        </p>
        <div className="text-sm italic" style={{ color: '#94a3b8' }}>
          {workshop.sacredWisdom}
        </div>
      </div>

      {/* Progress Overview */}
      <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
            <Trophy className="w-5 h-5" />
            Dein Fortschritt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#cbd5e1' }}>Gesamt-Fortschritt</span>
              <span style={{ color: '#FFCE00' }}>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress 
              value={getProgressPercentage()} 
              className="h-2"
              style={{ backgroundColor: '#1e293b' }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#FFCE00' }}>
                {progress.totalXPEarned}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Earned XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#009EE0' }}>
                {progress.lessonsCompleted.length}/{workshop.lessons.length}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#004A8F' }}>
                {progress.exercisesCompleted.length}/{workshop.exercises.length}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                {workshop.estimatedTime}
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Min Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workshop Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
          <CardHeader>
            <CardTitle style={{ color: '#FFCE00' }}>Workshop Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Schwierigkeitsgrad:</span>
              <Badge className={getDifficultyColor(workshop.difficulty)}>
                {workshop.difficulty}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Gesamt XP:</span>
              <span style={{ color: '#FFCE00' }}>{workshop.totalXP}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Geschätzte Zeit:</span>
              <span style={{ color: '#cbd5e1' }}>{workshop.estimatedTime} Min</span>
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
          <CardHeader>
            <CardTitle style={{ color: '#FFCE00' }}>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {workshop.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5" style={{ color: '#FFCE00' }} />
                  <span className="text-sm" style={{ color: '#cbd5e1' }}>
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const LessonsView = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {workshop.lessons.map((lesson, index) => {
          const isCompleted = progress.lessonsCompleted.includes(lesson.id)
          const isCurrent = progress.currentLesson === lesson.id
          
          return (
            <Card 
              key={lesson.id}
              className={`cursor-pointer transition-all duration-300 ${
                isCurrent ? 'ring-2 ring-yellow-500' : ''
              }`}
              style={{ 
                background: 'rgba(30, 41, 59, 0.8)', 
                borderColor: isCompleted ? '#22c55e' : '#475569' 
              }}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                      ) : (
                        <Circle className="w-6 h-6" style={{ color: '#94a3b8' }} />
                      )}
                      {getTypeIcon(lesson.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2" style={{ color: '#FFCE00' }}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#94a3b8' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.estimatedTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {lesson.xp} XP
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const ExercisesView = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {workshop.exercises.map((exercise, index) => {
          const isCompleted = progress.exercisesCompleted.includes(exercise.id)
          
          return (
            <Card 
              key={exercise.id}
              className="cursor-pointer transition-all duration-300"
              style={{ 
                background: 'rgba(30, 41, 59, 0.8)', 
                borderColor: isCompleted ? '#22c55e' : '#475569' 
              }}
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                      ) : (
                        <Circle className="w-6 h-6" style={{ color: '#94a3b8' }} />
                      )}
                      <Target className="w-5 h-5" style={{ color: '#009EE0' }} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2" style={{ color: '#FFCE00' }}>
                        {exercise.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: '#cbd5e1' }}>
                        {exercise.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#94a3b8' }}>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {exercise.xp} XP
                        </span>
                        {exercise.aiAssistance && (
                          <span className="flex items-center gap-1">
                            <Brain className="w-4 h-4" />
                            AI-Assisted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const LessonModal = ({ lesson }: { lesson: WorkshopLesson }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto" style={{ 
        background: 'rgba(15, 23, 42, 0.95)', 
        borderColor: '#475569' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
              {getTypeIcon(lesson.type)}
              {lesson.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedLesson(null)}
              style={{ color: '#94a3b8' }}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="prose prose-invert max-w-none"
            style={{ color: '#cbd5e1' }}
            dangerouslySetInnerHTML={{ 
              __html: lesson.content.replace(/\n/g, '<br/>').replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>') 
            }}
          />
          
          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#475569' }}>
            <div className="flex items-center gap-4 text-sm" style={{ color: '#94a3b8' }}>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.estimatedTime} Minuten
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {lesson.xp} XP
              </span>
            </div>
            
            {!progress.lessonsCompleted.includes(lesson.id) && (
              <Button
                onClick={() => {
                  completeLesson(lesson.id)
                  setSelectedLesson(null)
                }}
                style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Lektion Abschließen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ExerciseModal = ({ exercise }: { exercise: WorkshopExercise }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto" style={{ 
        background: 'rgba(15, 23, 42, 0.95)', 
        borderColor: '#475569' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
              <Target className="w-5 h-5" />
              {exercise.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedExercise(null)}
              style={{ color: '#94a3b8' }}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2" style={{ color: '#009EE0' }}>Beschreibung</h4>
            <p style={{ color: '#cbd5e1' }}>{exercise.description}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2" style={{ color: '#009EE0' }}>Anweisungen</h4>
            <ol className="list-decimal list-inside space-y-2" style={{ color: '#cbd5e1' }}>
              {exercise.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2" style={{ color: '#009EE0' }}>Erwartetes Ergebnis</h4>
            <p style={{ color: '#cbd5e1' }}>{exercise.expectedOutput}</p>
          </div>
          
          {exercise.hints.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#009EE0' }}>
                <Lightbulb className="w-4 h-4 inline mr-1" />
                Hilfreiche Tipps
              </h4>
              <ul className="list-disc list-inside space-y-1" style={{ color: '#cbd5e1' }}>
                {exercise.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#475569' }}>
            <div className="flex items-center gap-4 text-sm" style={{ color: '#94a3b8' }}>
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {exercise.xp} XP
              </span>
              {exercise.aiAssistance && (
                <span className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  AI-Unterstützung verfügbar
                </span>
              )}
            </div>
            
            {!progress.exercisesCompleted.includes(exercise.id) && (
              <Button
                onClick={() => {
                  completeExercise(exercise.id)
                  setSelectedExercise(null)
                }}
                style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Übung Abschließen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)' 
    }}>
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3" style={{ 
            background: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#475569'
          }}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Überblick
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lektionen ({progress.lessonsCompleted.length}/{workshop.lessons.length})
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Übungen ({progress.exercisesCompleted.length}/{workshop.exercises.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <WorkshopOverview />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonsView />
          </TabsContent>

          <TabsContent value="exercises">
            <ExercisesView />
          </TabsContent>
        </Tabs>

        {selectedLesson && <LessonModal lesson={selectedLesson} />}
        {selectedExercise && <ExerciseModal exercise={selectedExercise} />}
      </div>

      {/* Sacred AI Mentor */}
      <SacredAIMentor 
        workshopContext={{
          commandmentNumber: workshop.commandmentNumber,
          title: workshop.title,
          currentLesson: selectedLesson?.id,
          currentExercise: selectedExercise?.id
        }}
        onSuggestion={(suggestion) => {
          // Handle AI suggestions if needed
          console.log('AI Suggestion:', suggestion)
        }}
      />
    </div>
  )
}

export default SacredWorkshopEngine