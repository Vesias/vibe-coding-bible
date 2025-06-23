'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  Crown, 
  Users, 
  Star,
  ArrowDown,
  Play,
  BookOpen,
  Wand2
} from 'lucide-react'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'

interface FloatingParticle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

export function EnhancedHeroSection() {
  const [particles, setParticles] = useState<FloatingParticle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Initialize floating particles
  useEffect(() => {
    const createParticles = () => {
      const newParticles: FloatingParticle[] = []
      const colors = ['#D4AF37', '#7C3AED', '#6366F1', '#10B981', '#EC4899']
      
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      setParticles(newParticles)
    }

    createParticles()
    window.addEventListener('resize', createParticles)
    return () => window.removeEventListener('resize', createParticles)
  }, [])

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y - particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.5
      })).map(particle => 
        particle.y < -10 ? { ...particle, y: window.innerHeight + 10 } : particle
      ))
    }

    const interval = setInterval(animateParticles, 16) // ~60fps
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { 
      label: 'AI Tools Mastered', 
      value: '10+',
      icon: Sparkles,
      color: 'text-sacred-gold',
      description: 'Professional AI development tools'
    },
    { 
      label: 'Development Speed', 
      value: '8x',
      icon: Zap,
      color: 'text-vibe-primary',
      description: 'Faster than traditional coding'
    },
    { 
      label: 'Success Rate', 
      value: '95%',
      icon: Crown,
      color: 'text-sacred-purple',
      description: 'Project completion rate'
    },
    { 
      label: 'Active Prophets', 
      value: '2.5K+',
      icon: Users,
      color: 'text-vibe-accent',
      description: 'Community members worldwide'
    },
  ]

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Sacred Geometry Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, opacity }}
      >
        {/* Primary Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
        
        {/* Sacred Geometry Layers */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <SacredGeometry 
              pattern="flower-of-life" 
              size={600} 
              color="#6366F1" 
              accentColor="#D4AF37" 
              animated={true}
              glowEffect={true}
            />
          </div>
          <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <SacredGeometry 
              pattern="metatrons-cube" 
              size={400} 
              color="#7C3AED" 
              accentColor="#EC4899" 
              animated={true}
              glowEffect={true}
            />
          </div>
          <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2">
            <SacredGeometry 
              pattern="golden-spiral" 
              size={300} 
              color="#10B981" 
              accentColor="#D4AF37" 
              animated={true}
            />
          </div>
        </div>

        {/* Mystical Light Effects */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 60% 30%, rgba(99, 102, 241, 0.10) 0%, transparent 40%),
                radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.10) 0%, transparent 40%),
                radial-gradient(circle at 90% 10%, rgba(236, 72, 153, 0.10) 0%, transparent 40%)
              `
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-pulse"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          ))}
        </div>

        {/* Matrix-style flowing lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-sacred-gold to-transparent animate-pulse" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-vibe-primary to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-sacred-purple to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-6xl">
          
          {/* Sacred Scroll with Mystical Aura */}
          <motion.div 
            className="flex justify-center mb-8 relative"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Mystical Aura */}
              <div className="absolute -inset-8 bg-gradient-to-r from-sacred-gold/20 via-sacred-purple/20 to-vibe-primary/20 rounded-full animate-pulse blur-xl" />
              <div className="absolute -inset-4 bg-gradient-to-r from-sacred-gold/30 via-sacred-purple/30 to-vibe-primary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              
              {/* Sacred Scroll */}
              <div className="relative text-9xl transform hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl">
                📜
              </div>
              
              {/* Floating Sparkles */}
              <div className="absolute -top-6 -right-6 text-sacred-gold animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 text-vibe-primary animate-bounce" style={{ animationDelay: '1s' }}>
                <Star className="w-6 h-6" />
              </div>
              <div className="absolute -top-2 left-1/2 text-sacred-purple animate-bounce" style={{ animationDelay: '1.5s' }}>
                <Wand2 className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Sacred Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <Badge 
              variant="outline" 
              className="border-sacred-gold/50 bg-sacred-gold/10 text-sacred-gold px-8 py-3 text-base font-medium hover:bg-sacred-gold/20 transition-all duration-300 shadow-lg shadow-sacred-gold/20"
            >
              <Zap className="w-5 h-5 mr-3 animate-pulse" />
              Transform Your Development Journey in 30 Days
              <Crown className="w-5 h-5 ml-3" />
            </Badge>
          </motion.div>

          {/* Main Sacred Heading */}
          <motion.h1 
            className="mb-10 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="block">Master the</span>
            <span className="block bg-gradient-to-r from-sacred-gold via-sacred-purple to-vibe-primary bg-clip-text text-transparent font-sacred animate-pulse">
              10 Sacred Commandments
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mt-4">
              of{' '}
              <span className="bg-gradient-to-r from-vibe-primary via-vibe-secondary to-vibe-accent bg-clip-text text-transparent">
                Vibe Coding
              </span>
            </span>
          </motion.h1>

          {/* Mystical Subtitle */}
          <motion.div 
            className="mx-auto mb-12 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p className="text-xl text-blue-200 sm:text-2xl md:text-3xl leading-relaxed mb-6">
              Ascend from coding novice to{' '}
              <span className="text-sacred-gold font-semibold bg-sacred-gold/10 px-2 py-1 rounded">
                AI-assisted development prophet
              </span>
            </p>
            <p className="text-lg text-blue-300 sm:text-xl leading-relaxed">
              Build production-ready SaaS applications without writing a single line of code manually. 
              Experience the divine fusion of human creativity and artificial intelligence.
            </p>
          </motion.div>

          {/* Divine Call-to-Action Buttons */}
          <motion.div 
            className="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Button 
              asChild 
              size="xl"
              className="group relative overflow-hidden bg-gradient-to-r from-sacred-gold to-sacred-purple hover:from-sacred-purple hover:to-sacred-gold text-white font-bold px-12 py-6 text-xl shadow-2xl hover:shadow-sacred-gold/50 transform hover:scale-105 transition-all duration-500"
            >
              <Link href="/workshops">
                <span className="relative z-10 flex items-center gap-3">
                  <Crown className="w-6 h-6" />
                  Begin Your Sacred Journey
                  <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="xl"
              className="border-2 border-sacred-gold text-sacred-gold hover:bg-sacred-gold hover:text-black font-bold px-12 py-6 text-xl transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-sacred-gold/30"
            >
              <Link href="#commandments">
                <BookOpen className="w-6 h-6 mr-3" />
                Discover the Commandments
              </Link>
            </Button>
          </motion.div>

          {/* Sacred Statistics */}
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                >
                  <div className="prophet-card bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sacred-gold/5 via-transparent to-sacred-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon with Mystical Effect */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-sacred-gold to-sacred-purple rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-lg" />
                      <Icon className={`relative w-12 h-12 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    
                    {/* Value */}
                    <div className="text-4xl font-bold text-white mb-2 font-sacred group-hover:text-sacred-gold transition-colors duration-300">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-sm font-medium text-blue-300 mb-2 group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </div>
                    
                    {/* Description */}
                    <div className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {stat.description}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Divine Trust Indicators */}
          <motion.div 
            className="flex flex-col items-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-lg text-blue-300 font-medium">
              Powered by the most sacred AI tools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
              {['OpenAI GPT-4', 'Anthropic Claude', 'Cursor IDE', 'GitHub Copilot', 'v0.dev'].map((brand, index) => (
                <motion.div 
                  key={brand} 
                  className="h-12 px-6 bg-white/10 rounded-xl flex items-center justify-center text-white/80 text-sm font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                >
                  {brand}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <div className="flex flex-col items-center text-sacred-gold animate-bounce">
              <span className="text-sm font-medium mb-2">Discover the Sacred Wisdom</span>
              <ArrowDown className="w-6 h-6" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}