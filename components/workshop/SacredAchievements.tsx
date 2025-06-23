'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SacredProgress } from '@/components/ui/sacred-progress'
import {
  Trophy,
  Crown,
  Star,
  Zap,
  Flame,
  Target,
  CheckCircle,
  Award,
  Sparkles,
  Eye,
  Lightbulb,
  Code,
  Users,
  BookOpen,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlockedAt?: Date
  category: 'learning' | 'coding' | 'collaboration' | 'mastery'
  requirements: string[]
}

interface SacredAchievementsProps {
  userAchievements: string[]
  totalXP: number
  onClose?: () => void
  showUnlockAnimation?: Achievement
}

const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Sacred Steps',
    description: 'Complete your first workshop exercise',
    icon: CheckCircle,
    rarity: 'common',
    xpReward: 25,
    category: 'learning',
    requirements: ['Complete 1 exercise']
  },
  {
    id: 'ai-collaborator',
    title: 'AI Collaborator',
    description: 'Have a meaningful conversation with an AI mentor',
    icon: Users,
    rarity: 'common',
    xpReward: 30,
    category: 'collaboration',
    requirements: ['Send 5 messages to AI mentor']
  },
  {
    id: 'code-prophet',
    title: 'Code Prophet',
    description: 'Write perfect code without hints',
    icon: Crown,
    rarity: 'rare',
    xpReward: 75,
    category: 'coding',
    requirements: ['Complete exercise with 100% score', 'No hints used']
  },
  {
    id: 'vision-master',
    title: 'Vision Master',
    description: 'Master the Sacred Vision commandment',
    icon: Eye,
    rarity: 'epic',
    xpReward: 150,
    category: 'mastery',
    requirements: ['Complete all Vision exercises', 'Score 90%+ average']
  },
  {
    id: 'divine-coder',
    title: 'Divine Coder',
    description: 'Achieve enlightenment in all commandments',
    icon: Flame,
    rarity: 'legendary',
    xpReward: 500,
    category: 'mastery',
    requirements: ['Complete all 10 commandments', 'Score 95%+ average']
  },
  {
    id: 'lightning-fast',
    title: 'Lightning Fast',
    description: 'Complete an exercise in under 2 minutes',
    icon: Zap,
    rarity: 'rare',
    xpReward: 60,
    category: 'coding',
    requirements: ['Complete exercise in < 2 minutes']
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Read through 5 complete workshop contents',
    icon: BookOpen,
    rarity: 'common',
    xpReward: 40,
    category: 'learning',
    requirements: ['View 5 workshop contents completely']
  },
  {
    id: 'mentor-student',
    title: 'Devoted Student',
    description: 'Engage with AI mentors across different workshops',
    icon: Lightbulb,
    rarity: 'rare',
    xpReward: 80,
    category: 'collaboration',
    requirements: ['Chat with 3 different AI mentors']
  }
]

