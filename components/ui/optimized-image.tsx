'use client'

import React, { useState, useCallback } from 'react'
import Image, { ImageProps } from 'next/image'
import { usePerformance } from '@/hooks/use-performance'
import { PERFORMANCE_CONFIG } from '@/lib/config/performance'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  lazy?: boolean
  critical?: boolean
  onLoadComplete?: (loadTime: number) => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  lazy = true,
  critical = false,
  onLoadComplete,
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [loadStartTime] = useState(() => performance.now())
  const { trackImageLoad } = usePerformance()

  const handleLoad = useCallback(() => {
    const loadTime = performance.now() - loadStartTime
    setIsLoading(false)
    trackImageLoad(currentSrc as string, loadTime)
    onLoadComplete?.(loadTime)
  }, [currentSrc, loadStartTime, trackImageLoad, onLoadComplete])

  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
    }
  }, [fallbackSrc, currentSrc])

  // Generate responsive sizes based on breakpoints
  const sizes = props.sizes || `
    (max-width: ${PERFORMANCE_CONFIG.images.breakpoints.sm}px) 100vw,
    (max-width: ${PERFORMANCE_CONFIG.images.breakpoints.md}px) 50vw,
    (max-width: ${PERFORMANCE_CONFIG.images.breakpoints.lg}px) 33vw,
    25vw
  `

  const loadingProps = lazy && !critical ? {
    loading: 'lazy' as const,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
  } : { loading: 'eager' as const }

  if (hasError && !fallbackSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        quality={PERFORMANCE_CONFIG.images.defaultQuality}
        {...loadingProps}
        {...props}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${className || ''}
        `}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

// Specific optimized image components for different use cases
export const HeroImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    critical={true}
    lazy={false}
    priority
    sizes="100vw"
  />
)

export const ThumbnailImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    sizes="150px"
    quality={80}
  />
)

export const WorkshopImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    sizes={`
      (max-width: 768px) 100vw,
      (max-width: 1024px) 50vw,
      33vw
    `}
  />
)

export const AvatarImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage
    {...props}
    sizes="64px"
    quality={90}
    className={`rounded-full ${props.className || ''}`}
  />
)

export default OptimizedImage