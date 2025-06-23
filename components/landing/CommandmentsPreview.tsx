'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
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
  Crown
} from 'lucide-react'
import Link from 'next/link'

const commandments = [
  { 
    number: 'I', 
    title: 'Die Heilige Vision', 
    icon: Eye,
    description: 'Master product conceptualization and market validation before touching any code. Learn to see the divine plan.',
    difficulty: 'Beginner',
    xp: 150,
    progress: 0,
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    number: 'II', 
    title: 'Der Rechte Stack', 
    icon: Building,
    description: 'Choose the optimal technology stack for AI-assisted development. Next.js, TypeScript, and divine tools.',
    difficulty: 'Beginner',
    xp: 200,
    progress: 0,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    number: 'III', 
    title: 'Die Prompt-Kunst', 
    icon: Brain,
    description: 'Craft perfect AI prompts that generate production-ready code. Command the machine spirits.',
    difficulty: 'Intermediate',
    xp: 250,
    progress: 0,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    number: 'IV', 
    title: 'Multi-Context Programming', 
    icon: Monitor,
    description: 'Juggle multiple projects simultaneously without losing productivity. Divine focus mastery.',
    difficulty: 'Advanced',
    xp: 300,
    progress: 0,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    number: 'V', 
    title: 'Die Heilige Iteration', 
    icon: RefreshCw,
    description: 'Transform MVPs into scalable products through strategic iteration. From prototype to perfection.',
    difficulty: 'Intermediate',
    xp: 275,
    progress: 0,
    color: 'from-indigo-500 to-blue-500'
  },
  { 
    number: 'VI', 
    title: 'Göttliches Debugging', 
    icon: Bug,
    description: 'Master debugging AI-generated code with divine precision. Hunt bugs like an ancient prophet.',
    difficulty: 'Advanced',
    xp: 350,
    progress: 0,
    color: 'from-red-500 to-rose-500'
  },
  { 
    number: 'VII', 
    title: 'Die Kunst des Vertrauens', 
    icon: Shield,
    description: 'Balance AI autonomy with human oversight for optimal results. Learn when to trust and verify.',
    difficulty: 'Advanced',
    xp: 325,
    progress: 0,
    color: 'from-teal-500 to-cyan-500'
  },
  { 
    number: 'VIII', 
    title: 'Die Skalierungsstufen', 
    icon: TrendingUp,
    description: 'Scale applications from prototype to millions of users. Build the tower that reaches heaven.',
    difficulty: 'Expert',
    xp: 400,
    progress: 0,
    color: 'from-orange-500 to-red-500'
  },
  { 
    number: 'IX', 
    title: 'Zusammenarbeit der Propheten', 
    icon: Users,
    description: 'Build and lead high-performing AI-assisted development teams. Unite the faithful.',
    difficulty: 'Expert',
    xp: 375,
    progress: 0,
    color: 'from-violet-500 to-purple-500'
  },
  { 
    number: 'X', 
    title: 'Die Monetarisierung', 
    icon: DollarSign,
    description: 'Transform AI-built applications into profitable business empires. Turn code into gold.',
    difficulty: 'Expert',
    xp: 450,
    progress: 0,
    color: 'from-yellow-500 to-amber-500'
  }
]

export function CommandmentsPreview() {
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
    <section className="py-24 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge 
              variant="outline" 
              className="border-sacred-gold/30 bg-sacred-gold/10 text-sacred-gold mb-6 px-4 py-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sacred Knowledge Awaits
            </Badge>
            
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 text-white">
              The{' '}
              <span className="bg-gradient-to-r from-sacred-gold via-sacred-purple to-sacred-blue bg-clip-text text-transparent font-sacred">
                10 Sacred Commandments
              </span>
            </h2>
            
            <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Each commandment is a comprehensive workshop combining divine theory, hands-on practice, 
              and real-world application guided by AI mentors.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
          {commandments.map((commandment, index) => {
            const Icon = commandment.icon
            
            return (
              <motion.div
                key={commandment.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="prophet-card h-full border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-vibe-primary/10 overflow-hidden">
                  {/* Card Header */}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${commandment.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-xl font-sacred">{commandment.number}</span>
                      </div>
                      <div className="relative">
                        <Icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-vibe-primary/20 to-vibe-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sacred-gold group-hover:to-sacred-purple group-hover:bg-clip-text transition-all duration-300">
                      {commandment.title}
                    </CardTitle>
                    
                    <CardDescription className="text-blue-200 leading-relaxed">
                      {commandment.description}
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Card Content */}
                  <CardContent className="pt-0">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-blue-300">Progress</span>
                        <span className="text-xs text-blue-300">{commandment.progress}%</span>
                      </div>
                      <Progress value={commandment.progress} className="h-2 bg-white/10" />
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs border ${getDifficultyColor(commandment.difficulty)}`}
                      >
                        {commandment.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-vibe-accent font-semibold text-sm">
                        <Sparkles className="w-4 h-4" />
                        {commandment.xp} XP
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        asChild 
                        variant="prophet" 
                        className="w-full group/btn shadow-lg hover:shadow-xl"
                      >
                        <Link href={`/workshops/${commandment.number.toLowerCase()}`}>
                          <span className="flex items-center justify-center gap-2">
                            Begin Sacred Journey
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </span>
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10 hover:border-sacred-gold/50 transition-all duration-300"
                      >
                        Preview Wisdom
                      </Button>
                    </div>
                    
                    {/* Sacred Preview */}
                    <div className="mt-4 p-3 bg-black/30 rounded-lg border border-sacred-gold/20">
                      <p className="text-xs text-sacred-gold font-medium mb-1">Sacred Preview:</p>
                      <p className="text-xs text-gray-300 italic leading-relaxed">
                        "Wahrlich, ich sage euch: Der Weg zur Meisterschaft beginnt mit dem ersten Schritt..."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col items-center gap-6 rounded-2xl border border-sacred-gold/30 bg-gradient-to-br from-sacred-gold/10 to-sacred-purple/10 backdrop-blur-sm px-8 py-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-sacred-gold mb-2">
                Total XP Available: 3,075
              </div>
              <div className="text-sm text-blue-300">
                Complete all commandments to reach Prophet status
              </div>
            </div>
          </div>
          
          <Button 
            asChild 
            variant="sacred" 
            size="xl"
            className="shadow-2xl hover:shadow-sacred-gold/25"
          >
            <Link href="/workshops">
              <Crown className="w-5 h-5 mr-2" />
              Begin All Commandments
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}