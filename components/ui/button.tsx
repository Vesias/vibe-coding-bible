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
          "border-2 border-blue-600 bg-background text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-105 transition-all duration-300",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-105 transition-all duration-300",
        ghost: "text-gray-900 hover:bg-gray-100 hover:scale-105 transition-all duration-300",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-800 hover:scale-105 transition-all duration-300",
        // Sacred Variants - Enhanced for better contrast
        sacred: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 backdrop-blur-sm relative overflow-hidden shadow-lg",
        divine: "bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600 hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 backdrop-blur-md shadow-md",
        mystical: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg",
        matrix: "bg-gradient-to-r from-gray-900 to-black text-green-400 border border-green-400 hover:bg-black hover:scale-105 transition-all duration-300 font-mono shadow-lg",
        prophet: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300",
        // Premium Sacred Variants
        "divine-primary": "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-xl",
        "sacred-ghost": "text-blue-600 hover:bg-blue-50 hover:scale-105 border border-transparent hover:border-blue-300 transition-all duration-300",
        "mystical-outline": "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-105 transition-all duration-300"
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