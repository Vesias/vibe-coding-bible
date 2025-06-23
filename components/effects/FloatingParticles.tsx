'use client'

import React, { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
  delay: number
}

interface FloatingParticlesProps {
  count?: number
  colors?: string[]
  className?: string
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 50,
  colors = ['#F9A826', '#6610F2', '#7C3AED', '#10B981', '#06B6D4'],
  className = ''
}) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 20 + 10,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 15
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
  }, [count, colors])

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-float"
          style={{
            left: `${particle.x}%`,
            top: '100%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animationDuration: `${particle.speed}s`,
            animationDelay: `${particle.delay}s`,
            filter: `blur(${particle.size / 4}px)`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`
          }}
        />
      ))}
      
      {/* Sacred geometry symbols as particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`symbol-${i}`}
          className="absolute text-sacred-gold/20 animate-float"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 80 + 10}%`,
            fontSize: `${Math.random() * 30 + 20}px`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        >
          {['⚡', '🔮', '✨', '⭐', '💫', '🌟', '✦', '◆'][i]}
        </div>
      ))}
    </div>
  )
}

export default FloatingParticles