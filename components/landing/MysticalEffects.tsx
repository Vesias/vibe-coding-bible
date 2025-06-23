'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  Sparkles, 
  Star, 
  Crown, 
  Zap, 
  Wand2, 
  Eye,
  Infinity as InfinityIcon,
  Heart,
  Diamond,
  Hexagon
} from 'lucide-react'

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
  symbol: any
  rotation: number
  scale: number
}

interface LightBeam {
  id: number
  angle: number
  length: number
  opacity: number
  color: string
  intensity: number
}

interface SacredSymbol {
  id: number
  symbol: string
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  color: string
}

export function MysticalEffects() {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([])
  const [lightBeams, setLightBeams] = useState<LightBeam[]>([])
  const [sacredSymbols, setSacredSymbols] = useState<SacredSymbol[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  // Sacred symbols from various traditions
  const symbols = ['☥', '☯', '🔯', '☪', '☸', '⚡', '✨', '🌟', '💎', '👁']
  const icons = [Sparkles, Star, Crown, Zap, Wand2, Eye, InfinityIcon, Heart, Diamond, Hexagon]
  const colors = [
    '#D4AF37', // Sacred Gold
    '#7C3AED', // Sacred Purple  
    '#6366F1', // Vibe Primary
    '#10B981', // Vibe Accent
    '#EC4899', // Vibe Secondary
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#06B6D4'  // Cyan
  ]

  // Initialize floating elements
  useEffect(() => {
    const createFloatingElements = () => {
      if (!containerRef.current) return
      
      const elements: FloatingElement[] = []
      
      for (let i = 0; i < 30; i++) {
        elements.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 20 + 10,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: icons[Math.floor(Math.random() * icons.length)],
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5
        })
      }
      setFloatingElements(elements)
    }

    const createLightBeams = () => {
      const beams: LightBeam[] = []
      
      for (let i = 0; i < 8; i++) {
        beams.push({
          id: i,
          angle: (360 / 8) * i,
          length: Math.random() * 200 + 100,
          opacity: Math.random() * 0.3 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          intensity: Math.random() * 0.8 + 0.2
        })
      }
      setLightBeams(beams)
    }

    const createSacredSymbols = () => {
      const symbolElements: SacredSymbol[] = []
      
      for (let i = 0; i < 15; i++) {
        symbolElements.push({
          id: i,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.8 + 0.4,
          opacity: Math.random() * 0.4 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      setSacredSymbols(symbolElements)
    }

    createFloatingElements()
    createLightBeams()
    createSacredSymbols()

    const handleResize = () => {
      createFloatingElements()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animate floating elements
  useEffect(() => {
    const animateElements = () => {
      setFloatingElements(prev => prev.map(element => {
        let newY = element.y - element.speed
        let newX = element.x + Math.sin(Date.now() * 0.001 + element.id) * 0.5
        
        // Reset position when element goes off screen
        if (newY < -element.size) {
          newY = window.innerHeight + element.size
          newX = Math.random() * window.innerWidth
        }
        
        return {
          ...element,
          x: newX,
          y: newY,
          rotation: element.rotation + 0.5,
          scale: element.scale + Math.sin(Date.now() * 0.002 + element.id) * 0.1
        }
      }))
    }

    const interval = setInterval(animateElements, 16) // ~60fps
    return () => clearInterval(interval)
  }, [])

  // Animate light beams
  useEffect(() => {
    const animateBeams = () => {
      setLightBeams(prev => prev.map(beam => ({
        ...beam,
        opacity: beam.opacity + Math.sin(Date.now() * 0.003 + beam.id) * 0.1,
        length: beam.length + Math.sin(Date.now() * 0.002 + beam.id) * 20,
        angle: beam.angle + 0.2
      })))
    }

    const interval = setInterval(animateBeams, 50)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Transform values based on mouse position
  const cursorGlowX = useTransform(springX, [0, window.innerWidth], [-100, 100])
  const cursorGlowY = useTransform(springY, [0, window.innerHeight], [-100, 100])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Mouse Cursor Glow Effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none z-50"
        style={{
          x: cursorGlowX,
          y: cursorGlowY,
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 100%)',
          filter: 'blur(20px)',
          transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`
        }}
      />

      {/* Divine Light Beams */}
      <div className="absolute inset-0">
        {lightBeams.map(beam => (
          <motion.div
            key={beam.id}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: beam.length,
              height: '2px',
              background: `linear-gradient(90deg, ${beam.color}${Math.floor(beam.opacity * 255).toString(16)}, transparent)`,
              transform: `rotate(${beam.angle}deg)`,
              filter: 'blur(1px)'
            }}
            animate={{
              opacity: [beam.opacity, beam.opacity * 2, beam.opacity],
              scaleY: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + beam.id * 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Floating Sacred Symbols */}
      <div className="absolute inset-0">
        {sacredSymbols.map(symbol => (
          <motion.div
            key={symbol.id}
            className="absolute text-4xl select-none"
            style={{
              left: `${symbol.x}%`,
              top: `${symbol.y}%`,
              color: symbol.color,
              opacity: symbol.opacity,
              fontSize: `${symbol.scale * 2}rem`,
              filter: `drop-shadow(0 0 10px ${symbol.color}40)`
            }}
            animate={{
              rotate: [symbol.rotation, symbol.rotation + 360],
              scale: [symbol.scale, symbol.scale * 1.2, symbol.scale],
              opacity: [symbol.opacity, symbol.opacity * 1.5, symbol.opacity]
            }}
            transition={{
              duration: 10 + symbol.id,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {symbol.symbol}
          </motion.div>
        ))}
      </div>

      {/* Floating Icon Elements */}
      <div className="absolute inset-0">
        {floatingElements.map(element => {
          const IconComponent = element.symbol
          return (
            <motion.div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
                transform: `rotate(${element.rotation}deg) scale(${element.scale})`
              }}
              animate={{
                scale: [element.scale, element.scale * 1.1, element.scale],
                opacity: [element.opacity, element.opacity * 1.5, element.opacity]
              }}
              transition={{
                duration: 2 + element.id * 0.1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <IconComponent
                size={element.size}
                color={element.color}
                style={{
                  filter: `drop-shadow(0 0 ${element.size / 2}px ${element.color}60)`,
                  opacity: element.opacity
                }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Sacred Geometry Particle System */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: colors[i % colors.length],
              boxShadow: `0 0 10px ${colors[i % colors.length]}`,
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`
            }}
            animate={{
              x: [0, Math.sin(i) * 100, 0],
              y: [0, Math.cos(i) * 100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Pulsing Sacred Energy Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border opacity-20"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
              borderColor: colors[i * 2],
              borderWidth: '1px'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2
            }}
          />
        ))}
      </div>

      {/* Divine Sparkle Trail */}
      <motion.div
        className="absolute w-6 h-6 pointer-events-none"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-sacred-gold"
            style={{
              boxShadow: '0 0 8px #D4AF37'
            }}
            animate={{
              x: [0, Math.cos(i * 2) * 20, 0],
              y: [0, Math.sin(i * 2) * 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeOut'
            }}
          />
        ))}
      </motion.div>

      {/* Sacred Corner Ornaments */}
      <div className="absolute top-8 left-8 opacity-30">
        <motion.div
          className="w-16 h-16 border-2 border-sacred-gold rounded-full flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Crown className="w-8 h-8 text-sacred-gold" />
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 opacity-30">
        <motion.div
          className="w-16 h-16 border-2 border-sacred-purple rounded-full flex items-center justify-center"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Eye className="w-8 h-8 text-sacred-purple" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 opacity-30">
        <motion.div
          className="w-16 h-16 border-2 border-vibe-primary rounded-full flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Zap className="w-8 h-8 text-vibe-primary" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 opacity-30">
        <motion.div
          className="w-16 h-16 border-2 border-vibe-accent rounded-full flex items-center justify-center"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Wand2 className="w-8 h-8 text-vibe-accent" />
        </motion.div>
      </div>

      {/* Mystical Screen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-sacred-gold/5 to-sacred-purple/5 opacity-50" />
    </div>
  )
}