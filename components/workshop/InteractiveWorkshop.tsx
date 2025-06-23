'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWorkshopEngine, WorkshopStep, StepProgress } from '@/lib/workshop/engine'
import { workshops, WorkshopData, WorkshopExercise } from '@/lib/workshop/workshop-data'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { 
  Play, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Target, 
  Award,
  Eye,
  EyeOff,
  Zap,
  BookOpen,
  Code,
  Scroll,
  Star,
  Crown,
  Flame,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  Share2,
  MessageCircle,
  Trophy,
  Users,
  Brain,
  Rocket,
  Sparkles,
  Palette,
  Calculator,
  Monitor
} from 'lucide-react'

interface InteractiveWorkshopProps {
  workshopId: string
  className?: string
}

interface RichContentRendererProps {
  content: string
  className?: string
}

function RichContentRenderer({ content, className = '' }: RichContentRendererProps) {
  const renderContent = (text: string) => {
    // Process markdown-like content
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mb-6 text-white">{line.slice(2)}</h1>
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mb-4 text-blue-100 mt-8">{line.slice(3)}</h2>
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mb-3 text-blue-200 mt-6">{line.slice(4)}</h3>
      } else if (line.startsWith('```')) {
        const nextClosingIndex = text.split('\n').findIndex((l, i) => i > index && l.startsWith('```'))
        if (nextClosingIndex > -1) {
          const codeLines = text.split('\n').slice(index + 1, nextClosingIndex)
          return (
            <div key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4 border border-green-500/20">
              <pre>{codeLines.join('\n')}</pre>
            </div>
          )
        }
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={index} className="text-blue-100 mb-2 ml-4">
            {line.trim().slice(2)}
          </li>
        )
      } else if (line.trim()) {
        return <p key={index} className="mb-4 text-blue-100 leading-relaxed">{line}</p>
      }
      return <br key={index} />
    })
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      {renderContent(content)}
    </div>
  )
}

function ExerciseCard({ exercise, onStart }: { exercise: WorkshopExercise, onStart: () => void }) {
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
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'advanced': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      case 'expert': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const Icon = getExerciseIcon(exercise.type)

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
            {exercise.xpReward} XP
          </div>
          <div className="flex items-center gap-1 text-blue-300 text-sm">
            <Clock className="h-4 w-4" />
            {exercise.timeEstimate}min
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button 
          onClick={onStart}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Exercise
        </Button>
      </CardContent>
    </Card>
  )
}

export function InteractiveWorkshop({ workshopId, className = '' }: InteractiveWorkshopProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const {
    workshop,
    progress,
    currentStep,
    loading,
    loadWorkshop,
    submitCode,
    getHint
  } = useWorkshopEngine()

  // Find workshop data from our rich content
  const workshopData = workshops.find(w => w.id === workshopId)
  
  const [userCode, setUserCode] = useState('')
  const [executing, setExecuting] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [hintsShown, setHintsShown] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'theory' | 'exercises' | 'mentor' | 'narrative'>('overview')
  const [activeExercise, setActiveExercise] = useState<WorkshopExercise | null>(null)
  const [lastResult, setLastResult] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, boolean>>({})
  const [currentSection, setCurrentSection] = useState<'introduction' | 'theory' | 'practical' | 'advanced'>('introduction')

  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load workshop on mount
  useEffect(() => {
    if (user && workshopId) {
      // For now, use the rich workshop data directly
      // In a full implementation, this would still load from the database
      // loadWorkshop(workshopId, user.id)
    }
  }, [workshopId, user, loadWorkshop])

  // Initialize code editor with starter code
  useEffect(() => {
    if (activeExercise?.starterCode && !userCode) {
      setUserCode(activeExercise.starterCode)
    }
  }, [activeExercise])

  // Time tracking
  useEffect(() => {
    if (currentStep) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentStep])

  const handleCodeSubmit = async () => {
    if (!activeExercise || !user || !userCode.trim()) return

    setExecuting(true)
    setFeedback([])

    try {
      // Simulate exercise completion for now
      // In a full implementation, this would use the workshop engine
      setTimeout(() => {
        const success = Math.random() > 0.3 // 70% success rate simulation
        
        if (success) {
          setExerciseProgress(prev => ({ ...prev, [activeExercise.id]: true }))
          toast({
            title: "Divine Success! ✨",
            description: `Exercise completed! You earned ${activeExercise.xpReward} XP.`
          })
          setFeedback(['✅ Exercise completed successfully!', '🏆 Great work! Your solution meets all requirements.'])
        } else {
          toast({
            title: "Keep Seeking 📖",
            description: "Review the requirements and try again. Every attempt brings you closer to enlightenment.",
            variant: "default"
          })
          setFeedback(['❌ Not quite there yet.', '💡 Hint: Check the exercise requirements carefully.'])
        }
        setExecuting(false)
      }, 2000)

    } catch (error) {
      console.error('Error submitting code:', error)
      toast({
        title: "Execution Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
      setExecuting(false)
    }
  }

  const handleGetHint = () => {
    if (!activeExercise) return

    if (hintsShown < activeExercise.hints.length) {
      setHintsShown(prev => prev + 1)
      toast({
        title: "Divine Guidance 💡",
        description: "A hint has been revealed to guide your path."
      })
    } else {
      toast({
        title: "No More Hints",
        description: "You've received all available guidance. Trust in your knowledge!",
        variant: "default"
      })
    }
  }

  const handleReset = () => {
    if (activeExercise?.starterCode) {
      setUserCode(activeExercise.starterCode)
      setHintsShown(0)
      setShowSolution(false)
      setFeedback([])
      setLastResult(null)
    }
  }

  const handleStartExercise = (exercise: WorkshopExercise) => {
    setActiveExercise(exercise)
    setUserCode(exercise.starterCode || '')
    setHintsShown(0)
    setShowSolution(false)
    setFeedback([])
    setLastResult(null)
    setActiveTab('exercises')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'advanced': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
      case 'expert': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen
      case 'challenge': return Code
      case 'quiz': return Target
      case 'project': return Crown
      case 'reflection': return Scroll
      default: return BookOpen
    }
  }

  if (!workshopData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
        <Card className="max-w-md bg-white/10 border-white/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Workshop Not Found</h3>
            <p className="text-blue-200">The requested workshop could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedExercises = Object.values(exerciseProgress).filter(Boolean).length
  const totalExercises = workshopData.exercises.length

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <SacredGeometry 
          pattern="golden-spiral" 
          className="absolute top-1/4 right-1/4 opacity-5 scale-150" 
        />
        <SacredGeometry 
          pattern="vesica-piscis" 
          className="absolute bottom-1/4 left-1/4 opacity-5 scale-75" 
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{workshopData.title}</h1>
                  <p className="text-blue-200">
                    {workshopData.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={`text-xs border ${getDifficultyColor(workshopData.difficulty)}`}>
                  {workshopData.difficulty}
                </Badge>
                
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeSpent)}
                </div>

                <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                  <Award className="h-3 w-3 mr-1" />
                  {workshopData.xpReward} XP
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-blue-200 mb-2">
                <span>Workshop Progress</span>
                <span>{completedExercises}/{totalExercises} exercises completed</span>
              </div>
              <Progress 
                value={(completedExercises / totalExercises) * 100} 
                className="h-2 bg-white/10"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* AI Mentor Greeting */}
          <Card className="mb-8 bg-gradient-to-r from-purple-500/20 to-blue-600/20 border-purple-400/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{workshopData.aiMentor.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Your AI Mentor: {workshopData.aiMentor.name}
                  </h3>
                  <p className="text-purple-200">{workshopData.aiMentor.greetingMessage}</p>
                </div>
                <Button variant="outline" className="border-purple-400 text-purple-300">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Mentor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="theory" className="text-white data-[state=active]:bg-white/20">
                <Brain className="h-4 w-4 mr-2" />
                Theory
              </TabsTrigger>
              <TabsTrigger value="exercises" className="text-white data-[state=active]:bg-white/20">
                <Code className="h-4 w-4 mr-2" />
                Exercises ({completedExercises}/{totalExercises})
              </TabsTrigger>
              <TabsTrigger value="mentor" className="text-white data-[state=active]:bg-white/20">
                <Users className="h-4 w-4 mr-2" />
                AI Mentor
              </TabsTrigger>
              <TabsTrigger value="narrative" className="text-white data-[state=active]:bg-white/20">
                <Scroll className="h-4 w-4 mr-2" />
                Sacred Story
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Workshop Introduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RichContentRenderer content={workshopData.introduction} />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {workshopData.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2 text-blue-100">
                            <Target className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-200">Exercises Completed</span>
                          <span className="text-white">{completedExercises}/{totalExercises}</span>
                        </div>
                        <Progress value={(completedExercises / totalExercises) * 100} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">0</div>
                            <div className="text-xs text-blue-300">XP Earned</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{workshopData.estimatedTime}m</div>
                            <div className="text-xs text-blue-300">Estimated Time</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="theory" className="mt-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex gap-2">
                    {[
                      { id: 'introduction', label: 'Introduction' },
                      { id: 'theory', label: 'Core Theory' },
                      { id: 'practical', label: 'Practical Guide' },
                      { id: 'advanced', label: 'Advanced Topics' }
                    ].map(section => (
                      <Button
                        key={section.id}
                        variant={currentSection === section.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentSection(section.id as any)}
                        className={currentSection === section.id ? 'bg-purple-600' : 'border-white/30 text-white'}
                      >
                        {section.label}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="min-h-[500px]">
                  {currentSection === 'introduction' && (
                    <RichContentRenderer content={workshopData.introduction} />
                  )}
                  {currentSection === 'theory' && (
                    <RichContentRenderer content={workshopData.theory} />
                  )}
                  {currentSection === 'practical' && (
                    <RichContentRenderer content={workshopData.practicalGuide} />
                  )}
                  {currentSection === 'advanced' && (
                    <RichContentRenderer content={workshopData.advancedTopics || 'Advanced content coming soon...'} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="exercises" className="mt-6">
              {!activeExercise ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {workshopData.exercises.map(exercise => (
                    <ExerciseCard 
                      key={exercise.id} 
                      exercise={exercise} 
                      onStart={() => handleStartExercise(exercise)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-2">
                  {/* Exercise Instructions */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{activeExercise.title}</CardTitle>
                          <CardDescription className="text-blue-200">{activeExercise.description}</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveExercise(null)}
                          className="border-white/30 text-white"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to List
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RichContentRenderer content={activeExercise.instructions} />
                      
                      {hintsShown > 0 && (
                        <div className="mt-6 space-y-3">
                          <h4 className="font-medium text-yellow-400">Hints:</h4>
                          {activeExercise.hints.slice(0, hintsShown).map((hint, index) => (
                            <div key={index} className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Lightbulb className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-medium text-yellow-400">Hint {index + 1}</span>
                              </div>
                              <p className="text-yellow-200 text-sm">{hint}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Code Editor */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Code Editor
                        </CardTitle>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleReset} className="border-white/30 text-white">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reset
                          </Button>
                          
                          {activeExercise.solution && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowSolution(!showSolution)}
                              className="border-white/30 text-white"
                            >
                              {showSolution ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                              Solution
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm" onClick={handleGetHint} className="border-yellow-400 text-yellow-400">
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Hint ({hintsShown}/{activeExercise.hints.length})
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <Textarea
                        ref={codeEditorRef}
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="// Begin your divine coding journey here..."
                        className="min-h-[300px] font-mono text-sm border-none resize-none focus:ring-0 bg-gray-900 text-green-400"
                        style={{
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                          lineHeight: '1.5',
                          tabSize: 2
                        }}
                      />
                      
                      {showSolution && activeExercise.solution && (
                        <div className="border-t bg-gray-800/50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Solution</span>
                          </div>
                          <pre className="text-sm font-mono bg-gray-900 text-green-300 p-3 rounded border overflow-x-auto">
                            {activeExercise.solution}
                          </pre>
                        </div>
                      )}
                      
                      <div className="border-t p-4">
                        <Button
                          onClick={handleCodeSubmit}
                          disabled={executing || !userCode.trim()}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          size="lg"
                        >
                          {executing ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Zap className="h-5 w-5 mr-2" />
                          )}
                          {executing ? 'Executing Divine Code...' : 'Execute & Submit'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Results Panel */}
                  {feedback.length > 0 && (
                    <Card className="xl:col-span-2 bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          Exercise Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {feedback.map((msg, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg text-sm ${
                                msg.startsWith('✅') || msg.startsWith('🏆')
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                  : msg.startsWith('❌')
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {msg}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mentor" className="mt-6">
              <Card className="bg-gradient-to-r from-purple-500/20 to-blue-600/20 border-purple-400/30">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{workshopData.aiMentor.avatar}</div>
                    <div>
                      <CardTitle className="text-2xl text-white">{workshopData.aiMentor.name}</CardTitle>
                      <CardDescription className="text-purple-200">{workshopData.aiMentor.personality}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Expertise Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {workshopData.aiMentor.expertise.map(skill => (
                          <Badge key={skill} variant="outline" className="border-purple-400 text-purple-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-3">Special Abilities</h4>
                      <ul className="space-y-1">
                        {workshopData.aiMentor.specialAbilities.map(ability => (
                          <li key={ability} className="text-purple-200 text-sm flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-400" />
                            {ability}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
                    <h4 className="font-semibold text-white mb-2">Encouragement for Your Journey</h4>
                    <p className="text-purple-200 italic">
                      "{workshopData.aiMentor.encouragementMessages[0]}"
                    </p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start AI Mentoring Session
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="narrative" className="mt-6">
              <Card className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-400/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Scroll className="h-8 w-8 text-amber-400" />
                    <div>
                      <CardTitle className="text-2xl text-white">{workshopData.sacredNarrative.title}</CardTitle>
                      <CardDescription className="text-amber-200">
                        Featuring: {workshopData.sacredNarrative.character}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <RichContentRenderer content={workshopData.sacredNarrative.content} />
                  </div>
                  
                  <div className="mt-8 p-4 bg-amber-500/20 rounded-lg border border-amber-400/30">
                    <h4 className="font-semibold text-amber-300 mb-2">Sacred Lesson</h4>
                    <p className="text-amber-200">{workshopData.sacredNarrative.lesson}</p>
                    {workshopData.sacredNarrative.biblicalReference && (
                      <p className="text-amber-300 text-sm mt-2 italic">
                        Reference: {workshopData.sacredNarrative.biblicalReference}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>



        </div>
      </div>
    </div>
  )
}