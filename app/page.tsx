import React from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { CommandmentsPreview } from '@/components/landing/CommandmentsPreview'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Bot, Code, Trophy, Sparkles, Users, Clock, Target } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Bot,
      title: 'AI Mentoring',
      description: 'Divine AI personalities like Moses the Code Giver and Solomon the Debugger guide your learning with ancient wisdom and modern knowledge.',
      color: 'text-blue-400'
    },
    {
      icon: Code,
      title: 'Hands-On Practice', 
      description: 'Real coding exercises with Claude, Copilot, Cursor, and other divine tools. Build actual applications as you learn.',
      color: 'text-green-400'
    },
    {
      icon: Trophy,
      title: 'Prophet Certification',
      description: 'Earn official certification and join the elite community of Vibe Coding Prophets spreading AI-assisted development wisdom.',
      color: 'text-yellow-400'
    }
  ]

  const benefits = [
    { icon: Clock, label: '30-Day Money-Back Guarantee' },
    { icon: Trophy, label: 'Prophet Certification Included' },
    { icon: Bot, label: 'AI Mentors Ready' },
    { icon: Users, label: 'Active Community' },
    { icon: Target, label: '95% Success Rate' },
    { icon: Sparkles, label: 'Lifetime Updates' }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Commandments Preview */}
      <CommandmentsPreview />

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-gray-900">
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
                className="border-vibe-primary/30 bg-vibe-primary/10 text-vibe-primary mb-6 px-4 py-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                What Awaits in Your Sacred Journey
              </Badge>
              
              <h2 className="text-4xl font-bold text-white mb-6 sm:text-5xl">
                Transform Your <span className="text-transparent bg-gradient-to-r from-vibe-primary to-vibe-secondary bg-clip-text">Development Skills</span>
              </h2>
              
              <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                Each commandment contains profound wisdom, practical exercises, and divine AI guidance to transform your development skills.
              </p>
            </motion.div>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => {
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

      {/* CTA Section */}
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
                <Link href="/workshops">
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
                  Preview All Commandments
                </Link>
              </Button>
            </div>
            
            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center"
                  >
                    <Icon className="w-6 h-6 text-blue-200 mb-2" />
                    <span className="text-xs text-blue-200">{benefit.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="text-3xl">📜</div>
              <h3 className="text-2xl font-bold font-sacred">Die Vibe Coding Bibel</h3>
            </div>
            <p className="text-slate-300 mb-4">Master AI-Assisted Development with the 10 Sacred Commandments</p>
            <p className="text-sm text-slate-400">© 2025 vibecodingbible.agentland.saarland - All rights reserved</p>
          </div>
        </div>
      </footer>
    </main>
  )
}