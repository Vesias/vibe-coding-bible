import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border bg-card shadow-md hover:shadow-lg transition-all duration-300",
        sacred: "sacred-card hover:scale-[1.02] transition-all duration-sacred",
        divine: "divine-card hover:shadow-sacred-glow transition-all duration-divine",
        mystical: "bg-gradient-to-br from-sacred-mystic-purple/10 to-sacred-electric-indigo/10 border-sacred-electric-indigo/20 backdrop-blur-md hover:border-sacred-electric-indigo/40 hover:shadow-mystical-glow transition-all duration-mystical",
        matrix: "bg-gradient-to-br from-sacred-cosmic-black/90 to-sacred-midnight-blue/90 border-sacred-matrix-green/30 backdrop-blur-lg hover:border-sacred-matrix-green/60 hover:shadow-matrix-glow transition-all duration-sacred",
        prophet: "prophet-card",
        glass: "bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/70 hover:backdrop-blur-2xl transition-all duration-500",
        floating: "sacred-card hover:scale-105 hover:-translate-y-2 transition-all duration-mystical shadow-divine-soft hover:shadow-sacred-depth"
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-sacred-xl",
        sacred: "p-sacred-lg",
        divine: "p-sacred-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, size }), className)}
    {...props}
  />
))
Card.displayName = "Card"

const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5",
  {
    variants: {
      variant: {
        default: "p-6",
        sacred: "p-sacred-lg",
        divine: "p-sacred-xl",
        compact: "p-4"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardHeaderVariants({ variant }), className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const cardTitleVariants = cva(
  "font-semibold leading-none tracking-tight",
  {
    variants: {
      variant: {
        default: "text-foreground",
        sacred: "sacred-heading text-lg",
        divine: "divine-text text-xl font-sacred font-bold",
        mystical: "mystical-text text-lg font-heading font-bold",
        matrix: "text-sacred-matrix-green font-mono font-bold"
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof cardTitleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(cardTitleVariants({ variant, size }), className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const cardDescriptionVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      variant: {
        default: "text-sm",
        sacred: "text-sm text-muted-foreground/80",
        divine: "text-sm text-sacred-digital-white/70",
        mystical: "text-sm text-sacred-electric-indigo/70",
        matrix: "text-xs text-sacred-matrix-green/70 font-mono"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof cardDescriptionVariants>
>(({ className, variant, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(cardDescriptionVariants({ variant }), className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const cardContentVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "p-6 pt-0",
        sacred: "p-sacred-lg pt-0",
        divine: "p-sacred-xl pt-0",
        compact: "p-4 pt-0",
        flush: "p-0"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardContentVariants({ variant }), className)} {...props} />
))
CardContent.displayName = "CardContent"

const cardFooterVariants = cva(
  "flex items-center",
  {
    variants: {
      variant: {
        default: "p-6 pt-0",
        sacred: "p-sacred-lg pt-0",
        divine: "p-sacred-xl pt-0",
        compact: "p-4 pt-0"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardFooterVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardFooterVariants({ variant }), className)} {...props} />
))
CardFooter.displayName = "CardFooter"

// Sacred Card Presets
export const SacredCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} variant="sacred" className={className} {...props} />
))
SacredCard.displayName = "SacredCard"

export const DivineCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} variant="divine" className={className} {...props} />
))
DivineCard.displayName = "DivineCard"

export const MysticalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} variant="mystical" className={className} {...props} />
))
MysticalCard.displayName = "MysticalCard"

export const MatrixCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} variant="matrix" className={className} {...props} />
))
MatrixCard.displayName = "MatrixCard"

export const FloatingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} variant="floating" className={className} {...props} />
))
FloatingCard.displayName = "FloatingCard"

export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card ref={ref} variant="glass" className={className} {...props} />
))
GlassCard.displayName = "GlassCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants
}