'use client'

import * as React from "react"
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from "@/lib/utils"

export interface SacredCardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  variant?: 'default' | 'prophet' | 'divine' | 'sacred'
  animate?: boolean
  delay?: number
}

const SacredCard = React.forwardRef<HTMLDivElement, SacredCardProps>(
  ({ className, variant = 'default', animate = true, delay = 0, children, ...props }, ref) => {
    const cardVariants = {
      default: "prophet-card border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15",
      prophet: "prophet-card border-0 bg-gradient-to-br from-vibe-primary/10 to-vibe-secondary/10 backdrop-blur-sm hover:from-vibe-primary/15 hover:to-vibe-secondary/15 border border-vibe-primary/20",
      divine: "prophet-card border-0 bg-gradient-to-br from-sacred-gold/10 to-sacred-purple/10 backdrop-blur-sm hover:from-sacred-gold/15 hover:to-sacred-purple/15 border border-sacred-gold/20",
      sacred: "prophet-card border-0 sacred-gradient/10 backdrop-blur-sm hover:shadow-2xl hover:shadow-sacred-gold/20 border border-sacred-gold/30"
    }

    const CardComponent = 'div' // Temporarily disable animation to fix build
    
    const animationProps = animate ? {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.6, delay },
      viewport: { once: true },
      whileHover: { scale: 1.02, transition: { duration: 0.2 } }
    } : {}

    return (
      <CardComponent
        className={cn(
          cardVariants[variant],
          "transition-all duration-500 hover:shadow-2xl hover:shadow-vibe-primary/10 overflow-hidden group",
          className
        )}
        ref={ref}
        {...animationProps}
        {...props}
      >
        {children}
      </CardComponent>
    )
  }
)
SacredCard.displayName = "SacredCard"

const SacredCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader ref={ref} className={cn("pb-4", className)} {...props} />
))
SacredCardHeader.displayName = "SacredCardHeader"

const SacredCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(
      "font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sacred-gold group-hover:to-sacred-purple group-hover:bg-clip-text transition-all duration-300",
      className
    )}
    {...props}
  />
))
SacredCardTitle.displayName = "SacredCardTitle"

const SacredCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn("text-blue-200 leading-relaxed", className)}
    {...props}
  />
))
SacredCardDescription.displayName = "SacredCardDescription"

const SacredCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("pt-0", className)} {...props} />
))
SacredCardContent.displayName = "SacredCardContent"

export { 
  SacredCard, 
  SacredCardHeader, 
  SacredCardTitle, 
  SacredCardDescription, 
  SacredCardContent 
}