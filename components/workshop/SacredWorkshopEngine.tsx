'use client'

import React, { useState, useEffect } from 'react'
import { WorkshopData, WorkshopLesson, WorkshopExercise } from '@/lib/workshop/workshop-content-migrated'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SacredAIMentor from './SacredAIMentorSimple'
import SacredCertificate from './SacredCertificate'
import PDFExporter from './PDFExporter'
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
  Eye,
  Award,
  Download,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Timer,
  BookmarkCheck,
  Flame,
  Coffee
} from 'lucide-react'
import { ExportButtons } from '@/components/export/ExportButtons'
import { InteractiveCodePlayground } from '@/components/ui/interactive-code-playground'

interface WorkshopProgress {
  lessonsCompleted: string[]
  exercisesCompleted: string[]
  totalXPEarned: number
  currentLesson: string
  startedAt: Date
  lastActivity: Date
  sessionTime: number // total time spent in minutes
  streak: number // consecutive days
}

interface SessionState {
  isActive: boolean
  startTime: Date | null
  totalTime: number // in seconds
  isPaused: boolean
  currentFocus: 'lesson' | 'exercise' | 'overview' | null
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
    lastActivity: new Date(),
    sessionTime: 0,
    streak: 0
  })

  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    startTime: null,
    totalTime: 0,
    isPaused: false,
    currentFocus: null
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [selectedLesson, setSelectedLesson] = useState<WorkshopLesson | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<WorkshopExercise | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(0)

  useEffect(() => {
    // Load progress from localStorage if available
    const savedProgress = localStorage.getItem(`workshop-progress-${workshop.id}`)
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setProgress({
        ...parsed,
        sessionTime: parsed.sessionTime || 0,
        streak: parsed.streak || 0
      })
    }
    
    // Load session state
    const savedSession = localStorage.getItem(`workshop-session-${workshop.id}`)
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession)
      setSessionState(parsedSession)
      setSessionTimer(parsedSession.totalTime || 0)
    }
  }, [workshop.id])

  // Session timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (sessionState.isActive && !sessionState.isPaused) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1)
        setSessionState(prev => ({
          ...prev,
          totalTime: prev.totalTime + 1
        }))
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionState.isActive, sessionState.isPaused])

  // Save session state
  useEffect(() => {
    localStorage.setItem(`workshop-session-${workshop.id}`, JSON.stringify(sessionState))
  }, [sessionState, workshop.id])

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem(`workshop-progress-${workshop.id}`, JSON.stringify(progress))
    onProgress?.(progress)
  }, [progress, workshop.id, onProgress])

  // Session management functions
  const startSession = (focus: 'lesson' | 'exercise' | 'overview') => {
    setSessionState({
      isActive: true,
      startTime: new Date(),
      totalTime: sessionTimer,
      isPaused: false,
      currentFocus: focus
    })
  }

  const pauseSession = () => {
    setSessionState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }))
  }

  const endSession = () => {
    const sessionMinutes = Math.floor(sessionTimer / 60)
    setProgress(prev => ({
      ...prev,
      sessionTime: prev.sessionTime + sessionMinutes,
      lastActivity: new Date()
    }))
    
    setSessionState({
      isActive: false,
      startTime: null,
      totalTime: 0,
      isPaused: false,
      currentFocus: null
    })
    
    setSessionTimer(0)
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const completeLesson = (lessonId: string) => {
    if (!progress.lessonsCompleted.includes(lessonId)) {
      const lesson = workshop.lessons.find(l => l.id === lessonId)
      if (lesson) {
        const newProgress = {
          ...progress,
          lessonsCompleted: [...progress.lessonsCompleted, lessonId],
          totalXPEarned: progress.totalXPEarned + lesson.xp,
          lastActivity: new Date()
        }
        setProgress(newProgress)
        
        // Check if workshop is completed and update global progress
        checkWorkshopCompletion(newProgress)
      }
    }
  }

  const completeExercise = (exerciseId: string) => {
    if (!progress.exercisesCompleted.includes(exerciseId)) {
      const exercise = workshop.exercises.find(e => e.id === exerciseId)
      if (exercise) {
        const newProgress = {
          ...progress,
          exercisesCompleted: [...progress.exercisesCompleted, exerciseId],
          totalXPEarned: progress.totalXPEarned + exercise.xp,
          lastActivity: new Date()
        }
        setProgress(newProgress)
        
        // Check if workshop is completed and update global progress
        checkWorkshopCompletion(newProgress)
      }
    }
  }

  const checkWorkshopCompletion = (currentProgress: WorkshopProgress) => {
    const totalLessons = workshop.lessons.length
    const totalExercises = workshop.exercises.length
    const completedLessons = currentProgress.lessonsCompleted.length
    const completedExercises = currentProgress.exercisesCompleted.length
    
    // Workshop is complete if all lessons and exercises are done
    const isComplete = completedLessons === totalLessons && completedExercises === totalExercises
    
    if (isComplete) {
      // Update global workshop progress
      const globalProgress = localStorage.getItem('vibe-coding-workshop-progress')
      if (globalProgress) {
        const parsed = JSON.parse(globalProgress)
        if (!parsed.completedWorkshops.includes(workshop.id)) {
          const updatedGlobal = {
            ...parsed,
            completedWorkshops: [...parsed.completedWorkshops, workshop.id],
            totalXPEarned: parsed.totalXPEarned + workshop.totalXP,
            lastActivity: new Date()
          }
          localStorage.setItem('vibe-coding-workshop-progress', JSON.stringify(updatedGlobal))
          
          // Show completion celebration
          showCompletionCelebration()
          // Show certificate after completion
          setShowCertificate(true)
        }
      }
    }
  }

  const showCompletionCelebration = () => {
    // Simple completion notification - could be enhanced with a modal
    const message = `🎉 Congratulations! You've completed ${workshop.title}! 🎉`
    if (typeof window !== 'undefined') {
      // You could replace this with a proper toast/modal system
      setTimeout(() => alert(message), 500)
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

  // Session Control Component
  const SessionControl = () => (
    <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }} className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" style={{ color: sessionState.isActive ? '#22c55e' : '#FFCE00' }} />
              <span className="text-lg font-mono" style={{ color: '#FFCE00' }}>
                {formatTime(sessionTimer)}
              </span>
            </div>
            {sessionState.isActive && (
              <Badge 
                variant="secondary" 
                className={`${sessionState.isPaused ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
              >
                {sessionState.isPaused ? 'Paused' : 'Active'}
              </Badge>
            )}
            {sessionState.currentFocus && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                <Flame className="w-4 h-4" />
                <span>Focus: {sessionState.currentFocus}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!sessionState.isActive ? (
              <Button 
                onClick={() => startSession('overview')}
                size="sm"
                style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            ) : (
              <>
                <Button 
                  onClick={pauseSession}
                  size="sm"
                  variant="outline"
                  style={{ borderColor: '#FFCE00', color: '#FFCE00' }}
                >
                  {sessionState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={endSession}
                  size="sm"
                  variant="outline"
                  style={{ borderColor: '#dc2626', color: '#dc2626' }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {progress.sessionTime > 0 && (
          <div className="mt-3 text-xs" style={{ color: '#94a3b8' }}>
            Total Learning Time: {Math.floor(progress.sessionTime / 60)}h {progress.sessionTime % 60}m
            {progress.streak > 0 && (
              <span className="ml-4">
                🔥 {progress.streak} day streak
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const WorkshopOverview = () => (
    <div className="space-y-6">
      {/* Session Control */}
      <SessionControl />
      
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

      {/* Export Section */}
      <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
        <CardHeader>
          <CardTitle style={{ color: '#FFCE00' }}>Workshop als eBook</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportButtons 
            type="workshop" 
            workshopId={workshop.id}
            title={`${workshop.title} - Workshop`}
            variant="compact"
          />
        </CardContent>
      </Card>
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
              onClick={() => {
                setSelectedLesson(lesson)
                if (!sessionState.isActive) {
                  startSession('lesson')
                } else {
                  setSessionState(prev => ({ ...prev, currentFocus: 'lesson' }))
                }
              }}
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
              onClick={() => {
                setSelectedExercise(exercise)
                if (!sessionState.isActive) {
                  startSession('exercise')
                } else {
                  setSessionState(prev => ({ ...prev, currentFocus: 'exercise' }))
                }
              }}
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

  const ExerciseModal = ({ exercise }: { exercise: WorkshopExercise }) => {
    const [exerciseCode, setExerciseCode] = useState('')
    const [isValidated, setIsValidated] = useState(false)
    
    return (
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
          
          {/* Interactive Code Playground */}
          <div>
            <h4 className="font-semibold mb-2" style={{ color: '#009EE0' }}>
              <Code className="w-4 h-4 inline mr-1" />
              Interactive Code Environment
            </h4>
            <InteractiveCodePlayground
              initialCode={`// ${exercise.title}\n// ${exercise.description}\n\n// Your code here...`}
              language="javascript"
              expectedOutput={exercise.expectedOutput}
              hints={exercise.hints}
              onCodeChange={setExerciseCode}
              onValidate={(valid, output) => {
                setIsValidated(valid)
                if (valid) {
                  // Could trigger celebration or auto-completion
                  console.log('Exercise validated successfully!')
                }
              }}
            />
          </div>
          
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
                disabled={!isValidated}
                style={{ 
                  background: isValidated 
                    ? 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' 
                    : 'rgba(100, 116, 139, 0.5)',
                  cursor: isValidated ? 'pointer' : 'not-allowed'
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isValidated ? 'Übung Abschließen' : 'Löse die Übung, um fortzufahren'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)' 
    }}>
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5" style={{ 
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
            <TabsTrigger value="certificate" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificate
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
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

          <TabsContent value="certificate">
            <div className="space-y-6">
              {getProgressPercentage() === 100 ? (
                <SacredCertificate
                  workshop={workshop}
                  completionDate={new Date(progress.lastActivity)}
                  userInfo={{
                    name: 'Sacred Developer' // Could be enhanced to get actual user info
                  }}
                  xpEarned={progress.totalXPEarned}
                  onDownload={() => console.log('Certificate downloaded')}
                  onShare={() => console.log('Certificate shared')}
                />
              ) : (
                <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: '#64748b' }} />
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#FFCE00' }}>
                      Certificate noch nicht verfügbar
                    </h3>
                    <p className="mb-4" style={{ color: '#94a3b8' }}>
                      Vervollständige alle Lektionen und Übungen, um dein Sacred Certificate zu erhalten.
                    </p>
                    <div className="mb-6">
                      <div className="text-sm mb-2" style={{ color: '#94a3b8' }}>
                        Fortschritt: {Math.round(getProgressPercentage())}%
                      </div>
                      <Progress value={getProgressPercentage()} className="h-3" />
                    </div>
                    <div className="text-sm" style={{ color: '#64748b' }}>
                      Noch benötigt:
                      <ul className="mt-2 space-y-1">
                        {progress.lessonsCompleted.length < workshop.lessons.length && (
                          <li>• {workshop.lessons.length - progress.lessonsCompleted.length} Lektionen</li>
                        )}
                        {progress.exercisesCompleted.length < workshop.exercises.length && (
                          <li>• {workshop.exercises.length - progress.exercisesCompleted.length} Übungen</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="export">
            <PDFExporter
              workshop={workshop}
              progress={progress}
              includeProgress={true}
              includeExercises={true}
              includeNotes={false}
            />
          </TabsContent>
        </Tabs>

        {selectedLesson && <LessonModal lesson={selectedLesson} />}
        {selectedExercise && <ExerciseModal exercise={selectedExercise} />}
      </div>

      {/* Sacred AI Mentor */}
      <SacredAIMentor 
        workshopContext={{
          currentStep: selectedLesson?.id || 'intro',
          progress: 50,
          commandment: workshop.title
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