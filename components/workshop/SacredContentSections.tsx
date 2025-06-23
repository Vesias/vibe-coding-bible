'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AIMentorChat } from '@/components/ai/AIMentorChat'
import { SacredProgress } from '@/components/ui/sacred-progress'
import { 
  BookOpen, 
  PlayCircle, 
  Code,
  Target,
  Users,
  Trophy,
  Lightbulb,
  CheckCircle,
  Star,
  Flame,
  Zap,
  Award,
  Crown,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkshopData {
  id: string
  title: string
  content: string
  exercises: string[]
  mentor: string
}

interface Exercise {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  completed: boolean
  code?: string
  solution?: string
  hints: string[]
}

interface SacredContentSectionsProps {
  workshop: WorkshopData
  activeTab: string
  exercises?: Exercise[]
  userProgress?: {
    completedExercises: string[]
    hintsUsed: Record<string, number>
  }
}

export function SacredContentSections({
  workshop,
  activeTab,
  exercises = [],
  userProgress = { completedExercises: [], hintsUsed: {} }
}: SacredContentSectionsProps) {
  return (
    <AnimatePresence mode="wait">
      {activeTab === 'content' && (
        <SacredTextContent key="content" workshop={workshop} />
      )}
      {activeTab === 'exercises' && (
        <DivineTasksContent key="exercises" exercises={exercises} userProgress={userProgress} />
      )}
      {activeTab === 'mentor' && (
        <AIGuideContent key="mentor" workshop={workshop} />
      )}
      {activeTab === 'progress' && (
        <MasteryContent key="progress" workshop={workshop} exercises={exercises} userProgress={userProgress} />
      )}
    </AnimatePresence>
  )
}

// Sacred Text Content Component
function SacredTextContent({ workshop }: { workshop: WorkshopData }) {
  const renderMarkdownContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <motion.h1 
            key={index} 
            className="text-3xl font-bold mb-6 bg-gradient-to-r from-sacred-gold via-white to-sacred-purple bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {line.slice(2)}
          </motion.h1>
        )
      } else if (line.startsWith('## ')) {
        return (
          <motion.h2 
            key={index} 
            className="text-2xl font-semibold mb-4 text-sacred-gold mt-8 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Sparkles className="h-6 w-6" />
            {line.slice(3)}
          </motion.h2>
        )
      } else if (line.startsWith('### ')) {
        return (
          <motion.h3 
            key={index} 
            className="text-xl font-semibold mb-3 text-blue-200 mt-6 flex items-center gap-2"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Star className="h-5 w-5 text-sacred-purple" />
            {line.slice(4)}
          </motion.h3>
        )
      } else if (line.startsWith('```')) {
        return (
          <motion.div 
            key={index} 
            className="bg-black/60 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto my-6 border border-green-400/20 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.02 }}
          >
            <code>{line.slice(3)}</code>
          </motion.div>
        )
      } else if (line.trim()) {
        return (
          <motion.p 
            key={index} 
            className="mb-4 text-blue-100 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            {line}
          </motion.p>
        )
      }
      return <br key={index} />
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30 hover:border-sacred-gold/50 transition-all duration-300">
        <CardContent className="p-8">
          <ScrollArea className="h-[600px] pr-4">
            <div className="prose prose-lg prose-invert max-w-none">
              {renderMarkdownContent(workshop.content)}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Divine Tasks Content Component
