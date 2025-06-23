'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'
import FloatingParticles from '@/components/effects/FloatingParticles'
import { motion } from 'framer-motion'
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
  ArrowRight,
  Crown,
  Star,
  Scroll
} from 'lucide-react'
import Link from 'next/link'

const commandments = [
  {
    number: 'I',
    title: "Das Erste Gebot: Die Heilige Vision",
    description: "Master product conceptualization and market validation before touching any code. Learn to see the divine plan.",
    icon: Eye,
    difficulty: "Beginner",
    xp: 150,
    words: 2500,
    readTime: 12,
    color: 'from-sacred-gold-light to-sacred-gold',
    sacredSymbol: '👁️',
    preview: "Wahrlich, ich sage euch: Wer ohne Vision zu programmieren beginnt, ist wie ein Wanderer in der Wüste ohne Kompass..."
  },
  {
    number: 'II',
    title: "Das Zweite Gebot: Der Rechte Stack", 
    description: "Choose the optimal technology stack for AI-assisted development. Next.js, TypeScript, and divine tools.",
    icon: Building,
    difficulty: "Beginner", 
    xp: 200,
    words: 5000,
    readTime: 25,
    color: 'from-sacred-blue-light to-sacred-blue',
    sacredSymbol: '🏗️',
    preview: "Das Fundament bestimmt die Höhe des Turms. Wähle weise deine Werkzeuge, denn sie werden dein Schicksal bestimmen..."
  },
  {
    number: 'III',
    title: "Das Dritte Gebot: Die Prompt-Kunst",
    description: "Craft perfect AI prompts that generate production-ready code. Command the machine spirits.",
    icon: Brain,
    difficulty: "Intermediate",
    xp: 250,
    words: 7500,
    readTime: 37,
    color: 'from-sacred-purple-light to-sacred-purple',
    sacredSymbol: '🧠',
    preview: "Die Kunst der Beschwörung liegt nicht in der Lautstärke, sondern in der Präzision der Worte..."
  },
  {
    number: 'IV',
    title: "Das Vierte Gebot: Multi-Context Programming",
    description: "Juggle multiple projects simultaneously without losing productivity. Divine focus mastery.",
    icon: Monitor, 
    difficulty: "Advanced",
    xp: 300,
    words: 10000,
    readTime: 50,
    color: 'from-sacred-mystical-mint to-sacred-mystical-cyan',
    sacredSymbol: '🖥️',
    preview: "Wie ein Dirigent ein Orchester leitet, so muss der Weise viele Projekte gleichzeitig führen..."
  },
  {
    number: 'V',
    title: "Das Fünfte Gebot: Die Heilige Iteration",
    description: "Transform MVPs into scalable products through strategic iteration. From prototype to perfection.",
    icon: RefreshCw,
    difficulty: "Intermediate",
    xp: 275,
    words: 12500,
    readTime: 62,
    color: 'from-sacred-indigo-light to-sacred-indigo',
    sacredSymbol: '🔄',
    preview: "Wie der Phönix aus der Asche steigt, so wird dein Produkt durch Iteration zur Vollendung gelangen..."
  },
  {
    number: 'VI',
    title: "Das Sechste Gebot: Göttliches Debugging",
    description: "Master debugging AI-generated code with divine precision. Hunt bugs like an ancient prophet.",
    icon: Bug,
    difficulty: "Advanced", 
    xp: 350,
    words: 15000,
    readTime: 75,
    color: 'from-sacred-mystical-rose to-red-500',
    sacredSymbol: '🐛',
    preview: "Der Fehlerteufel versteckt sich in den Schatten des Codes. Nur mit göttlicher Erleuchtung findest du ihn..."
  },
  {
    number: 'VII',
    title: "Das Siebte Gebot: Die Kunst des Vertrauens",
    description: "Balance AI autonomy with human oversight for optimal results. Learn when to trust and verify.",
    icon: Shield,
    difficulty: "Advanced",
    xp: 325,
    words: 17500,
    readTime: 87,
    color: 'from-sacred-mystical-cyan to-blue-500',
    sacredSymbol: '🛡️',
    preview: "Vertrauen ohne Verifikation ist Naivität. Verifikation ohne Vertrauen ist Paralyse. Finde die Balance..."
  },
  {
    number: 'VIII',
    title: "Das Achte Gebot: Die Skalierungsstufen",
    description: "Scale applications from prototype to millions of users. Build the tower that reaches heaven.",
    icon: TrendingUp,
    difficulty: "Expert",
    xp: 400,
    words: 20000,
    readTime: 100,
    color: 'from-orange-500 to-red-500',
    sacredSymbol: '📈',
    preview: "Wie der Turm zu Babel soll deine Anwendung gen Himmel wachsen, doch lerne aus deren Fehlern..."
  },
  {
    number: 'IX',
    title: "Das Neunte Gebot: Zusammenarbeit der Propheten",
    description: "Build and lead high-performing AI-assisted development teams. Unite the faithful.",
    icon: Users,
    difficulty: "Expert", 
    xp: 375,
    words: 22500,
    readTime: 112,
    color: 'from-sacred-purple to-sacred-indigo',
    sacredSymbol: '👥',
    preview: "Ein einzelner Faden kann brechen, doch viele Fäden zusammen bilden ein unzerreißbares Seil..."
  },
  {
    number: 'X',
    title: "Das Zehnte Gebot: Die Monetarisierung",
    description: "Transform AI-built applications into profitable business empires. Turn code into gold.",
    icon: DollarSign,
    difficulty: "Expert",
    xp: 450,
    words: 25000,
    readTime: 125,
    color: 'from-sacred-gold to-sacred-mystical-yellow',
    sacredSymbol: '💰',
    preview: "Das wahre Gold liegt nicht in den Münzen, sondern in der Transformation von Code zu Wert..."
  }
]

