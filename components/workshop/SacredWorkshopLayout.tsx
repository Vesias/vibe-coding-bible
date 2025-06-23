'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SacredProgress } from '@/components/ui/sacred-progress'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
import { 
  BookOpen, 
  PlayCircle, 
  Trophy, 
  Clock, 
  Users, 
  Code,
  Target,
  Star,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Crown,
  Sparkles,
  Flame,
  Eye,
  Lightbulb,
  Award,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkshopData {
  id: string
  title: string
  subtitle: string
  difficulty: string
  xp: number
  duration: string
  description: string
  content: string
  exercises: string[]
  mentor: string
  commandmentNumber: number
}

interface SacredWorkshopLayoutProps {
  workshop: WorkshopData
  currentIndex: number
  totalWorkshops: number
  prevWorkshop?: WorkshopData
  nextWorkshop?: WorkshopData
  userProgress?: {
    completed: boolean
    xpEarned: number
    exercisesCompleted: number
    totalExercises: number
    completionPercentage: number
  }
  onTabChange?: (tab: string) => void
  children?: React.ReactNode
}

export function SacredWorkshopLayout({
  workshop,
  currentIndex,
  totalWorkshops,
  prevWorkshop,
  nextWorkshop,
  userProgress = {
    completed: false,
    xpEarned: 0,
    exercisesCompleted: 0,
    totalExercises: 3,
    completionPercentage: 25
  },
  onTabChange,
  children
}: SacredWorkshopLayoutProps) {
  const [activeTab, setActiveTab] = useState('content')
  const [isHovered, setIsHovered] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return { color: 'text-green-400', bg: 'bg-green-400/20', icon: Star }
      case 'intermediate':
        return { color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: Trophy }
      case 'advanced':
        return { color: 'text-red-400', bg: 'bg-red-400/20', icon: Crown }
      default:
        return { color: 'text-blue-400', bg: 'bg-blue-400/20', icon: Star }
    }
  }

  const difficultyConfig = getDifficultyConfig(workshop.difficulty)
  const DifficultyIcon = difficultyConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <SacredGeometry 
          pattern="golden-spiral" 
          className="absolute top-1/4 right-1/4 opacity-[0.03] scale-150 text-sacred-gold" 
        />
        <SacredGeometry 
          pattern="vesica-piscis" 
          className="absolute bottom-1/4 left-1/4 opacity-[0.03] scale-75 text-sacred-purple" 
        />
        <SacredGeometry 
          pattern="flower-of-life" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-200 text-sacred-gold" 
        />
      </div>

      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sacred-gold/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Sacred Header */}
        <motion.div 
          className="bg-black/20 backdrop-blur-md border-b border-sacred-gold/20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-sacred-gold/20 to-sacred-purple/20 rounded-xl border border-sacred-gold/30 backdrop-blur-sm">
                    <Crown className="h-8 w-8 text-sacred-gold" />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-sacred-gold/10 to-sacred-purple/10 rounded-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <motion.h1 
                    className="text-3xl font-bold bg-gradient-to-r from-sacred-gold via-white to-sacred-purple bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {workshop.title}
                  </motion.h1>
                  <motion.p 
                    className="text-blue-200 text-lg mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {workshop.subtitle}
                  </motion.p>
                  <motion.div 
                    className="flex items-center gap-2 mt-2 text-sm text-blue-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Commandment {workshop.commandmentNumber} • Sacred Learning Path
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Badge className={cn("px-3 py-1", difficultyConfig.bg, difficultyConfig.color, "border border-current/30")}>
                  <DifficultyIcon className="h-3 w-3 mr-1" />
                  {workshop.difficulty}
                </Badge>
                
                <div className="flex items-center gap-2 text-sm text-blue-200 bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Clock className="h-4 w-4" />
                  {workshop.duration}
                </div>

                <div className="flex items-center gap-2 text-sm text-sacred-gold bg-sacred-gold/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-sacred-gold/20">
                  <Award className="h-4 w-4" />
                  {workshop.xp} XP
                </div>
              </motion.div>
            </div>

            {/* Sacred Progress Bar */}
            <motion.div 
              ref={progressRef}
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between text-sm text-blue-200 mb-3">
                <span className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-sacred-gold" />
                  Divine Progress
                </span>
                <span>{currentIndex + 1}/{totalWorkshops} Commandments</span>
              </div>
              <SacredProgress 
                value={((currentIndex + 1) / totalWorkshops) * 100} 
                variant="divine"
                showLabel={false}
                animate={true}
                className="h-3"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Sacred Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content - 3 columns */}
            <motion.div 
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {/* Sacred Stats Cards */}
              <div className="grid gap-4 md:grid-cols-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-sacred-gold/20 hover:border-sacred-gold/40 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-sacred-gold mb-1">{userProgress.xpEarned}/{workshop.xp}</div>
                      <div className="text-xs text-blue-300">XP Earned</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-sacred-purple/20 hover:border-sacred-purple/40 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-sacred-purple mb-1">{userProgress.exercisesCompleted}/{userProgress.totalExercises}</div>
                      <div className="text-xs text-blue-300">Exercises</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{userProgress.completionPercentage}%</div>
                      <div className="text-xs text-blue-300">Complete</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-2xl font-bold">AI</span>
                      </div>
                      <div className="text-xs text-blue-300">Mentor</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sacred Content Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border border-sacred-gold/20 p-1">
                    <TabsTrigger 
                      value="content" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sacred-gold/20 data-[state=active]:to-sacred-purple/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <BookOpen className="h-4 w-4" />
                      Sacred Text
                    </TabsTrigger>
                    <TabsTrigger 
                      value="exercises" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sacred-gold/20 data-[state=active]:to-sacred-purple/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Code className="h-4 w-4" />
                      Divine Tasks
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mentor" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sacred-gold/20 data-[state=active]:to-sacred-purple/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Users className="h-4 w-4" />
                      AI Guide
                    </TabsTrigger>
                    <TabsTrigger 
                      value="progress" 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sacred-gold/20 data-[state=active]:to-sacred-purple/20 data-[state=active]:text-white transition-all duration-300"
                    >
                      <Trophy className="h-4 w-4" />
                      Mastery
                    </TabsTrigger>
                  </TabsList>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>

            {/* Sacred Sidebar */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {/* Progress Card */}
              <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30 hover:border-sacred-gold/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-sacred-gold" />
                    <h3 className="text-lg font-semibold text-white">Divine Progress</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-blue-200">
                        <span>Mastery Level</span>
                        <span>{userProgress.completionPercentage}%</span>
                      </div>
                      <SacredProgress value={userProgress.completionPercentage} variant="sacred" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-sacred-gold/10 rounded-lg p-3 border border-sacred-gold/20">
                        <div className="text-xl font-bold text-sacred-gold">{userProgress.xpEarned}</div>
                        <div className="text-xs text-blue-300">XP Gained</div>
                      </div>
                      <div className="bg-sacred-purple/10 rounded-lg p-3 border border-sacred-purple/20">
                        <div className="text-xl font-bold text-sacred-purple">{userProgress.exercisesCompleted}/{userProgress.totalExercises}</div>
                        <div className="text-xs text-blue-300">Tasks Done</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-purple/30 hover:border-sacred-purple/50 transition-all duration-300">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sacred-purple" />
                    Sacred Actions
                  </h3>
                  
                  <Button className="w-full justify-start bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-600/30 text-green-300" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                  
                  <Button className="w-full justify-start bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 border border-yellow-600/30 text-yellow-300" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Bookmark
                  </Button>
                  
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-600/30 text-purple-300" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Study Group
                  </Button>
                </CardContent>
              </Card>

              {/* Sacred Navigation */}
              <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    Navigation
                  </h3>
                  
                  <div className="flex gap-3">
                    {prevWorkshop && (
                      <Button asChild variant="outline" className="flex-1 bg-black/20 border-white/20 hover:bg-black/40">
                        <a href={`/workshops/${prevWorkshop.id}`} className="flex items-center gap-2 text-blue-200">
                          <ArrowLeft className="h-4 w-4" />
                          Prev
                        </a>
                      </Button>
                    )}
                    {nextWorkshop && (
                      <Button asChild className="flex-1 bg-gradient-to-r from-sacred-gold/20 to-sacred-purple/20 hover:from-sacred-gold/30 hover:to-sacred-purple/30 border border-sacred-gold/30">
                        <a href={`/workshops/${nextWorkshop.id}`} className="flex items-center gap-2 text-white">
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}