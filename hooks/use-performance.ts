'use client'

import { useEffect, useCallback } from 'react'
import { PERFORMANCE_BUDGETS, trackPerformanceMetric, trackWebVital } from '@/lib/config/performance'

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming
          
          // First Contentful Paint
          if (navigationEntry.name === 'first-contentful-paint') {
            trackWebVital('FCP', navigationEntry.startTime)
          }
          
          // Time to First Byte
          trackWebVital('TTFB', navigationEntry.responseStart - navigationEntry.requestStart)
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          trackWebVital('LCP', entry.startTime)
        }
        
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          trackWebVital('CLS', (entry as any).value)
        }
        
        if (entry.entryType === 'first-input') {
          trackWebVital('FID', (entry as any).processingStart - entry.startTime)
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'layout-shift', 'first-input'] })
    } catch (e) {
      // Fallback for unsupported browsers
      console.debug('Performance Observer not fully supported')
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const measureComponentRender = useCallback((componentName: string, renderTime: number) => {
    trackPerformanceMetric(`component_${componentName}`, renderTime)
  }, [])

  const measureAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now()
    try {
      const result = await operation()
      const endTime = performance.now()
      trackPerformanceMetric(operationName, endTime - startTime)
      return result
    } catch (error) {
      const endTime = performance.now()
      trackPerformanceMetric(`${operationName}_error`, endTime - startTime)
      throw error
    }
  }, [])

  return {
    measureComponentRender,
    measureAsyncOperation
  }
}

// Bundle size tracking
export function useBundleTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('.js')) {
          const resourceEntry = entry as PerformanceResourceTiming
          const transferSize = resourceEntry.transferSize || 0
          
          if (transferSize > PERFORMANCE_BUDGETS.bundleSize.maxChunk) {
            console.warn(`Large JS bundle detected: ${entry.name} (${Math.round(transferSize / 1024)}KB)`)
          }
          
          trackPerformanceMetric('bundle_load', resourceEntry.duration)
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.debug('Resource timing not supported')
    }

    return () => {
      observer.disconnect()
    }
  }, [])
}

// Image loading performance
export function useImagePerformance() {
  const trackImageLoad = useCallback((src: string, loadTime: number) => {
    trackPerformanceMetric('image_load', loadTime)
    
    if (loadTime > PERFORMANCE_BUDGETS.network.maxRequests * 100) {
      console.warn(`Slow image load: ${src} (${loadTime}ms)`)
    }
  }, [])

  return { trackImageLoad }
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) return

    const checkMemoryUsage = () => {
      const memory = (performance as any).memory
      if (memory) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
        
        trackPerformanceMetric('memory_used', usedMB)
        trackPerformanceMetric('memory_total', totalMB)
        
        // Warn if memory usage is high
        if (usedMB > 100) {
          console.warn(`High memory usage: ${usedMB}MB`)
        }
      }
    }

    // Check memory every 30 seconds
    const interval = setInterval(checkMemoryUsage, 30000)
    
    return () => clearInterval(interval)
  }, [])
}

// Network performance monitoring
export function useNetworkPerformance() {
  const trackAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      trackPerformanceMetric(`api_${endpoint}`, duration)
      
      if (duration > 3000) {
        console.warn(`Slow API call: ${endpoint} (${duration}ms)`)
      }
      
      return result
    } catch (error) {
      const endTime = performance.now()
      trackPerformanceMetric(`api_${endpoint}_error`, endTime - startTime)
      throw error
    }
  }, [])

  return { trackAPICall }
}

// Comprehensive performance hook
export function usePerformance() {
  const monitoring = usePerformanceMonitoring()
  const { trackImageLoad } = useImagePerformance()
  const { trackAPICall } = useNetworkPerformance()
  
  useBundleTracking()
  useMemoryMonitoring()

  return {
    ...monitoring,
    trackImageLoad,
    trackAPICall
  }
}