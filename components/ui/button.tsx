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
        // Sacred Variants - Now using CSS variables
        sacred: "bg-brand-gradient text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm relative overflow-hidden shadow-brand-md",
        divine: "bg-neutral-gradient text-white border border-brand-primary/30 hover:scale-105 transition-all duration-300 backdrop-blur-md shadow-brand-sm",
        mystical: "bg-brand-secondary-gradient text-white hover:scale-105 transition-all duration-300 shadow-brand-glow",
        matrix: "bg-matrix-gradient text-semantic-success border border-semantic-success/30 hover:scale-105 transition-all duration-300 font-mono shadow-matrix-glow",
        prophet: "bg-brand-gradient text-white hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300",
        // Premium Sacred Variants
        "divine-primary": "bg-brand-divine-gradient text-white font-bold hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-brand-divine",
        "sacred-ghost": "text-brand-primary hover:bg-brand-primary/10 hover:scale-105 border border-transparent hover:border-brand-primary/30 transition-all duration-300",
        "mystical-outline": "border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white hover:scale-105 transition-all duration-300"
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
    
    // Sacred styling is now handled by CSS classes - no inline styles needed!
    // This improves performance and maintainability
    const getSacredStyle = () => {
      // All styling is now in CSS classes for better performance
      return {}
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
          // Hover effects are now handled by CSS classes for better performance
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          // Hover effects are now handled by CSS classes for better performance
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