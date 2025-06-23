'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { 
  Users, 
  Code, 
  Trophy, 
  Zap, 
  Crown, 
  Sparkles, 
  TrendingUp,
  Globe,
  Star,
  Target,
  Rocket,
  Award
} from 'lucide-react'
import { SacredGeometry } from '@/components/illustrations/SacredGeometry'

interface StatItem {
  icon: any
  value: number
  suffix: string
  label: string
  description: string
  color: string
  glowColor: string
  countDuration: number
  pattern: string
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 2500,
    suffix: '+',
    label: 'Active Prophets',
    description: 'Developers transformed by the sacred commandments',
    color: 'text-vibe-accent',
    glowColor: 'shadow-vibe-accent/30',
    countDuration: 2000,
    pattern: 'flower-of-life'
  },
  {
    icon: Code,
    value: 10000,
    suffix: '+',
    label: 'Lines Generated',
    description: 'AI-assisted code written by our community',
    color: 'text-sacred-gold',
    glowColor: 'shadow-sacred-gold/30',
    countDuration: 2500,
    pattern: 'golden-spiral'
  },
  {
    icon: Trophy,
    value: 95,
    suffix: '%',
    label: 'Success Rate',
    description: 'Projects completed successfully using our methods',
    color: 'text-sacred-purple',
    glowColor: 'shadow-sacred-purple/30',
    countDuration: 1800,
    pattern: 'metatrons-cube'
  },
  {
    icon: Zap,
    value: 8,
    suffix: 'x',
    label: 'Speed Increase',
    description: 'Average development velocity improvement',
    color: 'text-vibe-primary',
    glowColor: 'shadow-vibe-primary/30',
    countDuration: 1500,
    pattern: 'vesica-piscis'
  },
  {
    icon: Crown,
    value: 50,
    suffix: '+',
    label: 'Master Prophets',
    description: 'Elite developers who completed all commandments',
    color: 'text-yellow-400',
    glowColor: 'shadow-yellow-400/30',
    countDuration: 1200,
    pattern: 'sri-yantra'
  },
  {
    icon: Globe,
    value: 45,
    suffix: '+',
    label: 'Countries',
    description: 'Global reach of the Vibe Coding movement',
    color: 'text-blue-400',
    glowColor: 'shadow-blue-400/30',
    countDuration: 1600,
    pattern: 'tree-of-life'
  }
]

const achievements = [
  {
    icon: Star,
    title: 'GitHub Stars',
    value: '1.2K+',
    description: 'Community-driven growth'
  },
  {
    icon: Target,
    title: 'Success Stories',
    value: '500+',
    description: 'Profitable SaaS launched'
  },
  {
    icon: Rocket,
    title: 'Startups Born',
    value: '120+',
    description: 'From sacred code'
  },
  {
    icon: Award,
    title: 'Industry Awards',
    value: '15+',
    description: 'Recognition received'
  }
]

function AnimatedCounter({ value, suffix, duration, delay = 0 }: { 
  value: number; 
  suffix: string; 
  duration: number; 
  delay?: number;
}) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true)
      const timer = setTimeout(() => {
        const increment = value / (duration / 16) // 60fps
        let currentCount = 0
        
        const counter = setInterval(() => {
          currentCount += increment
          if (currentCount >= value) {
            currentCount = value
            clearInterval(counter)
          }
          setCount(Math.floor(currentCount))
        }, 16)
        
        return () => clearInterval(counter)
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [isInView, value, duration, delay, hasStarted])

  return (
    <div ref={ref} className="text-5xl font-bold font-sacred">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export function SacredStatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-150px" })
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section 
      ref={containerRef}
      className="relative py-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ y, rotateY }}
      >
        <div className="absolute top-1/4 left-1/4">
          <SacredGeometry pattern="mandala" size={1000} color="#6366F1" accentColor="#D4AF37" animated={true} />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <SacredGeometry pattern="torus" size={800} color="#7C3AED" accentColor="#EC4899" animated={true} />
        </div>
      </motion.div>

      {/* Divine Light Rays */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-t from-transparent via-sacred-gold to-transparent"
            style={{
              left: `${12.5 * (i + 1)}%`,
              height: '100%',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-sacred-gold/10 backdrop-blur-sm border border-sacred-gold/30 rounded-full px-8 py-3 mb-8">
            <Sparkles className="w-6 h-6 text-sacred-gold animate-pulse" />
            <span className="text-sacred-gold font-medium text-lg">Sacred Metrics of Transformation</span>
            <Crown className="w-6 h-6 text-sacred-gold" />
          </div>
          
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-8 text-white font-sacred">
            <span className="bg-gradient-to-r from-sacred-gold via-sacred-purple to-vibe-primary bg-clip-text text-transparent">
              Divine Impact
            </span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl">Across the Realm</span>
          </h2>
          
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            Witness the sacred transformation spreading across the digital realm. 
            Every metric tells a story of developers ascending to prophetic heights.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="group relative"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              >
                {/* Sacred Geometry Background */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <SacredGeometry 
                    pattern={stat.pattern as any}
                    size={200}
                    color="#6366F1"
                    accentColor="#D4AF37"
                    animated={true}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </div>

                <div className="prophet-card bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-700 hover:scale-105 relative overflow-hidden group">
                  {/* Mystical Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${stat.glowColor.replace('shadow-', 'from-').replace('/30', '/10')} to-transparent`} />
                  
                  {/* Icon with Divine Aura */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-transparent rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-lg scale-150`} />
                    <div className={`relative w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color.replace('text-', 'from-')} ${stat.color.replace('text-', 'to-')}/80 rounded-full flex items-center justify-center shadow-lg ${stat.glowColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Animated Counter */}
                  <div className={`mb-3 ${stat.color} group-hover:text-white transition-colors duration-300`}>
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix} 
                      duration={stat.countDuration}
                      delay={index * 200}
                    />
                  </div>
                  
                  {/* Label */}
                  <div className="text-xl font-semibold text-white mb-3 group-hover:text-sacred-gold transition-colors duration-300">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-blue-300 leading-relaxed group-hover:text-blue-200 transition-colors duration-300">
                    {stat.description}
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse`} />
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className={`w-3 h-3 rounded-full ${stat.color.replace('text-', 'bg-')}/50 animate-bounce`} style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Achievement Badges */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 font-sacred">
            Sacred Achievements Unlocked
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.title}
                  className="group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  <div className="prophet-card bg-gradient-to-br from-sacred-gold/10 to-sacred-purple/10 backdrop-blur-sm border border-sacred-gold/20 p-6 text-center hover:from-sacred-gold/20 hover:to-sacred-purple/20 transition-all duration-500 hover:scale-105">
                    <Icon className="w-8 h-8 text-sacred-gold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl font-bold text-white mb-1 font-sacred">
                      {achievement.value}
                    </div>
                    <div className="text-sm font-medium text-sacred-gold mb-1">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-blue-300">
                      {achievement.description}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="inline-flex flex-col items-center gap-6 rounded-3xl border-2 border-sacred-gold/30 bg-gradient-to-r from-sacred-gold/10 via-sacred-purple/5 to-vibe-primary/10 backdrop-blur-sm px-12 py-8 shadow-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-sacred-gold mb-2 font-sacred">
                Join the Sacred Revolution
              </div>
              <div className="text-blue-200 mb-4">
                Become part of these legendary statistics
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-blue-400">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-vibe-accent" />
                  Growing Daily
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sacred-purple" />
                  Worldwide Community
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-sacred-gold" />
                  Elite Status
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}