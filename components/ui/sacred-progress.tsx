'use client'

import * as React from "react"
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Sparkles } from 'lucide-react'

export interface SacredProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  variant?: 'default' | 'sacred' | 'prophet' | 'divine'
  showLabel?: boolean
  label?: string
  animate?: boolean
  showIcon?: boolean
}

const SacredProgress = React.forwardRef<HTMLDivElement, SacredProgressProps>(
  ({ 
    className, 
    value, 
    variant = 'default',
    showLabel = true,
    label = 'Progress',
    animate = true,
    showIcon = false,
    ...props 
  }, ref) => {
    const variants = {
      default: {
        track: "bg-white/10",
        fill: "bg-gradient-to-r from-blue-400 to-purple-400",
        text: "text-blue-300"
      },
      sacred: {
        track: "bg-sacred-gold/10 border border-sacred-gold/20",
        fill: "bg-gradient-to-r from-sacred-gold to-sacred-purple",
        text: "text-sacred-gold"
      },
      prophet: {
        track: "bg-vibe-primary/10 border border-vibe-primary/20",
        fill: "bg-gradient-to-r from-vibe-primary to-vibe-secondary",
        text: "text-vibe-primary"
      },
      divine: {
        track: "bg-white/5 border border-sacred-gold/30",
        fill: "sacred-gradient",
        text: "text-sacred-gold"
      }
    }

    const config = variants[variant]

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-medium ${config.text} flex items-center gap-1`}>
              {showIcon && <Sparkles className="w-3 h-3" />}
              {label}
            </span>
            <span className={`text-xs font-medium ${config.text}`}>
              {Math.round(value)}%
            </span>
          </div>
        )}
        
        <div className={cn("relative h-2 w-full overflow-hidden rounded-full", config.track)}>
          {animate ? (
            <motion.div
              className={cn("h-full rounded-full", config.fill)}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ) : (
            <div
              className={cn("h-full rounded-full transition-all duration-500", config.fill)}
              style={{ width: `${value}%` }}
            />
          )}
          
          {/* Sacred glow effect for divine variant */}
          {variant === 'divine' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sacred-gold/50 to-sacred-purple/50 rounded-full"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: `${value}%` }}
            />
          )}
        </div>
      </div>
    )
  }
)
SacredProgress.displayName = "SacredProgress"

export { SacredProgress }