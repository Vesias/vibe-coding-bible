import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 transition-all duration-300",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 transition-all duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 transition-all duration-300",
        // Sacred Variants - using inline styles instead of CSS classes
        sacred: "text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm relative overflow-hidden",
        divine: "text-white border hover:scale-105 transition-all duration-300 backdrop-blur-md",
        mystical: "text-white hover:scale-105 transition-all duration-300",
        matrix: "border hover:scale-105 transition-all duration-300 font-mono",
        prophet: "text-white hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300",
        // Premium Sacred Variants
        "divine-primary": "font-bold hover:scale-105 transition-all duration-300 backdrop-blur-sm",
        "sacred-ghost": "hover:scale-105 border border-transparent transition-all duration-300",
        "mystical-outline": "border-2 hover:scale-105 transition-all duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-lg px-10 text-base font-semibold",
        icon: "h-10 w-10",
        // Sacred Sizes
        "sacred-sm": "h-8 px-sacred-sm py-1 text-xs rounded-sacred-sm",
        "sacred-md": "h-10 px-sacred-md py-2 text-sm rounded-sacred",
        "sacred-lg": "h-12 px-sacred-lg py-3 text-base rounded-sacred-lg font-medium",
        "sacred-xl": "h-14 px-sacred-xl py-4 text-lg rounded-sacred-lg font-semibold",
        "divine-hero": "h-16 px-sacred-2xl py-5 text-xl rounded-sacred-lg font-bold"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Get sacred styling based on variant
    const getSacredStyle = () => {
      switch (variant) {
        case 'sacred':
          return {
            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.3), 0 8px 32px rgba(79, 70, 229, 0.25)'
          }
        case 'divine':
          return {
            background: 'linear-gradient(90deg, #1f2937 0%, #374151 100%)',
            color: '#ffffff',
            borderColor: 'rgba(37, 99, 235, 0.3)',
            boxShadow: '0 4px 16px rgba(31, 41, 55, 0.2)'
          }
        case 'mystical':
          return {
            background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 0 15px rgba(37, 99, 235, 0.4), 0 0 30px rgba(29, 78, 216, 0.3)'
          }
        case 'matrix':
          return {
            background: 'linear-gradient(90deg, #374151 0%, #1f2937 100%)',
            color: '#22c55e',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
          }
        case 'prophet':
          return {
            background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)'
          }
        case 'divine-primary':
          return {
            background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #2563eb 100%)',
            color: '#ffffff',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.3), 0 8px 32px rgba(79, 70, 229, 0.25)'
          }
        case 'sacred-ghost':
          return {
            color: '#2563eb',
            borderColor: 'transparent'
          }
        case 'mystical-outline':
          return {
            borderColor: '#4f46e5',
            color: '#4f46e5'
          }
        default:
          return {}
      }
    }
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className })
        )}
        style={{
          ...getSacredStyle(),
          ...style
        }}
        ref={ref}
        {...props}
        onMouseEnter={(e) => {
          // Enhanced hover effects for sacred variants
          if (variant === 'sacred-ghost') {
            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)'
            e.currentTarget.style.color = '#4f46e5'
            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)'
          } else if (variant === 'mystical-outline') {
            e.currentTarget.style.backgroundColor = '#4f46e5'
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.5)'
          }
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          if (variant === 'sacred-ghost') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#2563eb'
            e.currentTarget.style.borderColor = 'transparent'
          } else if (variant === 'mystical-outline') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#4f46e5'
            e.currentTarget.style.boxShadow = 'none'
          }
          props.onMouseLeave?.(e)
        }}
      >
        {props.children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Sacred Button Presets
export const SacredButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} variant="sacred" ref={ref} />
)
SacredButton.displayName = "SacredButton"

export const DivineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} variant="divine-primary" ref={ref} />
)
DivineButton.displayName = "DivineButton"

export const MysticalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} variant="mystical" ref={ref} />
)
MysticalButton.displayName = "MysticalButton"

export const MatrixButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} variant="matrix" ref={ref} />
)
MatrixButton.displayName = "MatrixButton"

export { Button, buttonVariants }