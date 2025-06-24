'use client'

import { analyticsConfig, analyticsUtils } from './config'

// Global gtag function
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
    dataLayer: any[]
  }
}

// Initialize Google Analytics
export function initializeAnalytics() {
  if (!analyticsUtils.isEnabled()) return

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  
  // Define gtag function
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }

  // Configure Google Analytics
  window.gtag('js', new Date() as any)
  window.gtag('config', analyticsConfig.ga4.measurementId, analyticsConfig.ga4.config)
}

// Track page views
export function trackPageView(url?: string) {
  if (!analyticsUtils.isEnabled() || !window.gtag) return

  window.gtag('config', analyticsConfig.ga4.measurementId, {
    page_path: url || window.location.pathname + window.location.search,
    ...analyticsConfig.ga4.config
  })
}

// Track custom events
export function trackEvent(
  eventName: string, 
  parameters: Record<string, any> = {}
) {
  if (!analyticsUtils.isEnabled() || !window.gtag) return

  window.gtag('event', eventName, {
    event_category: parameters.category || 'engagement',
    event_label: parameters.label,
    value: parameters.value,
    ...parameters
  })
}

// Business Analytics Functions
export const businessAnalytics = {
  // Track user registration
  trackSignup(method: string = 'email') {
    trackEvent(analyticsConfig.events.SUBSCRIPTION_STARTED, {
      category: 'user',
      method,
      timestamp: new Date().toISOString()
    })
  },

  // Track subscription events
  trackSubscription(action: 'started' | 'cancelled' | 'upgraded' | 'downgraded', plan: string, value?: number) {
    const eventName = action === 'started' 
      ? analyticsConfig.events.SUBSCRIPTION_STARTED
      : analyticsConfig.events.SUBSCRIPTION_CANCELLED

    trackEvent(eventName, {
      category: 'revenue',
      plan,
      value,
      currency: 'EUR',
      timestamp: new Date().toISOString()
    })
  },

  // Track payment events
  trackPayment(status: 'successful' | 'failed', amount: number, plan: string, paymentMethod?: string) {
    const eventName = status === 'successful' 
      ? analyticsConfig.events.PAYMENT_SUCCESSFUL
      : analyticsConfig.events.PAYMENT_FAILED

    trackEvent(eventName, {
      category: 'revenue',
      value: amount,
      currency: 'EUR',
      plan,
      payment_method: paymentMethod,
      timestamp: new Date().toISOString()
    })
  },

  // Track conversion funnel
  trackFunnelStep(step: string, metadata?: Record<string, any>) {
    trackEvent('funnel_progression', {
      category: 'conversion',
      funnel_step: step,
      ...metadata,
      timestamp: new Date().toISOString()
    })
  },

  // Track referrals
  trackReferral(referralCode: string, successful: boolean = true) {
    if (successful) {
      trackEvent(analyticsConfig.events.REFERRAL_SUCCESSFUL, {
        category: 'growth',
        referral_code: referralCode,
        timestamp: new Date().toISOString()
      })
    }
  }
}

// Workshop Analytics Functions
export const workshopAnalytics = {
  // Track workshop start
  trackWorkshopStart(workshopId: string, workshopName: string) {
    trackEvent(analyticsConfig.events.WORKSHOP_STARTED, {
      category: 'education',
      workshop_id: workshopId,
      workshop_name: workshopName,
      timestamp: new Date().toISOString()
    })
  },

  // Track workshop completion
  trackWorkshopCompletion(workshopId: string, workshopName: string, duration: number) {
    trackEvent(analyticsConfig.events.WORKSHOP_COMPLETED, {
      category: 'education',
      workshop_id: workshopId,
      workshop_name: workshopName,
      duration_seconds: duration,
      timestamp: new Date().toISOString()
    })
  },

  // Track lesson progress
  trackLessonCompletion(workshopId: string, lessonId: string, lessonName: string) {
    trackEvent(analyticsConfig.events.LESSON_COMPLETED, {
      category: 'education',
      workshop_id: workshopId,
      lesson_id: lessonId,
      lesson_name: lessonName,
      timestamp: new Date().toISOString()
    })
  },

  // Track exercise completion
  trackExerciseCompletion(workshopId: string, exerciseId: string, success: boolean, attempts: number) {
    trackEvent(analyticsConfig.events.EXERCISE_COMPLETED, {
      category: 'education',
      workshop_id: workshopId,
      exercise_id: exerciseId,
      success,
      attempts,
      timestamp: new Date().toISOString()
    })
  },

  // Track AI mentor usage
  trackAIMentorUsage(workshopId: string, questionType: string, helpful: boolean) {
    trackEvent(analyticsConfig.events.AI_MENTOR_USED, {
      category: 'ai_interaction',
      workshop_id: workshopId,
      question_type: questionType,
      helpful,
      timestamp: new Date().toISOString()
    })
  },

  // Track code execution
  trackCodeExecution(workshopId: string, language: string, success: boolean) {
    trackEvent(analyticsConfig.events.CODE_EXECUTED, {
      category: 'education',
      workshop_id: workshopId,
      programming_language: language,
      success,
      timestamp: new Date().toISOString()
    })
  }
}

