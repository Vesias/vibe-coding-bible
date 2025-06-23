'use client'

import * as React from "react"
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Sparkles, Crown, Eye, Loader2 } from 'lucide-react'

export interface SacredLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sacred' | 'prophet' | 'divine' | 'minimal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  showIcon?: boolean
}

const SacredLoading = React.forwardRef<HTMLDivElement, SacredLoadingProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    text,
    showIcon = true,
    ...props 
  }, ref) => {
    const sizes = {
      sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-xs" },
      md: { container: "w-12 h-12", icon: "w-6 h-6", text: "text-sm" },
      lg: { container: "w-16 h-16", icon: "w-8 h-8", text: "text-base" },
      xl: { container: "w-24 h-24", icon: "w-12 h-12", text: "text-lg" }
    }

    const variants = {
      default: {
        icon: Loader2,
        color: "text-primary",
        bg: "bg-primary/10"
      },
      sacred: {
        icon: Sparkles,
        color: "text-sacred-gold",
        bg: "bg-sacred-gold/10"
      },
      prophet: {
        icon: Crown,
        color: "text-vibe-primary", 
        bg: "bg-vibe-primary/10"
      },
      divine: {
        icon: Eye,
        color: "text-sacred-purple",
        bg: "bg-sacred-purple/10"
      },
      minimal: {
        icon: Loader2,
        color: "text-muted-foreground",
        bg: "bg-transparent"
      }
    }

    const config = variants[variant]
    const sizeConfig = sizes[size]
    const Icon = config.icon

    if (variant === 'minimal') {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2",
            className
          )}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Icon className={cn(sizeConfig.icon, config.color)} />
          </motion.div>
          {text && (
            <span className={cn(sizeConfig.text, config.color)}>{text}</span>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8",
          className
        )}
        {...props}
      >
        {/* Sacred Loading Animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full border-2 border-transparent",
              variant === 'sacred' && "border-t-sacred-gold border-r-sacred-purple",
              variant === 'prophet' && "border-t-vibe-primary border-r-vibe-secondary", 
              variant === 'divine' && "border-t-sacred-gold border-r-sacred-blue",
              variant === 'default' && "border-t-primary border-r-primary/50",
              sizeConfig.container
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            className={cn(
              "rounded-full flex items-center justify-center",
              config.bg,
              sizeConfig.container
            )}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {showIcon && (
              <motion.div
                animate={{ 
                  rotate: variant === 'default' ? 360 : [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: variant === 'default' ? 2 : 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Icon className={cn(sizeConfig.icon, config.color)} />
              </motion.div>
            )}
          </motion.div>
          
          {/* Sacred particles for divine variant */}
          {variant === 'divine' && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-sacred-gold rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: `${(size === 'xl' ? 48 : size === 'lg' ? 32 : size === 'md' ? 24 : 16)}px 0`
                  }}
                  animate={{
                    rotate: 360,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Loading Text */}
        {text && (
          <motion.div
            className={cn(
              "text-center font-medium",
              sizeConfig.text,
              config.color
            )}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.div>
        )}

        {/* Sacred loading quotes */}
        {(variant === 'sacred' || variant === 'divine') && !text && (
          <motion.div
            className="text-center max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-sacred-gold italic">
              "Patience, young prophet, for divine wisdom takes time to manifest..."
            </p>
          </motion.div>
        )}
      </div>
    )
  }
)
SacredLoading.displayName = "SacredLoading"

// Preset loading components
const PageLoading = ({ text = "Loading sacred content..." }: { text?: string }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <SacredLoading variant="divine" size="xl" text={text} />
  </div>
)

const CardLoading = ({ text }: { text?: string }) => (
  <div className="h-64 flex items-center justify-center">
    <SacredLoading variant="sacred" size="lg" text={text} />
  </div>
)

const ButtonLoading = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <SacredLoading variant="minimal" size={size} showIcon />
)

const FullPageLoading = () => (
  <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center space-y-8">
      <motion.div
        className="text-6xl"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        📜
      </motion.div>
      
      <SacredLoading 
        variant="divine" 
        size="xl" 
        text="Initializing Divine Coding Environment..." 
      />
      
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-2xl font-bold text-sacred-gold font-sacred">
          Vibe Coding Bible
        </h2>
        <p className="text-blue-200">
          Preparing your sacred learning journey...
        </p>
      </motion.div>
    </div>
  </div>
)

export { 
  SacredLoading, 
  PageLoading, 
  CardLoading, 
  ButtonLoading, 
  FullPageLoading 
}