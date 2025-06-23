'use client'

import * as React from "react"
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

export interface SacredSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sacred' | 'prophet' | 'divine'
  animate?: boolean
  lines?: number
}

const SacredSkeleton = React.forwardRef<HTMLDivElement, SacredSkeletonProps>(
  ({ className, variant = 'default', animate = true, lines = 1, ...props }, ref) => {
    const variants = {
      default: "bg-muted",
      sacred: "bg-gradient-to-r from-sacred-gold/20 to-sacred-purple/20",
      prophet: "bg-gradient-to-r from-vibe-primary/20 to-vibe-secondary/20",
      divine: "bg-gradient-to-r from-sacred-gold/30 via-sacred-purple/20 to-sacred-blue/20"
    }

    const SkeletonComponent = 'div' // Temporarily disable animation to fix build
    
    const animationProps = animate ? {
      animate: {
        opacity: [0.5, 1, 0.5],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : {}

    if (lines === 1) {
      return (
        <SkeletonComponent
          ref={ref}
          className={cn(
            "h-4 rounded-md",
            variants[variant],
            className
          )}
          {...animationProps}
          {...props}
        />
      )
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonComponent
            key={i}
            className={cn(
              "h-4 rounded-md",
              variants[variant],
              i === lines - 1 && "w-3/4" // Last line is shorter
            )}
            {...animationProps}
            style={animate ? { animationDelay: `${i * 0.1}s` } : {}}
          />
        ))}
      </div>
    )
  }
)
SacredSkeleton.displayName = "SacredSkeleton"

// Preset components
const CommandmentCardSkeleton = ({ animate = true }: { animate?: boolean }) => (
  <div className="prophet-card border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-6 rounded-xl space-y-4">
    <div className="flex items-center justify-between">
      <SacredSkeleton variant="sacred" className="w-16 h-16 rounded-full" animate={animate} />
      <SacredSkeleton variant="sacred" className="w-8 h-8 rounded-full" animate={animate} />
    </div>
    
    <SacredSkeleton variant="sacred" className="h-6 w-3/4" animate={animate} />
    <SacredSkeleton variant="sacred" lines={3} animate={animate} />
    
    <div className="flex justify-between items-center">
      <SacredSkeleton variant="sacred" className="h-6 w-20 rounded-full" animate={animate} />
      <SacredSkeleton variant="sacred" className="h-6 w-16" animate={animate} />
    </div>
    
    <SacredSkeleton variant="sacred" className="h-2 w-full rounded-full" animate={animate} />
    
    <div className="space-y-2">
      <SacredSkeleton variant="sacred" className="h-10 w-full rounded-lg" animate={animate} />
      <SacredSkeleton variant="sacred" className="h-10 w-full rounded-lg" animate={animate} />
    </div>
  </div>
)

const StatCardSkeleton = ({ animate = true }: { animate?: boolean }) => (
  <div className="prophet-card border-0 bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center space-y-3">
    <SacredSkeleton variant="divine" className="w-8 h-8 mx-auto rounded-full" animate={animate} />
    <SacredSkeleton variant="divine" className="h-8 w-16 mx-auto" animate={animate} />
    <SacredSkeleton variant="divine" className="h-4 w-24 mx-auto" animate={animate} />
  </div>
)

const WorkshopListSkeleton = ({ count = 6, animate = true }: { count?: number; animate?: boolean }) => (
  <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={animate ? { opacity: 0, y: 20 } : {}}
        animate={animate ? { opacity: 1, y: 0 } : {}}
        transition={animate ? { duration: 0.6, delay: i * 0.1 } : {}}
      >
        <CommandmentCardSkeleton animate={animate} />
      </motion.div>
    ))}
  </div>
)

const HeroSkeleton = ({ animate = true }: { animate?: boolean }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <div className="container relative z-10 mx-auto px-4 py-16 text-center space-y-8">
      {/* Logo skeleton */}
      <SacredSkeleton variant="divine" className="w-20 h-20 mx-auto rounded-full" animate={animate} />
      
      {/* Badge skeleton */}
      <SacredSkeleton variant="divine" className="h-8 w-64 mx-auto rounded-full" animate={animate} />
      
      {/* Title skeleton */}
      <div className="space-y-4">
        <SacredSkeleton variant="divine" className="h-12 w-3/4 mx-auto" animate={animate} />
        <SacredSkeleton variant="divine" className="h-12 w-2/3 mx-auto" animate={animate} />
      </div>
      
      {/* Description skeleton */}
      <div className="space-y-2 max-w-3xl mx-auto">
        <SacredSkeleton variant="divine" lines={3} animate={animate} />
      </div>
      
      {/* Buttons skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <SacredSkeleton variant="divine" className="h-14 w-48 rounded-lg" animate={animate} />
        <SacredSkeleton variant="divine" className="h-14 w-40 rounded-lg" animate={animate} />
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 max-w-4xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} animate={animate} />
        ))}
      </div>
    </div>
  </section>
)

export { 
  SacredSkeleton, 
  CommandmentCardSkeleton, 
  StatCardSkeleton, 
  WorkshopListSkeleton, 
  HeroSkeleton 
}