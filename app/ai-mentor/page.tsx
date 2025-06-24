'use client'

import { motion } from 'framer-motion'
import { SuperEnhancedAIMentor } from '@/components/ai/SuperEnhancedAIMentor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Mic, 
  Upload, 
  Code, 
  Users, 
  Zap, 
  Star, 
  Shield,
  Clock,
  Target,
  Sparkles,
  Crown,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function AIMentorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-midnight-blue via-black to-sacred-cosmic-black">
      {/* Hero Section */}
      <div className="relative py-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sacred-electric-indigo/20 rounded-full blur-3xl animate-sacred-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-sacred-tech-gold/10 rounded-full blur-3xl animate-sacred-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="outline" className="bg-black/20 border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Dashboard
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-sacred-tech-gold/20 to-sacred-electric-indigo/20 rounded-xl border border-sacred-gold/30"
              >
                <Brain className="h-8 w-8 text-sacred-gold" />
              </motion.div>
              <h1 className="text-4xl lg:text-6xl font-bold font-sacred bg-gradient-to-r from-sacred-gold via-sacred-electric-indigo to-sacred-digital-white bg-clip-text text-transparent">
                AI-Mentor System
              </h1>
            </div>
            
            <p className="text-xl text-sacred-digital-white/80 max-w-3xl mx-auto leading-relaxed">
              Erlebe die nächste Generation des AI-gestützten Lernens mit unseren göttlichen Code-Mentoren.
              Erweiterte Features für professionelle Entwicklung.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge className="bg-sacred-gold/20 text-sacred-gold border-sacred-gold/30 px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Multi-Model AI
              </Badge>
              <Badge className="bg-sacred-electric-indigo/20 text-sacred-electric-indigo border-sacred-electric-indigo/30 px-3 py-1">
                <Mic className="h-3 w-3 mr-1" />
                Voice Chat (Beta)
              </Badge>
              <Badge className="bg-sacred-matrix-green/20 text-sacred-matrix-green border-sacred-matrix-green/30 px-3 py-1">
                <Upload className="h-3 w-3 mr-1" />
                File Analysis
              </Badge>
              <Badge className="bg-sacred-tech-gold/20 text-sacred-tech-gold border-sacred-tech-gold/30 px-3 py-1">
                <Code className="h-3 w-3 mr-1" />
                Code Review
              </Badge>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              {
                icon: Brain,
                title: 'Multi-Model AI',
                description: 'GPT-4, Claude-3.5, Gemini Pro',
                color: 'sacred-gold'
              },
              {
                icon: Mic,
                title: 'Voice Chat',
                description: 'Sprach-basierte Interaktion',
                color: 'sacred-electric-indigo'
              },
              {
                icon: Upload,
                title: 'File Upload',
                description: 'Automatische Code-Analyse',
                color: 'sacred-matrix-green'
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Team-basierte Sessions',
                color: 'sacred-tech-gold'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/20 hover:border-sacred-gold/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/40 flex items-center justify-center mb-3`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-sacred-digital-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sacred-digital-white/70">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* AI Mentor Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <SuperEnhancedAIMentor
              className="max-w-7xl mx-auto"
              features={{
                voiceChat: true,
                codeReview: true,
                projectAnalysis: true,
                collaboration: true,
                fileUpload: true,
                realTimeHelp: true
              }}
              initialContext={{
                userLevel: 'intermediate',
                language: 'typescript'
              }}
            />
          </motion.div>

          {/* Mentors Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-sacred-digital-white flex items-center justify-center gap-2">
                  <Crown className="h-6 w-6 text-sacred-gold" />
                  Verfügbare AI-Mentoren
                </CardTitle>
                <CardDescription className="text-sacred-digital-white/70">
                  Jeder Mentor bringt einzigartige Expertise und Persönlichkeit mit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: 'Moses der Code-Geber',
                      role: 'Prophet',
                      expertise: 'Clean Architecture',
                      rating: 4.9,
                      xp: 25,
                      tier: 'Premium'
                    },
                    {
                      name: 'Ada die Algorithmus-Weise',
                      role: 'Mentor',
                      expertise: 'Algorithms & Data Structures',
                      rating: 4.8,
                      xp: 20,
                      tier: 'Free'
                    },
                    {
                      name: 'Alan der Gedankenleser',
                      role: 'Guide',
                      expertise: 'AI & Machine Learning',
                      rating: 4.9,
                      xp: 30,
                      tier: 'Premium'
                    },
                    {
                      name: 'Grace die Debug-Göttin',
                      role: 'Reviewer',
                      expertise: 'Debugging & Testing',
                      rating: 4.7,
                      xp: 15,
                      tier: 'Free'
                    }
                  ].map((mentor, index) => (
                    <Card key={index} className="bg-gradient-to-br from-sacred-gold/5 to-sacred-electric-indigo/5 border border-sacred-gold/20">
                      <CardHeader className="pb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sacred-gold/20 to-sacred-electric-indigo/20 flex items-center justify-center mb-2 mx-auto">
                          <span className="text-sacred-gold font-bold text-lg">
                            {mentor.name.charAt(0)}
                          </span>
                        </div>
                        <CardTitle className="text-sacred-digital-white text-center text-sm">
                          {mentor.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-2">
                        <Badge variant="outline" className="bg-sacred-purple/20 border-sacred-purple/30 text-sacred-purple text-xs">
                          {mentor.role}
                        </Badge>
                        <p className="text-xs text-sacred-digital-white/70">
                          {mentor.expertise}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sacred-digital-white">{mentor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-sacred-matrix-green" />
                            <span className="text-sacred-digital-white">+{mentor.xp} XP</span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            mentor.tier === 'Premium' 
                              ? 'bg-sacred-gold/20 border-sacred-gold/30 text-sacred-gold' 
                              : 'bg-sacred-matrix-green/20 border-sacred-matrix-green/30 text-sacred-matrix-green'
                          }`}
                        >
                          {mentor.tier}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Clock,
                label: 'Antwortzeit',
                value: '< 2s',
                description: 'Durchschnittlich'
              },
              {
                icon: Target,
                label: 'Genauigkeit',
                value: '95%',
                description: 'Code-Analyse'
              },
              {
                icon: Shield,
                label: 'Verfügbarkeit',
                value: '99.9%',
                description: 'Uptime'
              }
            ].map((stat, index) => (
              <Card key={index} className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-sacred-gold/20 text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sacred-gold/20 to-sacred-electric-indigo/20 flex items-center justify-center mb-4 mx-auto">
                    <stat.icon className="h-6 w-6 text-sacred-gold" />
                  </div>
                  <div className="text-3xl font-bold text-sacred-digital-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sacred-gold font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-sacred-digital-white/70">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}