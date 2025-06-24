'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sacredButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-105',
        secondary: 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white hover:shadow-xl hover:from-indigo-700 hover:to-blue-800 transform hover:scale-105',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface SacredButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sacredButtonVariants> {
  asChild?: boolean
}

const SacredButton = forwardRef<HTMLButtonElement, SacredButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(sacredButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SacredButton.displayName = 'SacredButton'

export { SacredButton, sacredButtonVariants }