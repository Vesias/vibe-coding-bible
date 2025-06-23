'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SacredWorkshopLayout } from './SacredWorkshopLayout'
import { SacredContentSections } from './SacredContentSections'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { workshops, type WorkshopData, type WorkshopExercise, type AIMentor } from '@/lib/workshop/workshop-data'
import { 
  BookOpen, 
  Code,
  Users,
  Trophy,
  Sparkles,
  Crown,
  Star,
  Target,
  Award,
  Brain,
  Scroll,
  Play,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Shield,
  MessageCircle
} from 'lucide-react'

interface UserProgress {
  completed: boolean
  xpEarned: number
  exercisesCompleted: number
  totalExercises: number
  completionPercentage: number
  completedExercises: string[]
  hintsUsed: Record<string, number>
}

interface SacredInteractiveWorkshopProps {
  workshopId: string
  className?: string
}

export function SacredInteractiveWorkshop({ 
  workshopId, 
  className = '' 
}: SacredInteractiveWorkshopProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [workshop, setWorkshop] = useState<WorkshopData | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completed: false,
    xpEarned: 0,
    exercisesCompleted: 0,
    totalExercises: 3,
    completionPercentage: 0,
    completedExercises: [],
    hintsUsed: {}
  })
  const [loading, setLoading] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

  // Load workshop data from the comprehensive data file
  useEffect(() => {
    const currentWorkshop = workshops.find(w => w.id === `commandment-${workshopId}`)
    if (currentWorkshop) {
      setWorkshop(currentWorkshop)
      setUserProgress(prev => ({
        ...prev,
        totalExercises: currentWorkshop.exercises.length,
        completionPercentage: (prev.exercisesCompleted / currentWorkshop.exercises.length) * 100
      }))
    }
    setLoading(false)
  }, [workshopId])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleExerciseComplete = (exerciseId: string) => {
    setUserProgress(prev => {
      const newCompleted = [...prev.completedExercises, exerciseId]
      return {
        ...prev,
        exercisesCompleted: newCompleted.length,
        completedExercises: newCompleted,
        completionPercentage: (newCompleted.length / prev.totalExercises) * 100,
        xpEarned: prev.xpEarned + (workshop?.exercises.find(e => e.id === exerciseId)?.xpReward || 0)
      }
    })
  }

  const RichContentRenderer = ({ content, className = '' }: { content: string, className?: string }) => {
    const renderContent = (text: string) => {
      return text.split('\n').map((line, index) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-bold mb-6 text-white font-sacred">
              {line.slice(2)}
            </h1>
          )
        } else if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-semibold mb-4 text-sacred-gold mt-8 flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              {line.slice(3)}
            </h2>
          )
        } else if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-semibold mb-3 text-blue-200 mt-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-sacred-purple" />
              {line.slice(4)}
            </h3>
          )
        } else if (line.trim().startsWith('```')) {
          return null // Handle code blocks separately
        } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <li key={index} className="mb-2 text-blue-100 leading-relaxed">
              {line.slice(2)}
            </li>
          )
        } else if (line.trim()) {
          return (
            <p key={index} className="mb-4 text-blue-100 leading-relaxed">
              {line}
            </p>
          )
        }
        return <br key={index} />
      })
    }

    return (
      <div className={`prose prose-lg prose-invert max-w-none ${className}`}>
        {renderContent(content)}
      </div>
    )
  }

  if (loading || !workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Crown className="h-16 w-16 text-sacred-gold mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Loading Sacred Workshop...</h2>
          <p className="text-blue-200">Preparing your divine learning experience</p>
        </motion.div>
      </div>
    )
  }

  const currentIndex = workshops.findIndex(w => w.id === workshop?.id)
  const prevWorkshop = currentIndex > 0 ? workshops[currentIndex - 1] : undefined
  const nextWorkshop = currentIndex < workshops.length - 1 ? workshops[currentIndex + 1] : undefined

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Workshop Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sacred-gold to-sacred-purple flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{workshop.commandmentNumber}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-sacred mb-2">{workshop.title}</h1>
              <p className="text-xl text-blue-200">{workshop.subtitle}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge className="bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-400 border-green-500/30">
              {workshop.difficulty}
            </Badge>
            <Badge className="bg-gradient-to-r from-sacred-gold/20 to-sacred-gold/20 text-sacred-gold border-sacred-gold/30">
              <Star className="w-4 h-4 mr-1" />
              {workshop.xpReward} XP
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-400 border-blue-500/30">
              <Clock className="w-4 h-4 mr-1" />
              {workshop.estimatedTime} min
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-200">
              <span>Progress</span>
              <span>{userProgress.completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress 
              value={userProgress.completionPercentage} 
              className="h-3 bg-slate-800"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-sacred-gold/20">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="theory" className="data-[state=active]:bg-sacred-purple/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Theory
            </TabsTrigger>
            <TabsTrigger value="exercises" className="data-[state=active]:bg-green-500/20">
              <Code className="w-4 h-4 mr-2" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="mentor" className="data-[state=active]:bg-blue-500/20">
              <Brain className="w-4 h-4 mr-2" />
              AI Mentor
            </TabsTrigger>
            <TabsTrigger value="narrative" className="data-[state=active]:bg-orange-500/20">
              <Scroll className="w-4 h-4 mr-2" />
              Narrative
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-sacred-gold" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workshop.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-100">{objective}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-sacred-purple" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sacred-gold">{userProgress.xpEarned}</div>
                      <div className="text-sm text-blue-200">XP Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{userProgress.exercisesCompleted}/{userProgress.totalExercises}</div>
                      <div className="text-sm text-blue-200">Exercises</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('exercises')} 
                    className="w-full bg-gradient-to-r from-sacred-gold to-sacred-purple hover:from-sacred-gold/80 hover:to-sacred-purple/80"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Exercises
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichContentRenderer content={workshop.introduction} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border border-white/20">
                <CardContent className="p-8">
                  <RichContentRenderer content={workshop.theory} />
                  
                  {workshop.practicalGuide && (
                    <div className="mt-8 pt-8 border-t border-white/20">
                      <h2 className="text-2xl font-semibold mb-4 text-sacred-gold flex items-center gap-2">
                        <Zap className="w-6 h-6" />
                        Practical Guide
                      </h2>
                      <RichContentRenderer content={workshop.practicalGuide} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {workshop.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isCompleted={userProgress.completedExercises.includes(exercise.id)}
                  onComplete={() => handleExerciseComplete(exercise.id)}
                  onSelect={() => setSelectedExercise(exercise.id)}
                  isSelected={selectedExercise === exercise.id}
                />
              ))}
            </motion.div>
          </TabsContent>

          {/* AI Mentor Tab */}
          <TabsContent value="mentor" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AIMentorInterface mentor={workshop.aiMentor} workshopContext={workshop} />
            </motion.div>
          </TabsContent>

          {/* Sacred Narrative Tab */}
          <TabsContent value="narrative" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SacredNarrativeSection narrative={workshop.sacredNarrative} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Exercise Card Component
