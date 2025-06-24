'use client'

import React, { lazy, Suspense, ComponentType } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Generic lazy loading wrapper with fallback
export function withLazyLoading<T = any>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <LazyLoadingFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  }
}

// Default loading fallback
export function LazyLoadingFallback({ 
  message = "Loading divine components...",
  className = ""
}: { 
  message?: string
  className?: string 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  )
}

// Specialized loading fallbacks for different components
export function WorkshopLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
      <LazyLoadingFallback message="Loading sacred workshop content..." />
    </div>
  )
}

export function DashboardLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
      <LazyLoadingFallback message="Loading your divine dashboard..." />
    </div>
  )
}

export function NavigationLoadingFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-20 bg-gray-100 border-b"></div>
    </div>
  )
}

// Performance optimization: Intersection Observer for lazy rendering
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isVisible
}

// Lazy rendering component for viewport-based loading
export function LazyRender({ 
  children, 
  fallback,
  rootMargin = '50px',
  threshold = 0.1 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { rootMargin, threshold })

  return (
    <div ref={ref}>
      {isVisible ? children : (fallback || <div className="h-32" />)}
    </div>
  )
}

// Preload components for critical path
export const preloadComponent = (importFunc: () => Promise<any>) => {
  if (typeof window !== 'undefined') {
    // Preload on idle or after user interaction
    const preload = () => importFunc()
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload)
    } else {
      setTimeout(preload, 1)
    }
  }
}

// Enhanced lazy loading with priority support
export function withPriorityLazyLoading<T = any>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  priority: 'high' | 'medium' | 'low' = 'medium',
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  // Preload high-priority components
  if (priority === 'high') {
    preloadComponent(importFunc)
  }
  
  return function PriorityLazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <LazyLoadingFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    )
  }
}