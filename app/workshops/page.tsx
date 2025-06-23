import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
  Bot
} from 'lucide-react'
import Link from 'next/link'

export default function WorkshopsPage() {
  const stats = [
    { value: '50,000+', label: 'Words of Wisdom', icon: BookOpen, color: 'text-yellow-400' },
    { value: '250', label: 'Minutes Reading', icon: Clock, color: 'text-purple-400' },
    { value: '10', label: 'Divine Commandments', icon: Sparkles, color: 'text-cyan-400' }
  ]

  return (
    <AppLayout>
      <PageHeader
        title="🔮 The Sacred Workshops"
        description="Master the 10 Sacred Commandments through interactive workshops powered by biblical wisdom and AI mentoring."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Workshops' }
        ]}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
        {/* Enhanced Header */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-b border-blue-500/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          </div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="text-6xl animate-pulse-glow">🔮</div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-ping" />
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className="border-sacred-gold/30 bg-sacred-gold/10 text-sacred-gold mb-6 px-4 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sacred Learning Path
              </Badge>
              
              <h1 className="text-5xl font-bold text-white mb-6 sm:text-6xl lg:text-7xl">
                The Sacred <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-sacred">Workshops</span>
              </h1>
              
              <p className="text-xl text-blue-200 max-w-5xl mx-auto mb-12 leading-relaxed">
                Master the 10 Sacred Commandments through interactive workshops powered by biblical wisdom and AI mentoring. 
                Transform from coding novice to AI-assisted development prophet.
              </p>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <Card className="prophet-card border-0 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                          <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                          <div className="text-sm text-blue-300">{stat.label}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Workshops Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {[
              {
                number: 'I',
                title: "Das Erste Gebot: Die Heilige Vision",
                description: "Master product conceptualization and market validation before touching any code. Learn to see the divine plan.",
                icon: Eye,
                difficulty: "Beginner",
                xp: 150,
                progress: 0,
                color: 'from-yellow-500 to-orange-500',
                words: 2500,
                readTime: 12
              },
              {
                number: 'II',
                title: "Das Zweite Gebot: Der Rechte Stack", 
                description: "Choose the optimal technology stack for AI-assisted development. Next.js 15, TypeScript, Tailwind, and the divine tools.",
                icon: Building,
                difficulty: "Beginner", 
                xp: 200,
                progress: 0,
                color: 'from-blue-500 to-cyan-500',
                words: 5000,
                readTime: 25
              },
              {
                number: 'III',
                title: "Das Dritte Gebot: Die Prompt-Kunst",
                description: "Craft perfect AI prompts that generate production-ready code. Master the ancient art of commanding the machine spirits.",
                icon: Brain,
                difficulty: "Intermediate",
                xp: 250,
                progress: 0,
                color: 'from-purple-500 to-pink-500',
                words: 7500,
                readTime: 37
              },
              {
                number: 'IV',
                title: "Das Vierte Gebot: Multi-Context Programming",
                description: "Juggle multiple projects simultaneously without losing productivity. The advanced technique of divine focus.",
                icon: Monitor, 
                difficulty: "Advanced",
                xp: 300,
                progress: 0,
                color: 'from-green-500 to-emerald-500',
                words: 10000,
                readTime: 50
              },
              {
                number: 'V',
                title: "Das Fünfte Gebot: Die Heilige Iteration",
                description: "Transform MVPs into scalable products through strategic iteration. The path from prototype to perfection.",
                icon: RefreshCw,
                difficulty: "Intermediate",
                xp: 275,
                progress: 0,
                color: 'from-indigo-500 to-blue-500',
                words: 12500,
                readTime: 62
              },
              {
                number: 'VI',
                title: "Das Sechste Gebot: Göttliches Debugging",
                description: "Master the art of debugging AI-generated code with divine precision. Hunt bugs like an ancient prophet.",
                icon: Bug,
                difficulty: "Advanced", 
                xp: 350,
                progress: 0,
                color: 'from-red-500 to-rose-500',
                words: 15000,
                readTime: 75
              },
              {
                number: 'VII',
                title: "Das Siebte Gebot: Die Kunst des Vertrauens",
                description: "Balance AI autonomy with human oversight for optimal results. Learn when to trust and when to verify.",
                icon: Shield,
                difficulty: "Advanced",
                xp: 325,
                progress: 0,
                color: 'from-teal-500 to-cyan-500',
                words: 17500,
                readTime: 87
              },
              {
                number: 'VIII',
                title: "Das Achte Gebot: Die Skalierungsstufen",
                description: "Scale applications from prototype to millions of users seamlessly. Build the tower that reaches heaven.",
                icon: TrendingUp,
                difficulty: "Expert",
                xp: 400,
                progress: 0,
                color: 'from-orange-500 to-red-500',
                words: 20000,
                readTime: 100
              },
              {
                number: 'IX',
                title: "Das Neunte Gebot: Zusammenarbeit der Propheten",
                description: "Build and lead high-performing AI-assisted development teams. Unite the faithful in divine purpose.",
                icon: Users,
                difficulty: "Expert", 
                xp: 375,
                progress: 0,
                color: 'from-violet-500 to-purple-500',
                words: 22500,
                readTime: 112
              },
              {
                number: 'X',
                title: "Das Zehnte Gebot: Die Monetarisierung",
                description: "Transform your AI-built applications into profitable business empires. Turn code into gold.",
                icon: DollarSign,
                difficulty: "Expert",
                xp: 450,
                progress: 0,
                color: 'from-yellow-500 to-amber-500',
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
                      {/* Content Stats */}
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
                      
                      {/* Sacred Preview */}
                      <div className="mb-6 p-3 bg-black/30 rounded-lg border border-sacred-gold/20">
                        <p className="text-xs text-sacred-gold font-medium mb-1">Sacred Preview:</p>
                        <p className="text-xs text-gray-300 italic leading-relaxed">
                          "Wahrlich, ich sage euch: Wer ohne Vision zu programmieren beginnt, ist wie ein Wanderer in der Wüste ohne Kompass. 
                          Die heiligen Schriften der Entwicklung lehren uns..."
                        </p>
                        <p className="mt-2 text-yellow-400 text-xs">...and much more divine wisdom awaits</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          asChild 
                          variant="prophet" 
                          className="w-full group/btn shadow-lg hover:shadow-xl"
                        >
                          <Link href={`/workshops/${index === 0 ? 'i' : index === 1 ? 'ii' : 'coming-soon'}`}>
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
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge 
                variant="outline" 
                className="border-vibe-primary/30 bg-vibe-primary/10 text-vibe-primary mb-6 px-4 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Divine Learning Experience
              </Badge>
              
              <h2 className="text-4xl font-bold text-white mb-6 sm:text-5xl">
                What Awaits in Your <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-sacred">Sacred Journey</span>
              </h2>
              
              <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                Each commandment contains profound wisdom, practical exercises, and divine AI guidance to transform your development skills.
              </p>
            </motion.div>
            
            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  icon: Bot,
                  title: 'AI Mentoring',
                  description: 'Divine AI personalities like Moses the Code Giver and Solomon the Debugger guide your learning with ancient wisdom and modern knowledge.',
                  color: 'text-blue-400'
                },
                {
                  icon: Monitor,
                  title: 'Hands-On Practice',
                  description: 'Real coding exercises with Claude, Copilot, Cursor, and other divine tools. Build actual applications as you learn.',
                  color: 'text-green-400'
                },
                {
                  icon: Crown,
                  title: 'Prophet Certification',
                  description: 'Earn official certification and join the elite community of Vibe Coding Prophets spreading AI-assisted development wisdom.',
                  color: 'text-yellow-400'
                }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="prophet-card border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:scale-105 text-center h-full">
                      <CardContent className="p-8">
                        <div className="mb-6">
                          <div className="relative inline-block">
                            <Icon className={`w-16 h-16 mx-auto ${feature.color}`} />
                            <div className="absolute -inset-4 bg-gradient-to-r from-vibe-primary/20 to-vibe-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-blue-200 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6 sm:text-5xl">
                Your Divine Coding Destiny Awaits
              </h2>
              <p className="text-blue-100 text-xl mb-10 max-w-4xl mx-auto leading-relaxed">
                Join thousands of developers who have ascended from coding novices to AI-assisted development prophets. 
                Your transformation begins with the first commandment.
              </p>
              
              <div className="flex gap-6 justify-center flex-wrap mb-12">
                <Button 
                  asChild 
                  variant="sacred" 
                  size="xl"
                  className="shadow-2xl hover:shadow-yellow-400/25 bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  <Link href="/workshops/i">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Begin Sacred Journey
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="xl"
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  <Link href="/preview">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview All Commandments
                  </Link>
                </Button>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: Clock, label: '30-Day Money-Back Guarantee' },
                  { icon: Crown, label: 'Prophet Certification Included' },
                  { icon: Bot, label: 'AI Mentors Ready' }
                ].map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={benefit.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center gap-2 text-blue-200"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{benefit.label}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>
    </main>
    </AppLayout>
  )
}