function ExerciseCard({ 
  exercise, 
  isCompleted, 
  onComplete, 
  onSelect, 
  isSelected 
}: {
  exercise: WorkshopExercise
  isCompleted: boolean
  onComplete: () => void
  onSelect: () => void
  isSelected: boolean
}) {
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-sm border transition-all duration-300 ${
      isSelected ? 'border-sacred-gold/50 shadow-lg shadow-sacred-gold/20' : 'border-white/20 hover:border-white/30'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-500' : 'bg-gray-600'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white font-bold">{exercise.id.split('-').pop()}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-white">{exercise.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
                <Badge className="bg-sacred-gold/20 text-sacred-gold border-sacred-gold/30">
                  <Star className="w-3 h-3 mr-1" />
                  {exercise.xpReward} XP
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.timeEstimate} min
                </Badge>
              </div>
            </div>
          </div>
          <Button
            onClick={onSelect}
            variant={isSelected ? 'default' : 'outline'}
            className={isSelected ? 'bg-sacred-gold hover:bg-sacred-gold/80' : ''}
          >
            {isSelected ? 'Working' : 'Start'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-blue-100 mb-4">{exercise.description}</p>
        
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Instructions:</h4>
              <div className="text-sm text-blue-100 whitespace-pre-wrap">
                {exercise.instructions}
              </div>
            </div>

            {exercise.starterCode && (
              <div className="bg-black/60 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Starter Code:</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{exercise.starterCode}</code>
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setShowHints(!showHints)}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
              
              {exercise.solution && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Solution
                </Button>
              )}
              
              <Button
                onClick={onComplete}
                className="bg-green-500 hover:bg-green-600"
                size="sm"
                disabled={isCompleted}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>

            {showHints && exercise.hints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30"
              >
                <h4 className="text-white font-semibold mb-2">Hint {currentHint + 1}/{exercise.hints.length}:</h4>
                <p className="text-blue-100 mb-3">{exercise.hints[currentHint]}</p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentHint(Math.max(0, currentHint - 1))}
                    disabled={currentHint === 0}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentHint(Math.min(exercise.hints.length - 1, currentHint + 1))}
                    disabled={currentHint === exercise.hints.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

// AI Mentor Interface Component
function AIMentorInterface({ mentor, workshopContext }: { mentor: AIMentor, workshopContext: WorkshopData }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'mentor', content: string }>>([{
    role: 'mentor',
    content: mentor.greetingMessage
  }])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage
    setInputMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate AI response (in real implementation, this would call Claude API)
    setTimeout(() => {
      const encouragement = mentor.encouragementMessages[Math.floor(Math.random() * mentor.encouragementMessages.length)]
      setMessages(prev => [...prev, { role: 'mentor', content: encouragement }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-white/20 h-[600px] flex flex-col">
      <CardHeader className="border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{mentor.avatar}</div>
          <div>
            <CardTitle className="text-white">{mentor.name}</CardTitle>
            <p className="text-blue-200 text-sm">{mentor.personality}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {mentor.expertise.map((skill, index) => (
            <Badge key={index} className="bg-sacred-purple/20 text-sacred-purple border-sacred-purple/30">
              {skill}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-sacred-gold text-black' 
                  : 'bg-slate-700 text-white border border-white/20'
              }`}>
                {message.content}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-slate-700 text-white border border-white/20 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your AI mentor for guidance..."
            className="flex-1 bg-slate-800 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sacred-gold/50"
          />
          <Button onClick={sendMessage} className="bg-sacred-gold hover:bg-sacred-gold/80">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Sacred Narrative Section Component
function SacredNarrativeSection({ narrative }: { narrative: typeof workshops[0]['sacredNarrative'] }) {
  return (
    <Card className="bg-gradient-to-br from-black/60 to-purple-900/40 backdrop-blur-sm border border-sacred-purple/30">
      <CardHeader>
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">📜</div>
          <CardTitle className="text-2xl font-sacred text-sacred-gold">{narrative.title}</CardTitle>
          <p className="text-purple-200">A sacred tale from {narrative.character}</p>
          {narrative.biblicalReference && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {narrative.biblicalReference}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg prose-invert max-w-none"
        >
          <div className="bg-black/40 rounded-lg p-6 border border-sacred-purple/20">
            <div className="text-purple-100 leading-relaxed whitespace-pre-wrap font-serif italic">
              {narrative.content}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-sacred-gold/10 to-sacred-purple/10 rounded-lg p-6 border border-sacred-gold/20"
        >
          <h3 className="text-xl font-semibold text-sacred-gold mb-3 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Divine Lesson
          </h3>
          <p className="text-white leading-relaxed font-medium">
            {narrative.lesson}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
}