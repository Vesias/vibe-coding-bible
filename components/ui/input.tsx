import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        sacred: "sacred-input focus-visible:ring-sacred-tech-gold",
        divine: "border-sacred-electric-indigo/20 bg-sacred-midnight-blue/5 focus-visible:border-sacred-tech-gold/50 focus-visible:ring-sacred-tech-gold/20 focus-visible:shadow-sacred-glow backdrop-blur-sm",
        mystical: "border-sacred-mystic-purple/30 bg-sacred-mystic-purple/5 focus-visible:border-sacred-electric-indigo/50 focus-visible:ring-sacred-electric-indigo/20 focus-visible:shadow-mystical-glow",
        matrix: "border-sacred-matrix-green/30 bg-sacred-cosmic-black/20 text-sacred-matrix-green focus-visible:border-sacred-matrix-green/60 focus-visible:ring-sacred-matrix-green/20 focus-visible:shadow-matrix-glow font-mono",
        ghost: "border-transparent bg-transparent hover:bg-muted/10 focus-visible:bg-background focus-visible:border-input focus-visible:ring-ring",
        glass: "border-border/30 bg-background/50 backdrop-blur-md focus-visible:bg-background/80 focus-visible:backdrop-blur-lg"
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-3 py-1 text-xs",
        lg: "h-11 px-4 py-3",
        xl: "h-12 px-sacred-lg py-3 text-base",
        sacred: "h-sacred-lg px-sacred-md py-sacred-sm rounded-sacred"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, icon, rightIcon, isLoading, ...props }, ref) => {
    const hasIcon = Boolean(icon)
    const hasRightIcon = Boolean(rightIcon) || isLoading
    
    if (hasIcon || hasRightIcon) {
      return (
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size }),
              hasIcon && "pl-10",
              hasRightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {(rightIcon || isLoading) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {isLoading ? (
                <div className="h-4 w-4 animate-sacred-rotation rounded-full border-2 border-transparent border-t-current" />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
      )
    }
    
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Sacred Input Presets
export const SacredInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input {...props} variant="sacred" ref={ref} />
)
SacredInput.displayName = "SacredInput"

export const DivineInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input {...props} variant="divine" ref={ref} />
)
DivineInput.displayName = "DivineInput"

export const MysticalInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input {...props} variant="mystical" ref={ref} />
)
MysticalInput.displayName = "MysticalInput"

export const MatrixInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input {...props} variant="matrix" ref={ref} />
)
MatrixInput.displayName = "MatrixInput"

export const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input {...props} variant="glass" ref={ref} />
)
GlassInput.displayName = "GlassInput"

// Sacred Search Input with built-in icon
export const SacredSearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'icon'>>(
  (props, ref) => (
    <Input
      {...props}
      variant="sacred"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      }
      ref={ref}
    />
  )
)
SacredSearchInput.displayName = "SacredSearchInput"

export { Input, inputVariants }