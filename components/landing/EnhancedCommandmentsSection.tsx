'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { 
  Eye, 
  Building, 
  Brain, 
  Monitor, 
  RefreshCw, 
  Bug,
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  BookOpen,
  Play,
  Lock,
  CheckCircle
} from 'lucide-react'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'

const commandments = [
  { 
    number: 'I', 
    title: 'Die Heilige Vision', 
    icon: Eye,
    description: 'Master product conceptualization and market validation before touching any code. Learn to see the divine plan through AI-assisted ideation.',
    extendedDescription: 'Transform abstract ideas into concrete visions using AI-powered market research, user persona generation, and competitive analysis.',
    difficulty: 'Beginner',
    xp: 150,
    progress: 0,
    color: 'from-yellow-500 to-orange-500',
    bgPattern: 'vesica-piscis',
    sacredWisdom: 'In the beginning was the Word, and the Word was Vision. See clearly before you build.',
    keySkills: ['AI-Assisted Ideation', 'Market Validation', 'Vision Crafting', 'Problem Definition'],
    duration: '3-5 hours',
    unlocked: true
  },
  { 
    number: 'II', 
    title: 'Der Rechte Stack', 
    icon: Building,
    description: 'Choose the optimal technology stack for AI-assisted development. Next.js, TypeScript, and divine tools for modern prophets.',
    extendedDescription: 'Master the sacred technologies: Next.js 14, TypeScript, Tailwind CSS, Supabase, and the divine AI development tools.',
    difficulty: 'Beginner',
    xp: 200,
    progress: 0,
    color: 'from-blue-500 to-cyan-500',
    bgPattern: 'golden-spiral',
    sacredWisdom: 'Build upon solid foundations, for the Tower of Babel fell due to poor architecture.',
    keySkills: ['Next.js Mastery', 'TypeScript Proficiency', 'Modern Toolchain', 'Architecture Decisions'],
    duration: '4-6 hours',
    unlocked: true
  },
  { 
    number: 'III', 
    title: 'Die Prompt-Kunst', 
    icon: Brain,
    description: 'Craft perfect AI prompts that generate production-ready code. Command the machine spirits with divine precision.',
    extendedDescription: 'Learn advanced prompt engineering techniques for code generation, debugging, optimization, and architectural planning.',
    difficulty: 'Intermediate',
    xp: 250,
    progress: 0,
    color: 'from-purple-500 to-pink-500',
    bgPattern: 'flower-of-life',
    sacredWisdom: 'Speak to the machines as you would to the gods - with respect, clarity, and purpose.',
    keySkills: ['Prompt Engineering', 'Code Generation', 'AI Communication', 'Context Management'],
    duration: '5-7 hours',
    unlocked: true
  },
  { 
    number: 'IV', 
    title: 'Multi-Context Programming', 
    icon: Monitor,
    description: 'Juggle multiple projects simultaneously without losing productivity. Divine focus mastery through AI assistance.',
    extendedDescription: 'Master context switching, project management, and maintaining coding flow across multiple concurrent developments.',
    difficulty: 'Advanced',
    xp: 300,
    progress: 0,
    color: 'from-green-500 to-emerald-500',
    bgPattern: 'metatrons-cube',
    sacredWisdom: 'The enlightened developer sees all contexts as one, yet treats each with its due reverence.',
    keySkills: ['Context Management', 'Multi-Project Flow', 'AI-Assisted Organization', 'Mental Models'],
    duration: '6-8 hours',
    unlocked: false
  },
  { 
    number: 'V', 
    title: 'Die Heilige Iteration', 
    icon: RefreshCw,
    description: 'Transform MVPs into scalable products through strategic iteration. From prototype to perfection via AI guidance.',
    extendedDescription: 'Learn the sacred cycle of build-measure-learn accelerated by AI-powered analytics and optimization strategies.',
    difficulty: 'Intermediate',
    xp: 275,
    progress: 0,
    color: 'from-indigo-500 to-blue-500',
    bgPattern: 'golden-spiral',
    sacredWisdom: 'Perfection is not a destination but a journey of endless sacred iterations.',
    keySkills: ['Iterative Development', 'MVP Optimization', 'AI-Driven Analytics', 'User Feedback Integration'],
    duration: '5-7 hours',
    unlocked: false
  },
  { 
    number: 'VI', 
    title: 'Göttliches Debugging', 
    icon: Bug,
    description: 'Master debugging AI-generated code with divine precision. Hunt bugs like an ancient prophet seeks truth.',
    extendedDescription: 'Develop supernatural debugging skills using AI assistants, advanced tooling, and systematic problem-solving approaches.',
    difficulty: 'Advanced',
    xp: 350,
    progress: 0,
    color: 'from-red-500 to-rose-500',
    bgPattern: 'sri-yantra',
    sacredWisdom: 'Every bug is a teacher, every error a lesson. Debug with compassion and learn with humility.',
    keySkills: ['AI-Assisted Debugging', 'Error Analysis', 'Systematic Problem Solving', 'Code Quality Assurance'],
    duration: '7-9 hours',
    unlocked: false
  },
  { 
    number: 'VII', 
    title: 'Die Kunst des Vertrauens', 
    icon: Shield,
    description: 'Balance AI autonomy with human oversight for optimal results. Learn when to trust and when to verify.',
    extendedDescription: 'Master the delicate balance between AI assistance and human judgment in critical development decisions.',
    difficulty: 'Advanced',
    xp: 325,
    progress: 0,
    color: 'from-teal-500 to-cyan-500',
    bgPattern: 'tree-of-life',
    sacredWisdom: 'Trust, but verify. The wise prophet knows when to let AI lead and when to take the reins.',
    keySkills: ['AI Trust Calibration', 'Code Review Mastery', 'Quality Assurance', 'Risk Assessment'],
    duration: '6-8 hours',
    unlocked: false
  },
  { 
    number: 'VIII', 
    title: 'Die Skalierungsstufen', 
    icon: TrendingUp,
    description: 'Scale applications from prototype to millions of users. Build the tower that reaches digital heaven.',
    extendedDescription: 'Learn advanced scaling strategies, performance optimization, and infrastructure design for massive applications.',
    difficulty: 'Expert',
    xp: 400,
    progress: 0,
    color: 'from-orange-500 to-red-500',
    bgPattern: 'torus',
    sacredWisdom: 'Scale not just in size, but in wisdom. Every user milestone requires new levels of understanding.',
    keySkills: ['Performance Optimization', 'Infrastructure Scaling', 'Database Design', 'System Architecture'],
    duration: '8-12 hours',
    unlocked: false
  },
  { 
    number: 'IX', 
    title: 'Zusammenarbeit der Propheten', 
    icon: Users,
    description: 'Build and lead high-performing AI-assisted development teams. Unite the faithful in collaborative excellence.',
    extendedDescription: 'Master team dynamics, AI-assisted collaboration, code review processes, and distributed development workflows.',
    difficulty: 'Expert',
    xp: 375,
    progress: 0,
    color: 'from-violet-500 to-purple-500',
    bgPattern: 'mandala',
    sacredWisdom: 'A prophet alone is powerful, but prophets united can move digital mountains.',
    keySkills: ['Team Leadership', 'Collaborative Development', 'AI Team Integration', 'Knowledge Sharing'],
    duration: '7-10 hours',
    unlocked: false
  },
  { 
    number: 'X', 
    title: 'Die Monetarisierung', 
    icon: DollarSign,
    description: 'Transform AI-built applications into profitable business empires. Turn sacred code into golden opportunities.',
    extendedDescription: 'Learn business model development, pricing strategies, market positioning, and scaling profitable AI-built products.',
    difficulty: 'Expert',
    xp: 450,
    progress: 0,
    color: 'from-yellow-500 to-amber-500',
    bgPattern: 'flower-of-life',
    sacredWisdom: 'True wealth flows from value creation. Build products that serve humanity while serving prosperity.',
    keySkills: ['Business Model Design', 'Monetization Strategies', 'Market Positioning', 'Growth Hacking'],
    duration: '10-15 hours',
    unlocked: false
  }
]

