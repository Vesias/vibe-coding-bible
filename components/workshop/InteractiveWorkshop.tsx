'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { useWorkshopEngine, WorkshopStep, StepProgress } from '@/lib/workshop/engine'
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
  MessageCircle
} from 'lucide-react'

interface InteractiveWorkshopProps {
  workshopId: string
  className?: string
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

  const [userCode, setUserCode] = useState('')
  const [executing, setExecuting] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [hintsShown, setHintsShown] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'instructions' | 'narrative' | 'hints' | 'tests'>('instructions')
  const [lastResult, setLastResult] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load workshop on mount
  useEffect(() => {
    if (user && workshopId) {
      loadWorkshop(workshopId, user.id)
    }
  }, [workshopId, user, loadWorkshop])

  // Initialize code editor with starter code
  useEffect(() => {
    if (currentStep && currentStep.content && !userCode) {
      setUserCode(currentStep.content)
    }
  }, [currentStep])

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
    if (!currentStep || !user || !userCode.trim()) return

    setExecuting(true)
    setFeedback([])

    try {
      const result = await submitCode(currentStep.id, userCode, user.id)
      
      setLastResult(result)
      setFeedback(result.feedback)

      if (result.passed) {
        toast({
          title: "Divine Success! ✨",
          description: `Challenge completed with ${result.score}% mastery. ${result.newStepProgress.status === 'mastered' ? 'Perfect mastery achieved!' : ''}`
        })
        
        // Auto-advance if completed
        if (result.passed) {
          setTimeout(() => {
            // Logic to move to next step would be handled by the engine
          }, 2000)
        }
      } else {
        toast({
          title: "Keep Seeking 📖",
          description: "Review the feedback and try again. Every attempt brings you closer to enlightenment.",
          variant: "default"
        })
      }

    } catch (error) {
      console.error('Error submitting code:', error)
      toast({
        title: "Execution Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setExecuting(false)
    }
  }

  const handleGetHint = () => {
    if (!currentStep) return

    const hint = getHint(currentStep.id, hintsShown)
    if (hint) {
      setHintsShown(prev => prev + 1)
      setActiveTab('hints')
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
    if (currentStep?.content) {
      setUserCode(currentStep.content)
      setHintsShown(0)
      setShowSolution(false)
      setFeedback([])
      setLastResult(null)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
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

  const getStepProgress = (): StepProgress | null => {
    if (!progress || !currentStep) return null
    return progress.stepProgress[currentStep.id] || null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your divine workshop...</p>
        </div>
      </div>
    )
  }

  if (!workshop || !currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Workshop Not Found</h3>
            <p className="text-muted-foreground">The requested workshop could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stepProgress = getStepProgress()
  const StepIcon = getStepIcon(currentStep.type)

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 ${className}`}>
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
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <StepIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{workshop.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Commandment {workshop.commandmentNumber} • Step {(progress?.currentStep || 0) + 1} of {workshop.steps.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge className={getDifficultyColor(workshop.difficulty)}>
                  {workshop.difficulty}
                </Badge>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeSpent)}
                </div>

                {stepProgress && (
                  <Badge variant={stepProgress.status === 'mastered' ? 'default' : 'outline'}>
                    {stepProgress.status === 'mastered' && <Crown className="h-3 w-3 mr-1" />}
                    {stepProgress.bestScore}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Workshop Progress</span>
                <span>{progress?.completedSteps.length || 0}/{workshop.steps.length} completed</span>
              </div>
              <Progress 
                value={((progress?.completedSteps.length || 0) / workshop.steps.length) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column - Instructions and Content */}
            <div className="space-y-6">
              {/* Step Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StepIcon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{currentStep.title}</CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        {currentStep.xpReward} XP
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        ~{currentStep.timeEstimate}min
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{currentStep.description}</CardDescription>
                </CardHeader>
              </Card>

              {/* Content Tabs */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex gap-1 bg-muted p-1 rounded-lg">
                    {[
                      { id: 'instructions', label: 'Instructions', icon: BookOpen },
                      { id: 'narrative', label: 'Divine Story', icon: Scroll },
                      { id: 'hints', label: 'Guidance', icon: Lightbulb, badge: hintsShown },
                      { id: 'tests', label: 'Tests', icon: Target, badge: currentStep.tests?.length || 0 }
                    ].map(tab => {
                      const Icon = tab.icon
                      return (
                        <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveTab(tab.id as any)}
                          className="flex-1"
                        >
                          <Icon className="h-4 w-4 mr-1" />
                          {tab.label}
                          {tab.badge !== undefined && tab.badge > 0 && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              {tab.badge}
                            </Badge>
                          )}
                        </Button>
                      )
                    })}
                  </div>
                </CardHeader>

                <CardContent className="min-h-[300px]">
                  {activeTab === 'instructions' && (
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: currentStep.content }} />
                    </div>
                  )}

                  {activeTab === 'narrative' && (
                    <div className="space-y-4">
                      {currentStep.biblicalNarrative ? (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200/50">
                          <div className="flex items-center gap-2 mb-3">
                            <Scroll className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-purple-800 dark:text-purple-200">
                              Sacred Coding Wisdom
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none text-purple-700 dark:text-purple-300">
                            <div dangerouslySetInnerHTML={{ __html: currentStep.biblicalNarrative }} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Scroll className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No divine narrative available for this step</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'hints' && (
                    <div className="space-y-4">
                      {currentStep.hints.slice(0, hintsShown).map((hint, index) => (
                        <div
                          key={index}
                          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/50"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800 dark:text-yellow-200">
                              Hint {index + 1}
                            </span>
                          </div>
                          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                            {hint}
                          </p>
                        </div>
                      ))}

                      {hintsShown < currentStep.hints.length && (
                        <Button
                          onClick={handleGetHint}
                          variant="outline"
                          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Reveal Next Hint ({hintsShown + 1}/{currentStep.hints.length})
                        </Button>
                      )}

                      {hintsShown === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Click the button above to receive divine guidance</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tests' && (
                    <div className="space-y-4">
                      {currentStep.tests && currentStep.tests.length > 0 ? (
                        currentStep.tests.map((test, index) => (
                          <div
                            key={index}
                            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800 dark:text-blue-200">
                                {test.name}
                              </span>
                              {lastResult?.result.tests && (
                                <Badge 
                                  variant={lastResult.result.tests[index]?.passed ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {lastResult.result.tests[index]?.passed ? 'PASS' : 'FAIL'}
                                </Badge>
                              )}
                            </div>
                            {!test.hidden && (
                              <p className="text-blue-700 dark:text-blue-300 text-sm font-mono">
                                Expected: {JSON.stringify(test.expected)}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No tests available for this step</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Code Editor and Results */}
            <div className="space-y-6">
              {/* Code Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Sacred Code Editor
                    </CardTitle>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      
                      {currentStep.solution && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSolution(!showSolution)}
                        >
                          {showSolution ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                          Solution
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="relative">
                    <Textarea
                      ref={codeEditorRef}
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="// Begin your divine coding journey here..."
                      className="min-h-[400px] font-mono text-sm border-none resize-none focus:ring-0"
                      style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        lineHeight: '1.5',
                        tabSize: 2
                      }}
                    />
                  </div>

                  {showSolution && currentStep.solution && (
                    <div className="border-t bg-muted/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Solution</span>
                      </div>
                      <pre className="text-sm font-mono bg-background p-3 rounded border overflow-x-auto">
                        {currentStep.solution}
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
              {(lastResult || feedback.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {lastResult?.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      Execution Results
                      {lastResult && (
                        <Badge 
                          variant={lastResult.passed ? 'default' : 'secondary'}
                          className="ml-auto"
                        >
                          {lastResult.score}%
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Feedback */}
                    {feedback.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Divine Feedback:</h4>
                        {feedback.map((msg, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg text-sm ${
                              msg.startsWith('✅') || msg.startsWith('🏆') || msg.startsWith('⭐')
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : msg.startsWith('❌') || msg.startsWith('⚠️')
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {msg}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Output */}
                    {lastResult?.result.output && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Output:</h4>
                        <pre className="bg-black text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                          {lastResult.result.output}
                        </pre>
                      </div>
                    )}

                    {/* Logs */}
                    {lastResult?.result.logs && lastResult.result.logs.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Console:</h4>
                        <div className="bg-gray-900 text-gray-300 p-3 rounded text-xs font-mono space-y-1 max-h-32 overflow-y-auto">
                          {lastResult.result.logs.map((log: any, index: number) => (
                            <div key={index}>{log}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Execution Stats */}
                    {lastResult?.result && (
                      <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                        <span>Execution time: {lastResult.result.executionTime.toFixed(0)}ms</span>
                        <span>Exit code: {lastResult.result.exitCode}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step Navigation */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      disabled={(progress?.currentStep || 0) === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Step {(progress?.currentStep || 0) + 1} of {workshop.steps.length}
                      </div>
                      {stepProgress?.status === 'completed' && (
                        <Badge className="mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      disabled={
                        (progress?.currentStep || 0) >= workshop.steps.length - 1 ||
                        stepProgress?.status !== 'completed'
                      }
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}