// Content Analytics Functions
export const contentAnalytics = {
  // Track search
  trackSearch(query: string, resultsCount: number) {
    trackEvent(analyticsConfig.events.SEARCH_PERFORMED, {
      category: 'content',
      search_term: query,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    })
  },

  // Track eBook downloads
  trackEbookDownload(format: 'pdf' | 'epub', chapter?: string) {
    trackEvent(analyticsConfig.events.EBOOK_DOWNLOADED, {
      category: 'content',
      format,
      chapter,
      timestamp: new Date().toISOString()
    })
  },

  // Track social sharing
  trackSocialShare(platform: string, contentType: string, contentId: string) {
    trackEvent(analyticsConfig.events.WORKSHOP_SHARED, {
      category: 'social',
      platform,
      content_type: contentType,
      content_id: contentId,
      timestamp: new Date().toISOString()
    })
  },

  // Track feedback submission
  trackFeedback(type: 'rating' | 'comment' | 'bug_report', rating?: number) {
    trackEvent(analyticsConfig.events.FEEDBACK_SUBMITTED, {
      category: 'engagement',
      feedback_type: type,
      rating,
      timestamp: new Date().toISOString()
    })
  }
}

// User Engagement Analytics
export const engagementAnalytics = {
  // Track scroll depth
  trackScrollDepth(percentage: number, page: string) {
    // Only track at 25%, 50%, 75%, 100%
    if ([25, 50, 75, 100].includes(percentage)) {
      trackEvent(analyticsConfig.events.SCROLL_DEPTH, {
        category: 'engagement',
        scroll_depth: percentage,
        page,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Track time on page
  trackTimeOnPage(seconds: number, page: string) {
    trackEvent('time_on_page', {
      category: 'engagement',
      duration_seconds: seconds,
      page,
      timestamp: new Date().toISOString()
    })
  },

  // Track outbound clicks
  trackOutboundClick(url: string, linkText?: string) {
    trackEvent(analyticsConfig.events.CLICK_OUTBOUND, {
      category: 'engagement',
      destination_url: url,
      link_text: linkText,
      timestamp: new Date().toISOString()
    })
  },

  // Track form interactions
  trackFormInteraction(formName: string, action: 'start' | 'submit' | 'error', field?: string) {
    trackEvent(analyticsConfig.events.FORM_SUBMISSION, {
      category: 'form',
      form_name: formName,
      action,
      field,
      timestamp: new Date().toISOString()
    })
  }
}

// Error Tracking
export const errorAnalytics = {
  // Track JavaScript errors
  trackError(error: Error, context?: string) {
    trackEvent(analyticsConfig.events.ERROR_OCCURRED, {
      category: 'error',
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500), // Limit stack trace
      context,
      timestamp: new Date().toISOString()
    })
  },

  // Track API errors
  trackAPIError(endpoint: string, status: number, message?: string) {
    trackEvent(analyticsConfig.events.ERROR_OCCURRED, {
      category: 'api_error',
      endpoint,
      status_code: status,
      error_message: message,
      timestamp: new Date().toISOString()
    })
  }
}

// Performance Tracking
export const performanceAnalytics = {
  // Track Core Web Vitals
  trackWebVitals(metric: any) {
    trackEvent('web_vitals', {
      category: 'performance',
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
      timestamp: new Date().toISOString()
    })
  },

  // Track page load times
  trackPageLoad(loadTime: number, page: string) {
    trackEvent('page_load_time', {
      category: 'performance',
      load_time_ms: loadTime,
      page,
      timestamp: new Date().toISOString()
    })
  }
}