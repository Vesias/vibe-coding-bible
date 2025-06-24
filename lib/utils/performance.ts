// Performance optimization utilities

import React, { useCallback, useMemo, useRef, useEffect } from 'react'

// Debounce hook for expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for frequent operations
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  React.useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now()
      setThrottledValue(value)
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, interval)

      return () => clearTimeout(timerId)
    }
  }, [value, interval])

  return throttledValue
}

// Memoized component wrapper
export function withMemo<T extends object>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return React.memo(Component, areEqual)
}

// Virtual scrolling for large lists
export function useVirtualScrolling({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: any[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemsCount + overscan * 2
  )

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  )

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  }
}

// Image optimization utilities
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality = 75
): string {
  // This would integrate with your image optimization service
  // For now, return the original src
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())

  const paramString = params.toString()
  return paramString ? `${src}?${paramString}` : src
}

// Bundle splitting utilities
export function shouldLoadFeature(feature: string): boolean {
  // Logic to determine if a feature should be loaded
  // Based on user preferences, subscription tier, etc.
  const userPreferences = getUserPreferences()
  const subscriptionTier = getSubscriptionTier()

  const featureFlags: Record<string, boolean> = {
    'collaboration': subscriptionTier !== 'free',
    'ai-mentor': true,
    'advanced-workshops': subscriptionTier === 'premium',
    'community-features': true
  }

  return featureFlags[feature] ?? true
}

function getUserPreferences() {
  // Mock implementation - would fetch from user settings
  return {
    enableAnimations: true,
    reducedMotion: false,
    highPerformanceMode: false
  }
}

function getSubscriptionTier() {
  // Mock implementation - would fetch from user context
  return 'free' // 'free' | 'pro' | 'premium'
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startMeasure(name: string): void {
    performance.mark(`${name}-start`)
  }

  endMeasure(name: string): number {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name)[0]
    const duration = measure?.duration || 0

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(duration)

    return duration
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name) || []
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }

  getMetrics(): Record<string, { average: number; samples: number }> {
    const result: Record<string, { average: number; samples: number }> = {}
    
    this.metrics.forEach((times, name) => {
      result[name] = {
        average: this.getAverageTime(name),
        samples: times.length
      }
    })

    return result
  }

  clearMetrics(): void {
    this.metrics.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }
}

// React performance hook
export function usePerformanceMonitor(name: string) {
  const monitor = PerformanceMonitor.getInstance()

  useEffect(() => {
    monitor.startMeasure(name)
    return () => {
      monitor.endMeasure(name)
    }
  }, [name])

  return {
    getMetrics: () => monitor.getMetrics(),
    getAverageTime: () => monitor.getAverageTime(name)
  }
}

// Code splitting based on user interaction
export function loadComponentOnInteraction<T extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  trigger: 'hover' | 'click' | 'focus' = 'hover'
) {
  return function InteractiveLoader(props: T & { children: React.ReactNode }) {
    const [Component, setComponent] = React.useState<React.ComponentType<T> | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const loadComponent = useCallback(async () => {
      if (Component || isLoading) return
      
      setIsLoading(true)
      try {
        const { default: LoadedComponent } = await importFunc()
        setComponent(() => LoadedComponent)
      } catch (error) {
        console.error('Failed to load component:', error)
      } finally {
        setIsLoading(false)
      }
    }, [Component, isLoading])

    const triggerProps = {
      [trigger === 'hover' ? 'onMouseEnter' : trigger === 'click' ? 'onClick' : 'onFocus']: loadComponent
    }

    if (Component) {
      return React.createElement(Component, props)
    }

    return React.createElement(
      'div',
      triggerProps,
      props.children,
      isLoading && React.createElement('span', { className: 'text-xs text-gray-500 ml-2' }, 'Loading...')
    )
  }
}