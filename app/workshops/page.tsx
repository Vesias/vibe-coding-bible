'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  Sparkles,
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
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="text-6xl">🔮</div>
            </div>
            
            <Badge 
              variant="outline" 
              className="border-yellow-400/30 bg-yellow-400/10 text-yellow-400 mb-6 px-4 py-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sacred Learning Path
            </Badge>
            
            <h1 className="text-5xl font-bold text-white mb-6 sm:text-6xl lg:text-7xl">
              The Sacred <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">Workshops</span>
            </h1>
            
            <p className="text-xl text-blue-200 max-w-5xl mx-auto mb-12 leading-relaxed">
              Master the 10 Sacred Commandments through interactive workshops powered by biblical wisdom and AI mentoring. 
              Transform from coding novice to AI-assisted development prophet.
            </p>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {[
            {
              number: 'I',
              title: "Das Erste Gebot: Die Heilige Vision",
              description: "Master product conceptualization and market validation before touching any code.",
              icon: Eye,
              difficulty: "Beginner",
              xp: 150,
              words: 2500,
              readTime: 12
            },
            {
              number: 'II',
              title: "Das Zweite Gebot: Der Rechte Stack", 
              description: "Choose the optimal technology stack for AI-assisted development.",
              icon: Building,
              difficulty: "Beginner", 
              xp: 200,
              words: 5000,
              readTime: 25
            },
            {
              number: 'III',
              title: "Das Dritte Gebot: Die Prompt-Kunst",
              description: "Craft perfect AI prompts that generate production-ready code.",
              icon: Brain,
              difficulty: "Intermediate",
              xp: 250,
              words: 7500,
              readTime: 37
            },
            {
              number: 'IV',
              title: "Das Vierte Gebot: Multi-Context Programming",
              description: "Juggle multiple projects simultaneously without losing productivity.",
              icon: Monitor, 
              difficulty: "Advanced",
              xp: 300,
              words: 10000,
              readTime: 50
            },
            {
              number: 'V',
              title: "Das Fünfte Gebot: Die Heilige Iteration",
              description: "Transform MVPs into scalable products through strategic iteration.",
              icon: RefreshCw,
              difficulty: "Intermediate",
              xp: 275,
              words: 12500,
              readTime: 62
            },
            {
              number: 'VI',
              title: "Das Sechste Gebot: Göttliches Debugging",
              description: "Master the art of debugging AI-generated code with divine precision.",
              icon: Bug,
              difficulty: "Advanced", 
              xp: 350,
              words: 15000,
              readTime: 75
            },
            {
              number: 'VII',
              title: "Das Siebte Gebot: Die Kunst des Vertrauens",
              description: "Balance AI autonomy with human oversight for optimal results.",
              icon: Shield,
              difficulty: "Advanced",
              xp: 325,
              words: 17500,
              readTime: 87
            },
            {
              number: 'VIII',
              title: "Das Achte Gebot: Die Skalierungsstufen",
              description: "Scale applications from prototype to millions of users seamlessly.",
              icon: TrendingUp,
              difficulty: "Expert",
              xp: 400,
              words: 20000,
              readTime: 100
            },
            {
              number: 'IX',
              title: "Das Neunte Gebot: Zusammenarbeit der Propheten",
              description: "Build and lead high-performing AI-assisted development teams.",
              icon: Users,
              difficulty: "Expert", 
              xp: 375,
              words: 22500,
              readTime: 112
            },
            {
              number: 'X',
              title: "Das Zehnte Gebot: Die Monetarisierung",
              description: "Transform your AI-built applications into profitable business empires.",
              icon: DollarSign,
              difficulty: "Expert",
              xp: 450,
              words: 25000,
              readTime: 125
            }
          ].map((commandment, index) => {
            const Icon = commandment.icon
            
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
              <div key={commandment.number} className="group">
                <Card className="h-full border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">{commandment.number}</span>
                      </div>
                      <div className="relative">
                        <Icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      {commandment.title}
                    </CardTitle>
                    
                    <CardDescription className="text-blue-200 leading-relaxed">
                      {commandment.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex gap-4 mb-4 text-xs text-blue-300">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {commandment.words.toLocaleString()} words
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {commandment.readTime} min read
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs border ${getDifficultyColor(commandment.difficulty)}`}
                      >
                        {commandment.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                        <Sparkles className="w-4 h-4" />
                        {commandment.xp} XP
                      </div>
                    </div>
                    
                    <div className="mb-6 p-3 bg-black/30 rounded-lg border border-yellow-400/20">
                      <p className="text-xs text-yellow-400 font-medium mb-1">Sacred Preview:</p>
                      <p className="text-xs text-gray-300 italic leading-relaxed">
                        "Wahrlich, ich sage euch: Wer ohne Vision zu programmieren beginnt, ist wie ein Wanderer in der Wüste ohne Kompass..."
                      </p>
                      <p className="mt-2 text-yellow-400 text-xs">...and much more divine wisdom awaits</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Link href={`/workshops/${index + 1}`}>
                          <span className="flex items-center justify-center gap-2">
                            Begin Sacred Journey
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}