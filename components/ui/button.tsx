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
        // Sacred Variants
        sacred: "sacred-gradient text-white hover:scale-105 shadow-sacred-glow hover:shadow-sacred-depth transition-all duration-sacred backdrop-blur-sm relative overflow-hidden",
        divine: "bg-gradient-to-r from-sacred-midnight-blue to-sacred-cosmic-black text-sacred-digital-white border border-sacred-tech-gold/30 hover:border-sacred-tech-gold/60 hover:scale-105 shadow-divine-soft hover:shadow-sacred-glow transition-all duration-divine backdrop-blur-md",
        mystical: "bg-gradient-to-r from-sacred-mystic-purple to-sacred-electric-indigo text-sacred-digital-white hover:from-sacred-electric-indigo hover:to-sacred-mystic-purple hover:scale-105 shadow-mystical-glow transition-all duration-mystical",
        matrix: "bg-gradient-to-r from-sacred-cosmic-black to-sacred-midnight-blue text-sacred-matrix-green border border-sacred-matrix-green/30 hover:border-sacred-matrix-green/60 hover:scale-105 shadow-matrix-glow transition-all duration-sacred font-mono",
        prophet: "bg-gradient-to-r from-vibe-primary to-vibe-secondary text-white hover:from-vibe-primary/90 hover:to-vibe-secondary/90 hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300",
        // Premium Sacred Variants
        "divine-primary": "bg-gradient-to-r from-sacred-tech-gold via-sacred-electric-indigo to-sacred-tech-gold text-sacred-midnight-blue font-bold hover:scale-105 shadow-sacred-glow hover:shadow-sacred-depth transition-all duration-divine backdrop-blur-sm animate-divine-shimmer",
        "sacred-ghost": "text-sacred-tech-gold hover:bg-sacred-tech-gold/10 hover:text-sacred-electric-indigo hover:scale-105 border border-transparent hover:border-sacred-tech-gold/30 transition-all duration-sacred",
        "mystical-outline": "border-2 border-sacred-electric-indigo text-sacred-electric-indigo hover:bg-sacred-electric-indigo hover:text-sacred-digital-white hover:scale-105 hover:shadow-mystical-glow transition-all duration-mystical"
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Add sacred shimmer effect for divine-primary variant
    const isDivinePrimary = variant === 'divine-primary'
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isDivinePrimary && "relative overflow-hidden"
        )}
        ref={ref}
        {...props}
      >
        {isDivinePrimary && (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-sacred-digital-white/20 to-transparent animate-divine-shimmer" />
            <span className="relative z-10">{props.children}</span>
          </>
        )}
        {!isDivinePrimary && props.children}
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