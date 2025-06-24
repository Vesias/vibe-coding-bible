'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { trackPageView, initializeAnalytics, performanceAnalytics } from '@/lib/analytics/gtag'
import { analyticsConfig, analyticsUtils } from '@/lib/analytics/config'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// Google Analytics Script Component
function GoogleAnalyticsScript() {
  if (!analyticsConfig.ga4.enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4.measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
    </>
  )
}

// Page View Tracker Component
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (analyticsUtils.isEnabled()) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)
    }
  }, [pathname, searchParams])

  return null
}

// Web Vitals Tracker
function WebVitalsTracker() {
  useEffect(() => {
    if (!analyticsUtils.isEnabled()) return

    // Track Core Web Vitals
    onCLS(performanceAnalytics.trackWebVitals)
    onINP(performanceAnalytics.trackWebVitals)
    onFCP(performanceAnalytics.trackWebVitals)
    onLCP(performanceAnalytics.trackWebVitals)
    onTTFB(performanceAnalytics.trackWebVitals)

    // Track page load time
    const startTime = performance.now()
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime
      performanceAnalytics.trackPageLoad(loadTime, window.location.pathname)
    })
  }, [])

  return null
}

// Error Boundary for Analytics
class AnalyticsErrorBoundary extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AnalyticsError'
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize analytics if consent is given
    const consent = analyticsUtils.getConsentStatus()
    if (consent?.analytics) {
      initializeAnalytics()
    }

    // Listen for consent changes
    const handleConsentUpdate = (event: CustomEvent) => {
      if (event.detail.analytics) {
        initializeAnalytics()
      } else {
        // Clear analytics data if consent is revoked
        analyticsUtils.clearAnalyticsData()
      }
    }

    window.addEventListener('consent-updated', handleConsentUpdate as EventListener)

    // Global error tracking
    const handleError = (event: ErrorEvent) => {
      if (analyticsUtils.isEnabled()) {
        const { error } = event
        if (error && !(error instanceof AnalyticsErrorBoundary)) {
          import('@/lib/analytics/gtag').then(({ errorAnalytics }) => {
            errorAnalytics.trackError(error, 'global_error_handler')
          })
        }
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (analyticsUtils.isEnabled()) {
        const error = new Error(String(event.reason))
        import('@/lib/analytics/gtag').then(({ errorAnalytics }) => {
          errorAnalytics.trackError(error, 'unhandled_promise_rejection')
        })
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('consent-updated', handleConsentUpdate as EventListener)
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <>
      <GoogleAnalyticsScript />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <WebVitalsTracker />
      {children}
    </>
  )
}