export function SacredAchievements({
  userAchievements,
  totalXP,
  onClose,
  showUnlockAnimation
}: SacredAchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  const getRarityConfig = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-400/10',
          border: 'border-gray-400/30',
          glow: 'shadow-gray-400/20'
        }
      case 'rare':
        return {
          color: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30',
          glow: 'shadow-blue-400/20'
        }
      case 'epic':
        return {
          color: 'text-purple-400',
          bg: 'bg-purple-400/10',
          border: 'border-purple-400/30',
          glow: 'shadow-purple-400/20'
        }
      case 'legendary':
        return {
          color: 'text-sacred-gold',
          bg: 'bg-sacred-gold/10',
          border: 'border-sacred-gold/30',
          glow: 'shadow-sacred-gold/20'
        }
    }
  }

  const getCategoryConfig = (category: Achievement['category']) => {
    switch (category) {
      case 'learning': return { icon: BookOpen, color: 'text-green-400' }
      case 'coding': return { icon: Code, color: 'text-blue-400' }
      case 'collaboration': return { icon: Users, color: 'text-purple-400' }
      case 'mastery': return { icon: Crown, color: 'text-sacred-gold' }
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false
    }
    if (showUnlockedOnly && !userAchievements.includes(achievement.id)) {
      return false
    }
    return true
  })

  const unlockedCount = achievements.filter(a => userAchievements.includes(a.id)).length
  const completionPercentage = (unlockedCount / achievements.length) * 100

  return (
    <>
      {/* Achievement Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto"
              >
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center border-4",
                  getRarityConfig(showUnlockAnimation.rarity).bg,
                  getRarityConfig(showUnlockAnimation.rarity).border
                )}>
                  <showUnlockAnimation.icon className={cn(
                    "w-12 h-12",
                    getRarityConfig(showUnlockAnimation.rarity).color
                  )} />
                </div>
              </motion.div>
              
              <div className="space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold text-white"
                >
                  Achievement Unlocked!
                </motion.h2>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className={cn(
                    "text-xl font-semibold",
                    getRarityConfig(showUnlockAnimation.rarity).color
                  )}
                >
                  {showUnlockAnimation.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-blue-200 max-w-md"
                >
                  {showUnlockAnimation.description}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  className="flex items-center justify-center gap-2 mt-4"
                >
                  <Award className="w-5 h-5 text-sacred-gold" />
                  <span className="text-sacred-gold font-semibold">
                    +{showUnlockAnimation.xpReward} XP
                  </span>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="space-y-2"
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-sacred-gold/30 to-sacred-purple/30 hover:from-sacred-gold/50 hover:to-sacred-purple/50"
                >
                  Continue Learning
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Achievement Panel */}
      <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="h-6 w-6 text-sacred-gold" />
              Sacred Achievements
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Progress Overview */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-sacred-gold">
                {unlockedCount}/{achievements.length}
              </div>
              <p className="text-blue-200 text-sm">Achievements Unlocked</p>
              <SacredProgress value={completionPercentage} variant="divine" />
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="text-xs"
              >
                All
              </Button>
              {['learning', 'coding', 'collaboration', 'mastery'].map(category => {
                const config = getCategoryConfig(category as Achievement['category'])
                const Icon = config.icon
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                )
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="unlocked-only"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="rounded border-sacred-gold/30"
              />
              <label htmlFor="unlocked-only" className="text-sm text-blue-200">
                Show unlocked only
              </label>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAchievements.map((achievement, index) => {
              const isUnlocked = userAchievements.includes(achievement.id)
              const rarityConfig = getRarityConfig(achievement.rarity)
              const categoryConfig = getCategoryConfig(achievement.category)
              const CategoryIcon = categoryConfig.icon
              const AchievementIcon = achievement.icon
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-300",
                    isUnlocked
                      ? cn(rarityConfig.bg, rarityConfig.border, "shadow-lg", rarityConfig.glow)
                      : "bg-gray-800/30 border-gray-600/30 opacity-60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center border",
                      isUnlocked ? rarityConfig.bg : "bg-gray-600/20",
                      isUnlocked ? rarityConfig.border : "border-gray-600/30"
                    )}>
                      <AchievementIcon className={cn(
                        "w-6 h-6",
                        isUnlocked ? rarityConfig.color : "text-gray-500"
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          "font-semibold truncate",
                          isUnlocked ? "text-white" : "text-gray-400"
                        )}>
                          {achievement.title}
                        </h4>
                        <CategoryIcon className={cn(
                          "w-3 h-3",
                          isUnlocked ? categoryConfig.color : "text-gray-500"
                        )} />
                      </div>
                      
                      <p className={cn(
                        "text-sm mb-2",
                        isUnlocked ? "text-blue-200" : "text-gray-500"
                      )}>
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs capitalize",
                            isUnlocked ? rarityConfig.color : "text-gray-500",
                            isUnlocked ? rarityConfig.border : "border-gray-600/30"
                          )}
                        >
                          {achievement.rarity}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-xs">
                          <Award className={cn(
                            "w-3 h-3",
                            isUnlocked ? "text-sacred-gold" : "text-gray-500"
                          )} />
                          <span className={cn(
                            isUnlocked ? "text-sacred-gold" : "text-gray-500"
                          )}>
                            {achievement.xpReward} XP
                          </span>
                        </div>
                      </div>
                      
                      {!isUnlocked && (
                        <div className="mt-2 pt-2 border-t border-gray-600/30">
                          <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            {achievement.requirements.map((req, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {showUnlockedOnly ? 'No achievements unlocked in this category yet.' : 'No achievements found.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}