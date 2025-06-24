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
  colors = ['#2563eb', '#4f46e5', '#1d4ed8', '#3730a3', '#eff6ff'],
  className = ''
}) => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
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

  // Don't render anything on server
  if (!mounted) {
    return null
  }

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
    </div>
  )
}

export default FloatingParticles