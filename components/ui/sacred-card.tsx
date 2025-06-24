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
  ({ className, variant = 'default', animate = true, delay = 0, children, style, ...props }, ref) => {
    const getCardStyle = () => {
      switch (variant) {
        case 'default':
          return {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.8) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '0.75rem'
          }
        case 'prophet':
          return {
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '0.75rem'
          }
        case 'divine':
          return {
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '0.75rem'
          }
        case 'sacred':
          return {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(239, 246, 255, 0.8) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(37, 99, 235, 0.1)'
          }
        default:
          return {}
      }
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
          "transition-all duration-500 overflow-hidden group",
          className
        )}
        style={{
          ...getCardStyle(),
          ...style
        }}
        ref={ref}
        {...animationProps}
        {...(props as any)}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          // Enhanced hover effects
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(37, 99, 235, 0.2), inset 0 1px 0 rgba(37, 99, 235, 0.2)'
          ;(props as any).onMouseEnter?.(e)
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          e.currentTarget.style.transform = 'translateY(0)'
          const baseStyle = getCardStyle()
          e.currentTarget.style.boxShadow = baseStyle.boxShadow || 'none'
          ;(props as any).onMouseLeave?.(e)
        }}
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
>(({ className, style, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(
      "font-semibold transition-all duration-300",
      className
    )}
    style={{
      color: '#1f2937',
      ...style
    }}
    onMouseEnter={(e: React.MouseEvent<HTMLHeadingElement>) => {
      e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)'
      e.currentTarget.style.webkitBackgroundClip = 'text'
      e.currentTarget.style.webkitTextFillColor = 'transparent'
      e.currentTarget.style.backgroundClip = 'text'
    }}
    onMouseLeave={(e: React.MouseEvent<HTMLHeadingElement>) => {
      e.currentTarget.style.background = 'none'
      e.currentTarget.style.webkitBackgroundClip = 'unset'
      e.currentTarget.style.webkitTextFillColor = '#1f2937'
      e.currentTarget.style.backgroundClip = 'unset'
    }}
    {...props}
  />
))
SacredCardTitle.displayName = "SacredCardTitle"

const SacredCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn("leading-relaxed", className)}
    style={{
      color: '#4b5563',
      ...style
    }}
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