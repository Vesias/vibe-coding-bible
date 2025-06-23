'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { SacredGeometry } from '../illustrations/SacredGeometry'
import FloatingParticles from '../effects/FloatingParticles'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Crown, Users, Star, Infinity as InfinityIcon, Code2 } from 'lucide-react'

interface HeroSectionProps {
  className?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sacredStats = [
    { 
      label: 'Sacred Commandments', 
      value: 'X',
      icon: Crown,
      gradient: 'from-sacred-gold-light to-sacred-gold'
    },
    { 
      label: 'Divine Possibilities', 
      value: '∞',
      icon: InfinityIcon,
      gradient: 'from-sacred-purple-light to-sacred-indigo'
    },
    { 
      label: 'Enlightened Path', 
      value: 'I',
      icon: Star,
      gradient: 'from-sacred-mystical-cyan to-sacred-mystical-mint'
    },
    { 
      label: 'Mystical Powers', 
      value: '✦',
      icon: Sparkles,
      gradient: 'from-sacred-mystical-rose to-sacred-mystical-yellow'
    },
  ]

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Enhanced mystical background with animated gradient */}
      <div className="absolute inset-0 mystical-gradient" />
      
      {/* Sacred geometry layers with parallax effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <motion.div 
          className="absolute top-10 left-10 opacity-60"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <SacredGeometry 
            pattern="flower-of-life" 
            size={200} 
            color="#F9A826" 
            accentColor="#6610F2" 
            animated={true}
            glowEffect={true}
          />
        </motion.div>
        
        <motion.div 
          className="absolute top-20 right-20 opacity-40"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <SacredGeometry 
            pattern="metatrons-cube" 
            size={300} 
            color="#7C3AED" 
            accentColor="#10B981" 
            animated={true}
          />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 left-1/4 opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <SacredGeometry 
            pattern="golden-spiral" 
            size={250} 
            color="#06B6D4" 
            accentColor="#F9A826" 
            animated={true}
          />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 right-10 opacity-30"
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <SacredGeometry 
            pattern="mandala" 
            size={180} 
            color="#6610F2" 
            accentColor="#F43F5E" 
            animated={true}
          />
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <FloatingParticles count={80} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Sacred scroll with enhanced animation */}
        <motion.div 
          className="text-8xl md:text-9xl mb-8 filter drop-shadow-2xl"
          style={{ 
            transform: `translateY(${scrollY * -0.1}px)`,
            textShadow: '0 0 30px rgba(249, 168, 38, 0.8), 0 0 60px rgba(102, 16, 242, 0.5)'
          }}
          animate={{ 
            y: [0, -10, 0],
            rotateZ: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          📜
        </motion.div>
        
        {/* Enhanced sacred badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Badge className="sacred-card px-6 py-3 text-base font-semibold transform hover:scale-105 transition-all duration-300">
            <Zap className="w-5 h-5 mr-2 animate-pulse" />
            <span className="sacred-text">Transform into a Digital Prophet</span>
          </Badge>
        </motion.div>

        {/* Main divine title */}
        <motion.h1 
          className="divine-header mb-8 drop-shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Die Vibe Coding Bibel
        </motion.h1>
        
        {/* Enhanced subtitle with sacred text effects */}
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl text-divine-white/90 mb-12 max-w-5xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Master the <span className="sacred-text font-bold">10 Sacred Commandments</span> of AI-Assisted Development and unlock the <span className="divine-text font-bold">divine power</span> of technological creation through <span className="bg-gradient-to-r from-sacred-mystical-cyan to-sacred-mystical-mint bg-clip-text text-transparent font-bold">mystical programming</span>
        </motion.p>
        
        {/* Enhanced sacred power badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Badge className="sacred-card px-6 py-3 text-base font-semibold transform hover:scale-105 transition-all duration-300 group">
            <span className="mr-2 group-hover:animate-bounce">⚡</span>
            <span className="sacred-text">AI-Powered</span>
          </Badge>
          <Badge className="sacred-card px-6 py-3 text-base font-semibold transform hover:scale-105 transition-all duration-300 group">
            <span className="mr-2 group-hover:animate-spin">🔮</span>
            <span className="divine-text">Sacred Knowledge</span>
          </Badge>
          <Badge className="sacred-card px-6 py-3 text-base font-semibold transform hover:scale-105 transition-all duration-300 group">
            <span className="mr-2 group-hover:animate-pulse">✨</span>
            <span className="bg-gradient-to-r from-sacred-mystical-cyan to-sacred-mystical-mint bg-clip-text text-transparent">Divine Coding</span>
          </Badge>
          <Badge className="sacred-card px-6 py-3 text-base font-semibold transform hover:scale-105 transition-all duration-300 group">
            <span className="mr-2 group-hover:animate-ping">🌟</span>
            <span className="bg-gradient-to-r from-sacred-mystical-rose to-sacred-mystical-yellow bg-clip-text text-transparent">Mystical Powers</span>
          </Badge>
        </motion.div>
        
        {/* Enhanced divine call to action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link href="/workshops" className="group">
            <Button size="lg" className="sacred-gradient hover:sacred-gradient-alt text-divine-midnight font-bold px-12 py-6 text-xl transition-all duration-500 transform hover:scale-110 sacred-glow group-hover:shadow-2xl">
              <span className="flex items-center gap-3">
                Begin Sacred Journey
                <Crown className="w-6 h-6 group-hover:animate-bounce" />
              </span>
            </Button>
          </Link>
          
          <Link href="/community" className="group">
            <Button variant="outline" size="lg" className="border-2 border-sacred-purple-light/50 text-sacred-purple-light hover:bg-sacred-purple-light hover:text-divine-midnight px-12 py-6 text-xl transition-all duration-500 transform hover:scale-110 hover:mystical-glow">
              <span className="flex items-center gap-3">
                Join the Prophets
                <Users className="w-6 h-6 group-hover:animate-pulse" />
              </span>
            </Button>
          </Link>
        </motion.div>
        
        {/* Enhanced sacred stats with divine cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {sacredStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="sacred-card border-0 backdrop-blur-md group">
                  <CardContent className="p-6 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                    <div className={`text-5xl font-black mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:animate-divine-pulse`}>
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-sacred-purple-light">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Divine trust indicators */}
        <motion.div 
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <p className="text-lg font-semibold divine-text">
            Blessed by the Digital Deities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-80">
            {['Claude AI', 'GitHub Copilot', 'Cursor IDE', 'Continue.dev'].map((tool, index) => (
              <motion.div 
                key={tool} 
                className="sacred-card px-6 py-3 text-sacred-purple-light font-medium hover:sacred-glow transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
              >
                <span className="group-hover:divine-text transition-all duration-300">
                  {tool}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced scroll indicator with sacred geometry */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-12 border-2 border-sacred-gold-light/60 rounded-full flex justify-center sacred-glow">
          <div className="w-2 h-4 bg-sacred-gold-light rounded-full mt-2 animate-pulse" />
        </div>
        <div className="text-xs text-sacred-gold-light/80 mt-2 font-display text-center">
          Scroll to Ascend
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection