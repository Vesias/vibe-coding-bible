'use client'

import * as React from "react"
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Sparkles, Crown, Shield, Zap } from 'lucide-react'

export interface ProphetBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'prophet' | 'divine'
  animate?: boolean
  showIcon?: boolean
  children: React.ReactNode
}

const ProphetBadge = React.forwardRef<HTMLDivElement, ProphetBadgeProps>(
  ({ className, variant = 'beginner', animate = false, showIcon = true, children, ...props }, ref) => {
    const variants = {
      beginner: {
        className: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
        icon: Sparkles,
        color: "text-green-400"
      },
      intermediate: {
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30",
        icon: Zap,
        color: "text-yellow-400"
      },
      advanced: {
        className: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
        icon: Shield,
        color: "text-orange-400"
      },
      expert: {
        className: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
        icon: Crown,
        color: "text-red-400"
      },
      prophet: {
        className: "bg-gradient-to-r from-vibe-primary/20 to-vibe-secondary/20 text-vibe-primary border-vibe-primary/30 hover:from-vibe-primary/30 hover:to-vibe-secondary/30",
        icon: Crown,
        color: "text-vibe-primary"
      },
      divine: {
        className: "bg-gradient-to-r from-sacred-gold/20 to-sacred-purple/20 text-sacred-gold border-sacred-gold/30 hover:from-sacred-gold/30 hover:to-sacred-purple/30",
        icon: Crown,
        color: "text-sacred-gold"
      }
    }

    const config = variants[variant]
    const Icon = config.icon

    const BadgeComponent = 'div' // Temporarily disable animation to fix build
    
    const animationProps = animate ? {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      whileHover: { scale: 1.05 }
    } : {}

    const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, onAnimationIteration, onTransitionEnd, ...divProps } = props

    return (
      <BadgeComponent
        ref={ref}
        {...animationProps}
        {...(animate ? {} : divProps)}
      >
        <Badge
          variant="secondary"
          className={cn(
            "text-xs border transition-all duration-300 cursor-default",
            config.className,
            className
          )}
        >
          {showIcon && <Icon className={`w-3 h-3 mr-1 ${config.color}`} />}
          {children}
        </Badge>
      </BadgeComponent>
    )
  }
)
ProphetBadge.displayName = "ProphetBadge"

export { ProphetBadge }