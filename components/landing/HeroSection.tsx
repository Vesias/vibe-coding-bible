import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Crown, Users } from 'lucide-react'

export function HeroSection() {
  const stats = [
    { 
      label: 'AI Tools Mastered', 
      value: '10+',
      icon: Sparkles,
      color: 'text-yellow-400'
    },
    { 
      label: 'Development Speed', 
      value: '8x',
      icon: Zap,
      color: 'text-blue-400'
    },
    { 
      label: 'Success Rate', 
      value: '95%',
      icon: Crown,
      color: 'text-purple-400'
    },
    { 
      label: 'Active Prophets', 
      value: '2.5K+',
      icon: Users,
      color: 'text-green-400'
    },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
          }}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-5xl">
          {/* Sacred Logo */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="text-8xl animate-pulse-glow">📜</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-ping" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Badge 
              variant="outline" 
              className="border-yellow-400/30 bg-yellow-400/10 text-yellow-400 px-6 py-2 text-sm font-medium hover:bg-yellow-400/20 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Transform Your Development in 30 Days
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="mb-8 text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Master the{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-sacred">
              10 Sacred Commandments
            </span>{' '}
            of Vibe Coding
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="mx-auto mb-10 max-w-3xl text-lg text-blue-200 sm:text-xl md:text-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Transform from coding novice to{' '}
            <span className="text-purple-300 font-semibold">AI-assisted development prophet</span>. 
            Build production-ready SaaS applications without writing a single line of code manually.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button 
              asChild 
              variant="prophet" 
              size="xl"
              className="group relative overflow-hidden shadow-2xl hover:shadow-vibe-primary/25"
            >
              <Link href="/workshops">
                <span className="relative z-10 flex items-center gap-2">
                  Begin Your Prophecy
                  <Crown className="w-5 h-5 transition-transform group-hover:scale-110" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="xl"
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-105"
            >
              <Link href="/preview">
                Preview the Bible
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="prophet-card border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-blue-300">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-col items-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <p className="text-sm text-blue-300 font-medium">
              Trusted by developers worldwide
            </p>
            <div className="flex items-center space-x-8 opacity-60">
              {['OpenAI', 'Anthropic', 'Cursor', 'GitHub'].map((brand, index) => (
                <div key={brand} className="h-10 px-6 bg-white/10 rounded-lg flex items-center justify-center text-white/70 text-sm font-medium hover:bg-white/20 transition-colors">
                  {brand}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}