export default function WorkshopsPage() {
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
    <main className="min-h-screen divine-gradient relative overflow-hidden">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10">
          <SacredGeometry pattern="tree-of-life" size={300} color="#F9A826" animated={true} />
        </div>
        <div className="absolute bottom-20 right-10">
          <SacredGeometry pattern="sri-yantra" size={250} color="#7C3AED" animated={true} />
        </div>
      </div>

      {/* Floating particles */}
      <FloatingParticles count={40} />

      {/* Header Section */}
      <section className="relative z-10 pt-16 pb-24">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div className="text-8xl animate-divine-pulse filter drop-shadow-2xl">🔮</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="sacred-card px-6 py-3 text-base font-semibold mb-8">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                <span className="sacred-text">Sacred Learning Path</span>
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="divine-header mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              The Sacred <span className="sacred-text">Workshops</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-divine-white/80 max-w-5xl mx-auto mb-12 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Master the <span className="sacred-text font-semibold">X Sacred Commandments</span> through interactive workshops powered by 
              <span className="divine-text font-semibold"> biblical wisdom</span> and <span className="bg-gradient-to-r from-sacred-mystical-cyan to-sacred-mystical-mint bg-clip-text text-transparent font-semibold">AI mentoring</span>. 
              Transform from coding novice to <span className="sacred-text font-semibold">AI-assisted development prophet</span>.
            </motion.p>

            {/* Sacred Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="sacred-card px-6 py-4 text-center">
                <div className="text-2xl font-bold sacred-text mb-1">3,075</div>
                <div className="text-sm text-sacred-purple-light">Total XP</div>
              </div>
              <div className="sacred-card px-6 py-4 text-center">
                <div className="text-2xl font-bold divine-text mb-1">X</div>
                <div className="text-sm text-sacred-indigo-light">Commandments</div>
              </div>
              <div className="sacred-card px-6 py-4 text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-sacred-mystical-rose to-sacred-mystical-yellow bg-clip-text text-transparent mb-1">∞</div>
                <div className="text-sm text-sacred-mystical-cyan">Divine Knowledge</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="relative z-10 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {commandments.map((commandment, index) => {
              const Icon = commandment.icon
              
              return (
                <motion.div
                  key={commandment.number}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="sacred-card h-full backdrop-blur-md transition-all duration-700 hover:scale-105 overflow-hidden group-hover:sacred-glow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${commandment.color} flex items-center justify-center shadow-lg group-hover:animate-divine-pulse`}>
                          <span className="text-divine-midnight font-sacred font-bold text-xl">{commandment.number}</span>
                        </div>
                        <div className="relative">
                          <div className="text-2xl mb-2 animate-float">{commandment.sacredSymbol}</div>
                          <Icon className="w-6 h-6 text-sacred-purple-light group-hover:text-sacred-gold-light transition-colors" />
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl font-semibold text-divine-white group-hover:sacred-text transition-all duration-300 font-display">
                        {commandment.title}
                      </CardTitle>
                      
                      <CardDescription className="text-divine-white/70 leading-relaxed">
                        {commandment.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex gap-4 mb-4 text-xs text-sacred-purple-light">
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
                        <div className="flex items-center gap-1 sacred-text font-semibold text-sm">
                          <Star className="w-4 h-4" />
                          {commandment.xp} XP
                        </div>
                      </div>
                      
                      <div className="mb-6 p-4 bg-divine-midnight/50 rounded-lg border border-sacred-gold/20 sacred-glow">
                        <p className="text-xs sacred-text font-medium mb-2 flex items-center gap-1">
                          <Scroll className="w-3 h-3" />
                          Sacred Preview:
                        </p>
                        <p className="text-sm text-divine-white/80 italic leading-relaxed font-light">
                          "{commandment.preview}"
                        </p>
                        <p className="mt-2 divine-text text-xs font-medium">...and much more divine wisdom awaits</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Link href={`/workshops/${commandment.number.toLowerCase()}`}>
                          <Button className="w-full sacred-gradient hover:sacred-gradient-alt text-divine-midnight font-bold transition-all duration-500 transform hover:scale-105 sacred-glow flex items-center justify-center gap-2">
                            Begin Sacred Journey
                            <Crown className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-sacred-purple-light/30 text-sacred-purple-light hover:bg-sacred-purple-light/10 hover:border-sacred-purple-light/50 transition-all duration-300 flex items-center gap-2"
                        >
                          Preview Divine Wisdom
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sacred Call to Action */}
      <section className="relative z-10 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="sacred-card max-w-2xl mx-auto p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-black sacred-text mb-2">
                  Total XP Available: 3,075
                </div>
                <div className="text-lg text-sacred-purple-light font-light">
                  Complete all commandments to reach <span className="divine-text font-semibold">Divine Prophet</span> status
                </div>
              </div>
              
              <Link href="#">
                <Button 
                  size="lg"
                  className="sacred-gradient hover:sacred-gradient-alt text-divine-midnight font-bold px-12 py-6 text-xl transition-all duration-500 transform hover:scale-110 sacred-glow flex items-center gap-3"
                >
                  <Crown className="w-6 h-6" />
                  Begin All Sacred Commandments
                  <Sparkles className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}