// Performance configuration for the Vibe Coding Bible platform

export const PERFORMANCE_CONFIG = {
  // Lazy loading settings
  lazyLoading: {
    intersectionRootMargin: '50px',
    intersectionThreshold: 0.1,
    debounceDelay: 100,
    chunkLoadTimeout: 10000
  },

  // Virtual scrolling thresholds
  virtualScrolling: {
    enableThreshold: 100, // Enable virtual scrolling when list has more than 100 items
    itemHeight: 80,
    overscan: 5,
    bufferSize: 10
  },

  // Image optimization
  images: {
    defaultQuality: 75,
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    formats: ['webp', 'avif', 'jpeg'],
    lazyLoadOffset: '50px'
  },

  // Bundle splitting
  bundleSplitting: {
    maxChunkSize: 244000, // ~244KB
    minChunkSize: 20000,  // ~20KB
    maxAsyncRequests: 30,
    maxInitialRequests: 30
  },

  // Caching strategies
  caching: {
    workshopContent: 24 * 60 * 60 * 1000, // 24 hours
    userProfile: 15 * 60 * 1000,          // 15 minutes
    staticAssets: 7 * 24 * 60 * 60 * 1000, // 7 days
    apiResponses: 5 * 60 * 1000            // 5 minutes
  },

  // Performance monitoring
  monitoring: {
    enableMetrics: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10% sampling
    maxMetricEntries: 100,
    warningThresholds: {
      componentRender: 16,    // 16ms (60fps)
      chunkLoad: 3000,        // 3 seconds
      apiResponse: 1000,      // 1 second
      imageLoad: 2000         // 2 seconds
    }
  },

  // Feature flags for performance
  features: {
    enableServiceWorker: true,
    enablePrefetching: true,
    enablePreloading: true,
    enableImageOptimization: true,
    enableVirtualScrolling: true,
    enableAnimations: true,
    enableWebVitalsTracking: true
  },

  // Resource hints
  resourceHints: {
    preloadCriticalAssets: [
      '/fonts/inter-var.woff2',
      '/api/auth/session'
    ],
    prefetchOnHover: true,
    dnsPrefetch: [
      'https://api.anthropic.com',
      'https://api.openai.com',
      'https://fonts.googleapis.com'
    ]
  }
}

// Environment-specific overrides
export const getPerformanceConfig = () => {
  const config = { ...PERFORMANCE_CONFIG }

  // Development overrides
  if (process.env.NODE_ENV === 'development') {
    config.monitoring.enableMetrics = false
    config.caching.workshopContent = 0 // No caching in dev
    config.caching.userProfile = 0
    config.features.enableServiceWorker = false
  }

  // Production optimizations
  if (process.env.NODE_ENV === 'production') {
    config.images.defaultQuality = 85
    config.features.enablePrefetching = true
    config.features.enablePreloading = true
  }

  return config
}

// Performance budgets
export const PERFORMANCE_BUDGETS = {
  // Lighthouse metrics targets
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 95
  },

  // Core Web Vitals
  webVitals: {
    LCP: 2500,    // Largest Contentful Paint (ms)
    FID: 100,     // First Input Delay (ms)
    CLS: 0.1,     // Cumulative Layout Shift
    FCP: 1800,    // First Contentful Paint (ms)
    TTFB: 800     // Time to First Byte (ms)
  },

  // Bundle size limits
  bundleSize: {
    initial: 250000,      // 250KB initial bundle
    maxChunk: 200000,     // 200KB max chunk size
    totalJavaScript: 1000000, // 1MB total JS
    totalCSS: 100000,     // 100KB total CSS
    totalImages: 500000   // 500KB total images
  },

  // Network performance
  network: {
    maxRequests: 50,      // Max concurrent requests
    cacheHitRate: 0.85,   // 85% cache hit rate target
    compressionRatio: 0.7 // 70% compression ratio
  }
}

// Performance monitoring utilities
export const trackPerformanceMetric = (name: string, value: number) => {
  if (!PERFORMANCE_CONFIG.monitoring.enableMetrics) return

  // Sample rate check
  if (Math.random() > PERFORMANCE_CONFIG.monitoring.sampleRate) return

  // Send to analytics service (mock implementation)
  console.debug(`Performance metric: ${name} = ${value}ms`)

  // Check against warning thresholds
  const threshold = PERFORMANCE_CONFIG.monitoring.warningThresholds[name as keyof typeof PERFORMANCE_CONFIG.monitoring.warningThresholds]
  if (threshold && value > threshold) {
    console.warn(`Performance warning: ${name} (${value}ms) exceeded threshold (${threshold}ms)`)
  }
}

// Web Vitals tracking
export const trackWebVital = (name: string, value: number) => {
  if (!PERFORMANCE_CONFIG.features.enableWebVitalsTracking) return

  const budget = PERFORMANCE_BUDGETS.webVitals[name as keyof typeof PERFORMANCE_BUDGETS.webVitals]
  if (budget && value > budget) {
    console.warn(`Web Vital warning: ${name} (${value}) exceeded budget (${budget})`)
  }

  // Send to analytics
  trackPerformanceMetric(`webvital_${name}`, value)
}