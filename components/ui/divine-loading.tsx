import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Sacred Loading Spinner Component
const loadingSpinnerVariants = cva(
  "animate-sacred-rotation rounded-full border-2 border-transparent",
  {
    variants: {
      variant: {
        default: "border-t-primary border-r-primary/50",
        sacred: "border-t-sacred-tech-gold border-r-sacred-electric-indigo/50 shadow-sacred-glow",
        divine: "border-t-sacred-electric-indigo border-r-sacred-tech-gold/50 shadow-mystical-glow",
        mystical: "border-t-sacred-mystic-purple border-r-sacred-rose/50 shadow-matrix-glow",
        matrix: "border-t-sacred-matrix-green border-r-sacred-matrix-green/50 shadow-matrix-glow",
        prophet: "border-t-vibe-primary border-r-vibe-secondary/50"
      },
      size: {
        sm: "h-4 w-4 border",
        default: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-2",
        xl: "h-16 w-16 border-4",
        sacred: "h-sacred-lg w-sacred-lg border-2",
        divine: "h-sacred-xl w-sacred-xl border-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingSpinnerVariants> {}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(loadingSpinnerVariants({ variant, size }), className)}
      {...props}
    />
  )
)
LoadingSpinner.displayName = "LoadingSpinner"

// Sacred Pulse Loader
export const SacredPulse = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-6 w-6"
  }
  
  return (
    <div ref={ref} className={cn("flex space-x-2", className)} {...props}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-gradient-to-r from-sacred-tech-gold to-sacred-electric-indigo animate-sacred-pulse",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
})
SacredPulse.displayName = "SacredPulse"

// Matrix Rain Loader
export const MatrixRain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { count?: number }
>(({ className, count = 5, ...props }, ref) => (
  <div ref={ref} className={cn("flex space-x-1", className)} {...props}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-8 w-0.5 bg-sacred-matrix-green animate-matrix-rain"
        style={{
          animationDelay: `${i * 0.3}s`
        }}
      />
    ))}
  </div>
))
MatrixRain.displayName = "MatrixRain"

// Divine Geometry Loader
export const DivineGeometry = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative animate-sacred-rotation",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-sacred-tech-gold/30" />
      
      {/* Middle ring */}
      <div className="absolute inset-2 rounded-full border-2 border-sacred-electric-indigo/50 animate-sacred-rotation" 
           style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
      
      {/* Inner dot */}
      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gradient-to-r from-sacred-tech-gold to-sacred-electric-indigo animate-sacred-pulse" />
    </div>
  )
})
DivineGeometry.displayName = "DivineGeometry"

// Sacred Skeleton Loader
const skeletonVariants = cva(
  "animate-divine-shimmer rounded",
  {
    variants: {
      variant: {
        default: "bg-muted",
        sacred: "bg-gradient-to-r from-sacred-tech-gold/10 via-sacred-electric-indigo/10 to-sacred-tech-gold/10",
        divine: "bg-gradient-to-r from-sacred-midnight-blue/20 via-sacred-electric-indigo/20 to-sacred-midnight-blue/20",
        mystical: "bg-gradient-to-r from-sacred-mystic-purple/10 via-sacred-rose/10 to-sacred-mystic-purple/10"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

// Sacred Progress Ring
export const SacredProgressRing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    progress: number
    size?: "sm" | "md" | "lg"
    variant?: "sacred" | "divine" | "mystical" | "matrix"
  }
>(({ className, progress, size = "md", variant = "sacred", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }
  
  const strokeWidth = {
    sm: 2,
    md: 3,
    lg: 4
  }
  
  const colorClasses = {
    sacred: "stroke-sacred-tech-gold",
    divine: "stroke-sacred-electric-indigo", 
    mystical: "stroke-sacred-mystic-purple",
    matrix: "stroke-sacred-matrix-green"
  }
  
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div
      ref={ref}
      className={cn("relative", sizeClasses[size], className)}
      {...props}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth={strokeWidth[size]}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", colorClasses[variant])}
          style={{
            filter: `drop-shadow(0 0 6px var(--sacred-${variant === 'sacred' ? 'tech-gold' : variant === 'divine' ? 'electric-indigo' : variant === 'mystical' ? 'mystic-purple' : 'matrix-green'}))`
          }}
        />
      </svg>
      
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-xs font-bold", colorClasses[variant])}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
})
SacredProgressRing.displayName = "SacredProgressRing"

// Mystical Orb Loader
export const MysticalOrb = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-full animate-sacred-breathe",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-sacred-electric-indigo/40 to-transparent animate-sacred-pulse" />
      
      {/* Middle layer */}
      <div className="absolute inset-1 rounded-full bg-gradient-radial from-sacred-tech-gold/60 to-sacred-electric-indigo/40" />
      
      {/* Inner core */}
      <div className="absolute inset-2 rounded-full bg-gradient-radial from-sacred-digital-white to-sacred-tech-gold animate-mystical-glow" />
    </div>
  )
})
MysticalOrb.displayName = "MysticalOrb"

// Sacred Text Shimmer
export const SacredTextShimmer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    variant?: "sacred" | "divine" | "mystical"
  }
>(({ className, children, variant = "sacred", ...props }, ref) => {
  const gradientClasses = {
    sacred: "from-sacred-tech-gold via-sacred-electric-indigo to-sacred-tech-gold",
    divine: "from-sacred-electric-indigo via-sacred-divine-cyan to-sacred-electric-indigo",
    mystical: "from-sacred-mystic-purple via-sacred-rose to-sacred-mystic-purple"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-block bg-gradient-to-r bg-clip-text text-transparent animate-divine-shimmer",
        gradientClasses[variant],
        className
      )}
      style={{
        backgroundSize: "200% 100%"
      }}
      {...props}
    >
      {children}
    </div>
  )
})
SacredTextShimmer.displayName = "SacredTextShimmer"

// Full Page Sacred Loader
export const SacredPageLoader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message?: string
    variant?: "sacred" | "divine" | "mystical" | "matrix"
  }
>(({ className, message = "Loading...", variant = "sacred", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    <div className="flex flex-col items-center space-y-4">
      <DivineGeometry size="lg" />
      <SacredTextShimmer variant={variant === "matrix" ? "mystical" : variant} className="text-lg font-medium">
        {message}
      </SacredTextShimmer>
      <SacredPulse size="md" />
    </div>
  </div>
))
SacredPageLoader.displayName = "SacredPageLoader"

// Export all components
export {
  loadingSpinnerVariants,
  skeletonVariants
}