export function EnhancedCommandmentsSection() {
  const [selectedCommandment, setSelectedCommandment] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <section 
      id="commandments"
      ref={containerRef}
      className="relative py-32 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 overflow-hidden"
    >
      {/* Background Sacred Geometry */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y }}
      >
        <div className="absolute top-0 left-1/4">
          <SacredGeometry pattern="mandala" size={800} color="#6366F1" accentColor="#D4AF37" animated={true} />
        </div>
        <div className="absolute bottom-0 right-1/4">
          <SacredGeometry pattern="tree-of-life" size={600} color="#7C3AED" accentColor="#EC4899" animated={true} />
        </div>
      </motion.div>

      {/* Mystical Light Beams */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-sacred-gold to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-vibe-primary to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-sacred-purple to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge 
              variant="outline" 
              className="border-sacred-gold/50 bg-sacred-gold/10 text-sacred-gold mb-8 px-6 py-3 text-lg font-medium shadow-lg shadow-sacred-gold/20"
            >
              <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
              Sacred Knowledge Awaits Your Ascension
              <Crown className="w-5 h-5 ml-3" />
            </Badge>
            
            <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-8 text-white font-sacred">
              The{' '}
              <span className="bg-gradient-to-r from-sacred-gold via-sacred-purple to-vibe-primary bg-clip-text text-transparent">
                10 Sacred Commandments
              </span>
            </h2>
            
            <p className="text-xl text-blue-200 max-w-5xl mx-auto leading-relaxed mb-8">
              Each commandment is a comprehensive workshop combining divine theory, hands-on practice, 
              and real-world application guided by AI mentors. Progress through the sacred path from novice to prophet.
            </p>

            {/* Progress Overview */}
            <div className="inline-flex items-center gap-6 rounded-2xl border border-sacred-gold/30 bg-gradient-to-r from-sacred-gold/10 to-sacred-purple/10 backdrop-blur-sm px-8 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-sacred-gold mb-1">0/10</div>
                <div className="text-sm text-blue-300">Commandments</div>
              </div>
              <div className="h-8 w-px bg-sacred-gold/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-vibe-primary mb-1">3,075</div>
                <div className="text-sm text-blue-300">Total XP</div>
              </div>
              <div className="h-8 w-px bg-sacred-gold/30" />
              <div className="text-center">
                <div className="text-2xl font-bold text-sacred-purple mb-1">50+</div>
                <div className="text-sm text-blue-300">Hours Content</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Commandments Grid */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 max-w-7xl mx-auto">
          {commandments.map((commandment, index) => {
            const Icon = commandment.icon
            const isHovered = hoveredCard === index
            const isSelected = selectedCommandment === index
            
            return (
              <motion.div
                key={commandment.number}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => setSelectedCommandment(isSelected ? null : index)}
              >
                <Card className={`
                  prophet-card h-full border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm 
                  hover:from-white/10 hover:to-white/15 transition-all duration-700 hover:scale-[1.02] 
                  hover:shadow-2xl hover:shadow-vibe-primary/20 overflow-hidden cursor-pointer
                  ${commandment.unlocked ? '' : 'opacity-75'}
                  ${isSelected ? 'ring-2 ring-sacred-gold shadow-2xl shadow-sacred-gold/30' : ''}
                `}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <SacredGeometry 
                      pattern={commandment.bgPattern as any} 
                      size={300} 
                      color="#6366F1" 
                      accentColor="#D4AF37"
                      animated={isHovered}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>

                  {/* Unlock Status */}
                  {!commandment.unlocked && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <Lock className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-yellow-500 font-medium">Locked</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      {/* Sacred Number */}
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${commandment.color} flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white font-bold text-2xl font-sacred">{commandment.number}</span>
                      </div>
                      
                      {/* Divine Icon */}
                      <div className="relative">
                        <div className="absolute -inset-3 bg-gradient-to-r from-vibe-primary/20 to-vibe-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                        <Icon className="relative w-10 h-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sacred-gold group-hover:to-sacred-purple group-hover:bg-clip-text transition-all duration-300 mb-3">
                      {commandment.title}
                    </CardTitle>
                    
                    <CardDescription className="text-blue-200 leading-relaxed text-base">
                      {commandment.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 relative z-10">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-blue-300 font-medium">Progress</span>
                        <span className="text-sm text-blue-300">{commandment.progress}%</span>
                      </div>
                      <Progress value={commandment.progress} className="h-3 bg-white/10" />
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between mb-6">
                      <Badge 
                        variant="secondary" 
                        className={`text-sm border ${getDifficultyColor(commandment.difficulty)} font-medium`}
                      >
                        {commandment.difficulty}
                      </Badge>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-vibe-accent font-semibold text-sm">
                          <Sparkles className="w-4 h-4" />
                          {commandment.xp} XP
                        </div>
                        <div className="text-xs text-blue-400">
                          {commandment.duration}
                        </div>
                      </div>
                    </div>

                    {/* Key Skills Preview */}
                    <div className="mb-6">
                      <div className="text-xs text-blue-300 font-medium mb-2">Key Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {commandment.keySkills.slice(0, 2).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs border-sacred-gold/20 text-sacred-gold/80">
                            {skill}
                          </Badge>
                        ))}
                        {commandment.keySkills.length > 2 && (
                          <Badge variant="outline" className="text-xs border-sacred-gold/20 text-sacred-gold/80">
                            +{commandment.keySkills.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        asChild={commandment.unlocked}
                        disabled={!commandment.unlocked}
                        variant="sacred" 
                        className="w-full group/btn shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {commandment.unlocked ? (
                          <Link href={`/workshops/${commandment.number.toLowerCase()}`}>
                            <span className="flex items-center justify-center gap-2">
                              <Play className="w-4 h-4" />
                              Begin Sacred Journey
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </span>
                          </Link>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Complete Previous Commandments
                          </span>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10 hover:border-sacred-gold/50 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCommandment(isSelected ? null : index)
                        }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {isSelected ? 'Hide Details' : 'Preview Wisdom'}
                      </Button>
                    </div>
                    
                    {/* Sacred Wisdom Preview */}
                    <motion.div 
                      className="mt-6 p-4 bg-black/30 rounded-lg border border-sacred-gold/20 backdrop-blur-sm"
                      initial={false}
                      animate={{ height: isSelected ? 'auto' : 'auto' }}
                    >
                      <p className="text-xs text-sacred-gold font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Sacred Wisdom:
                      </p>
                      <p className="text-sm text-gray-300 italic leading-relaxed">
                        "{commandment.sacredWisdom}"
                      </p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-sacred-gold/20"
                        >
                          <p className="text-sm text-blue-200 leading-relaxed mb-3">
                            {commandment.extendedDescription}
                          </p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="text-blue-300 font-medium mb-1">All Skills:</div>
                              <div className="space-y-1">
                                {commandment.keySkills.map((skill, skillIndex) => (
                                  <div key={skillIndex} className="flex items-center gap-1 text-blue-400">
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                    {skill}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-blue-300 font-medium mb-1">Duration:</div>
                              <div className="text-blue-400 mb-2">{commandment.duration}</div>
                              <div className="text-blue-300 font-medium mb-1">Reward:</div>
                              <div className="text-vibe-accent font-semibold">{commandment.xp} XP</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        {/* Divine Call to Action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="inline-flex flex-col items-center gap-8 rounded-3xl border-2 border-sacred-gold/30 bg-gradient-to-br from-sacred-gold/10 via-sacred-purple/5 to-vibe-primary/10 backdrop-blur-sm px-12 py-10 mb-10 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl font-bold text-sacred-gold mb-3 font-sacred">
                Total Sacred Power: 3,075 XP
              </div>
              <div className="text-lg text-blue-300 mb-4">
                Complete all commandments to achieve Prophet status
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-blue-400">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-sacred-gold" />
                  Prophet Status
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-vibe-primary" />
                  50+ Hours Content
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-vibe-accent" />
                  Elite Community Access
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            asChild 
            size="xl"
            className="bg-gradient-to-r from-sacred-gold to-sacred-purple hover:from-sacred-purple hover:to-sacred-gold text-white font-bold px-16 py-8 text-2xl shadow-2xl hover:shadow-sacred-gold/50 transform hover:scale-105 transition-all duration-500"
          >
            <Link href="/workshops">
              <Crown className="w-8 h-8 mr-4" />
              Begin All Sacred Commandments
              <Sparkles className="w-8 h-8 ml-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}