function DivineTasksContent({ 
  exercises, 
  userProgress 
}: { 
  exercises: Exercise[]
  userProgress: { completedExercises: string[], hintsUsed: Record<string, number> }
}) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(exercises[0] || null)
  const [userCode, setUserCode] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [hintsShown, setHintsShown] = useState(0)
  const [executing, setExecuting] = useState(false)

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return { color: 'text-green-400', bg: 'bg-green-400/20', icon: Star }
      case 'medium': return { color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: Trophy }
      case 'hard': return { color: 'text-red-400', bg: 'bg-red-400/20', icon: Crown }
      default: return { color: 'text-blue-400', bg: 'bg-blue-400/20', icon: Star }
    }
  }

  const handleExecuteCode = async () => {
    setExecuting(true)
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 2000))
    setExecuting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* Exercise List */}
      <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-sacred-purple" />
            Divine Challenges
          </CardTitle>
          <CardDescription className="text-blue-200">
            Complete these sacred coding tasks to advance your mastery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exercises.map((exercise, index) => {
              const difficultyConfig = getDifficultyConfig(exercise.difficulty)
              const DifficultyIcon = difficultyConfig.icon
              const isCompleted = userProgress.completedExercises.includes(exercise.id)
              
              return (
                <motion.div
                  key={exercise.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-300",
                    selectedExercise?.id === exercise.id 
                      ? "bg-sacred-gold/10 border-sacred-gold/40" 
                      : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30",
                    isCompleted && "ring-2 ring-green-400/30"
                  )}
                  onClick={() => setSelectedExercise(exercise)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sacred-purple/20 flex items-center justify-center text-sacred-purple font-semibold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-medium text-white">{exercise.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-400" />}
                      <Badge className={cn("text-xs", difficultyConfig.bg, difficultyConfig.color)}>
                        <DifficultyIcon className="h-3 w-3 mr-1" />
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-blue-200 mb-2">{exercise.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sacred-gold flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {exercise.xpReward} XP
                    </span>
                    <span className="text-blue-300">
                      {userProgress.hintsUsed[exercise.id] || 0} hints used
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Workspace */}
      {selectedExercise && (
        <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="h-5 w-5 text-sacred-gold" />
                {selectedExercise.title}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setUserCode('')}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                {selectedExercise.solution && (
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
          <CardContent className="space-y-4">
            {/* Code Editor */}
            <div className="relative">
              <Textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="// Begin your divine coding journey here..."
                className="min-h-[300px] font-mono text-sm bg-black/60 border-sacred-gold/30 text-green-400 resize-none"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  lineHeight: '1.5'
                }}
              />
            </div>

            {/* Solution Panel */}
            {showSolution && selectedExercise.solution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Divine Solution</span>
                </div>
                <pre className="text-sm font-mono text-blue-300 overflow-x-auto">
                  {selectedExercise.solution}
                </pre>
              </motion.div>
            )}

            {/* Hints */}
            {selectedExercise.hints.length > 0 && (
              <div className="space-y-2">
                {selectedExercise.hints.slice(0, hintsShown).map((hint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Divine Hint {index + 1}</span>
                    </div>
                    <p className="text-sm text-yellow-300">{hint}</p>
                  </motion.div>
                ))}
                
                {hintsShown < selectedExercise.hints.length && (
                  <Button
                    onClick={() => setHintsShown(prev => prev + 1)}
                    variant="outline"
                    size="sm"
                    className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Reveal Next Hint ({hintsShown + 1}/{selectedExercise.hints.length})
                  </Button>
                )}
              </div>
            )}

            {/* Execute Button */}
            <Button
              onClick={handleExecuteCode}
              disabled={executing || !userCode.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              size="lg"
            >
              {executing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Executing Divine Code...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Execute & Submit
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

// AI Guide Content Component
function AIGuideContent({ workshop }: { workshop: WorkshopData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-sacred-gold" />
            Divine AI Mentor: {workshop.mentor}
          </CardTitle>
          <CardDescription className="text-blue-200">
            Receive personalized guidance from your sacred coding mentor
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AIMentorChat 
            initialContext={{
              workshopId: workshop.id,
              language: 'typescript'
            }}
            className="border-0 bg-transparent"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Mastery Content Component
function MasteryContent({ 
  workshop, 
  exercises, 
  userProgress 
}: { 
  workshop: WorkshopData
  exercises: Exercise[]
  userProgress: { completedExercises: string[], hintsUsed: Record<string, number> }
}) {
  const completedCount = userProgress.completedExercises.length
  const totalCount = exercises.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const totalXP = exercises.reduce((sum, ex) => sum + ex.xpReward, 0)
  const earnedXP = exercises
    .filter(ex => userProgress.completedExercises.includes(ex.id))
    .reduce((sum, ex) => sum + ex.xpReward, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Mastery Overview */}
      <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="h-5 w-5 text-sacred-gold" />
            Mastery Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <motion.div
              className="text-6xl font-bold bg-gradient-to-r from-sacred-gold to-sacred-purple bg-clip-text text-transparent mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {Math.round(completionPercentage)}%
            </motion.div>
            <p className="text-blue-200">Sacred Mastery Achieved</p>
          </div>
          
          <SacredProgress value={completionPercentage} variant="divine" showLabel={false} />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-sacred-gold/10 rounded-lg p-4 border border-sacred-gold/20">
              <div className="text-2xl font-bold text-sacred-gold">{earnedXP}</div>
              <div className="text-xs text-blue-300">XP Earned</div>
            </div>
            <div className="bg-sacred-purple/10 rounded-lg p-4 border border-sacred-purple/20">
              <div className="text-2xl font-bold text-sacred-purple">{completedCount}/{totalCount}</div>
              <div className="text-xs text-blue-300">Tasks Done</div>
            </div>
            <div className="bg-blue-400/10 rounded-lg p-4 border border-blue-400/20">
              <div className="text-2xl font-bold text-blue-400">{Object.keys(userProgress.hintsUsed).length}</div>
              <div className="text-xs text-blue-300">Hints Used</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-sacred-purple" />
            Sacred Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Achievement examples */}
            <motion.div
              className={cn(
                "p-4 rounded-lg border text-center",
                completedCount > 0 ? "bg-green-400/10 border-green-400/30" : "bg-gray-400/10 border-gray-400/30 opacity-50"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className={cn("h-8 w-8 mx-auto mb-2", completedCount > 0 ? "text-green-400" : "text-gray-400")} />
              <div className="text-xs font-medium">First Steps</div>
              <div className="text-xs text-blue-300">Complete 1 task</div>
            </motion.div>
            
            <motion.div
              className={cn(
                "p-4 rounded-lg border text-center",
                completionPercentage >= 50 ? "bg-yellow-400/10 border-yellow-400/30" : "bg-gray-400/10 border-gray-400/30 opacity-50"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <Star className={cn("h-8 w-8 mx-auto mb-2", completionPercentage >= 50 ? "text-yellow-400" : "text-gray-400")} />
              <div className="text-xs font-medium">Half Way</div>
              <div className="text-xs text-blue-300">50% completion</div>
            </motion.div>
            
            <motion.div
              className={cn(
                "p-4 rounded-lg border text-center",
                completionPercentage >= 100 ? "bg-sacred-gold/10 border-sacred-gold/30" : "bg-gray-400/10 border-gray-400/30 opacity-50"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <Crown className={cn("h-8 w-8 mx-auto mb-2", completionPercentage >= 100 ? "text-sacred-gold" : "text-gray-400")} />
              <div className="text-xs font-medium">Master</div>
              <div className="text-xs text-blue-300">100% mastery</div>
            </motion.div>
            
            <motion.div
              className={cn(
                "p-4 rounded-lg border text-center",
                Object.keys(userProgress.hintsUsed).length === 0 && completedCount > 0 ? "bg-sacred-purple/10 border-sacred-purple/30" : "bg-gray-400/10 border-gray-400/30 opacity-50"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <Flame className={cn("h-8 w-8 mx-auto mb-2", Object.keys(userProgress.hintsUsed).length === 0 && completedCount > 0 ? "text-sacred-purple" : "text-gray-400")} />
              <div className="text-xs font-medium">No Hints</div>
              <div className="text-xs text-blue-300">Zero hints used</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}