'use client'

import * as React from "react"
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { ArrowRight, Sparkles, Crown, Zap } from 'lucide-react'

export interface DivineCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'sacred' | 'prophet' | 'divine' | 'primary'
  size?: 'default' | 'sm' | 'lg' | 'xl'
  animate?: boolean
  showIcon?: boolean
  icon?: React.ElementType
  children: React.ReactNode
  asChild?: boolean
}

const DivineCTA = React.forwardRef<HTMLButtonElement, DivineCTAProps>(
  ({ 
    className, 
    variant = 'sacred', 
    size = 'default',
    animate = true, 
    showIcon = true, 
    icon,
    children, 
    asChild = false,
    ...props 
  }, ref) => {
    const variants = {
      sacred: {
        className: "sacred-gradient text-white hover:opacity-90 shadow-2xl hover:shadow-sacred-gold/25 border-0",
        iconColor: "text-white",
        defaultIcon: Crown
      },
      prophet: {
        className: "bg-gradient-to-r from-vibe-primary to-vibe-secondary text-white hover:from-vibe-primary/90 hover:to-vibe-secondary/90 shadow-lg hover:shadow-xl hover:shadow-vibe-primary/25",
        iconColor: "text-white",
        defaultIcon: Sparkles
      },
      divine: {
        className: "bg-gradient-to-r from-sacred-gold to-sacred-purple text-black hover:from-sacred-gold/90 hover:to-sacred-purple/90 shadow-lg hover:shadow-xl hover:shadow-sacred-gold/25",
        iconColor: "text-black",
        defaultIcon: Crown
      },
      primary: {
        className: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
        iconColor: "text-white",
        defaultIcon: ArrowRight
      }
    }

    const config = variants[variant]
    const IconComponent = icon || config.defaultIcon

    
    const animationProps = animate ? {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      whileHover: { scale: 1.05, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 }
    } : {}

    if (false && !asChild) { // Temporarily disable animation to fix build
      const { 
        onDrag, 
        onDragStart, 
        onDragEnd, 
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        onTransitionEnd,
        ...buttonProps 
      } = props
      return (
        <motion.button
          ref={ref}
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-300 relative overflow-hidden group",
            size === 'sm' && "h-9 px-4 text-sm",
            size === 'default' && "h-10 px-6",
            size === 'lg' && "h-12 px-8 text-lg",
            size === 'xl' && "h-14 px-10 text-xl",
            config.className,
            className
          )}
          {...animationProps}
          onClick={buttonProps.onClick}
          disabled={buttonProps.disabled}
        >
          <span className="relative z-10 flex items-center gap-2">
            {children}
            {showIcon && <IconComponent className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${config.iconColor}`} />}
          </span>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Sparkle animation */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%'
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.5 
                }}
              />
            ))}
          </div>
        </motion.button>
      )
    }

    return (
      <Button
        ref={ref}
        asChild={asChild}
        className={cn(
          "inline-flex items-center gap-2 transition-all duration-300 relative overflow-hidden group",
          config.className,
          className
        )}
        size={size}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showIcon && <IconComponent className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${config.iconColor}`} />}
        </span>
      </Button>
    )
  }
)
DivineCTA.displayName = "DivineCTA"

export { DivineCTA }