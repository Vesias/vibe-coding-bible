// Analytics Configuration
export const analyticsConfig = {
  // Google Analytics 4
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',
    enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    config: {
      page_title: 'Vibe Coding Bibel',
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      send_page_view: true,
      anonymize_ip: true,
      cookie_expires: 63072000, // 2 years in seconds
      cookie_domain: 'auto',
      cookie_update: true,
      respect_dnt: true,
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      restricted_data_processing: true // GDPR compliance
    }
  },

  // Custom Event Tracking
  events: {
    // User Journey Events
    WORKSHOP_STARTED: 'workshop_started',
    WORKSHOP_COMPLETED: 'workshop_completed',
    LESSON_COMPLETED: 'lesson_completed',
    EXERCISE_COMPLETED: 'exercise_completed',
    CERTIFICATE_GENERATED: 'certificate_generated',
    
    // Engagement Events
    VIDEO_WATCHED: 'video_watched',
    CODE_EXECUTED: 'code_executed',
    HINT_REQUESTED: 'hint_requested',
    AI_MENTOR_USED: 'ai_mentor_used',
    COLLABORATION_STARTED: 'collaboration_started',
    
    // Business Events
    SUBSCRIPTION_STARTED: 'subscription_started',
    SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
    PAYMENT_SUCCESSFUL: 'payment_successful',
    PAYMENT_FAILED: 'payment_failed',
    REFERRAL_SUCCESSFUL: 'referral_successful',
    TRIAL_STARTED: 'trial_started',
    TRIAL_CONVERTED: 'trial_converted',
    
    // Content Events
    EBOOK_DOWNLOADED: 'ebook_downloaded',
    WORKSHOP_SHARED: 'workshop_shared',
    FEEDBACK_SUBMITTED: 'feedback_submitted',
    SEARCH_PERFORMED: 'search_performed',
    
    // Technical Events
    PAGE_VIEW: 'page_view',
    SCROLL_DEPTH: 'scroll_depth',
    CLICK_OUTBOUND: 'click_outbound',
    FILE_DOWNLOAD: 'file_download',
    FORM_SUBMISSION: 'form_submission',
    ERROR_OCCURRED: 'error_occurred'
  }
}

// Business Metrics Configuration
export const businessMetrics = {
  // Revenue Tracking
  revenue: {
    subscription_tiers: {
      basic: { price: 29, currency: 'EUR' },
      pro: { price: 79, currency: 'EUR' },
      enterprise: { price: 199, currency: 'EUR' }
    },
    
    // Conversion Funnel
    funnel_steps: [
      'landing_page_view',
      'workshop_started',
      'trial_started',
      'subscription_started',
      'payment_successful'
    ],
    
    // Key Performance Indicators
    kpis: {
      mrr: 'monthly_recurring_revenue',
      ltv: 'lifetime_value',
      churn_rate: 'churn_rate',
      conversion_rate: 'conversion_rate',
      cac: 'customer_acquisition_cost',
      nps: 'net_promoter_score'
    }
  },

  // User Engagement Metrics
  engagement: {
    session_duration: 'session_duration',
    pages_per_session: 'pages_per_session',
    bounce_rate: 'bounce_rate',
    return_visitor_rate: 'return_visitor_rate',
    workshop_completion_rate: 'workshop_completion_rate',
    exercise_completion_rate: 'exercise_completion_rate'
  }
}

// Privacy Configuration (GDPR Compliance)
export const privacyConfig = {
  // Cookie Categories
  cookieCategories: {
    necessary: {
      name: 'Notwendig',
      description: 'Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich.',
      required: true
    },
    analytics: {
      name: 'Analytik',
      description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
      required: false
    },
    marketing: {
      name: 'Marketing',
      description: 'Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen.',
      required: false
    },
    functional: {
      name: 'Funktional',
      description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
      required: false
    }
  },

  // Data Processing Information
  dataProcessing: {
    controller: 'Vibe Coding Academy',
    email: 'datenschutz@vibecodingbible.agentland.saarland',
    purposes: [
      'Website-Analyse und -Optimierung',
      'Bereitstellung personalisierter Inhalte',
      'Verbesserung der Benutzererfahrung',
      'Messung der Marketingeffektivität'
    ],
    retention: {
      analytics: '26 Monate',
      functional: '12 Monate',
      marketing: '24 Monate'
    },
    rights: [
      'Recht auf Auskunft',
      'Recht auf Berichtigung',
      'Recht auf Löschung',
      'Recht auf Einschränkung der Verarbeitung',
      'Recht auf Datenübertragbarkeit',
      'Widerspruchsrecht'
    ]
  }
}

// Analytics Utility Functions
export const analyticsUtils = {
  // Check if analytics is enabled and consent given
  isEnabled(): boolean {
    if (!analyticsConfig.ga4.enabled) return false
    
    // Check for consent in localStorage
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent')
      if (consent) {
        const consentData = JSON.parse(consent)
        return consentData.analytics === true
      }
    }
    
    return false
  },

  // Get current consent status
  getConsentStatus() {
    if (typeof window === 'undefined') return null
    
    const consent = localStorage.getItem('cookie-consent')
    return consent ? JSON.parse(consent) : null
  },

  // Update consent status
  updateConsent(consentData: Record<string, boolean>) {
    if (typeof window === 'undefined') return
    
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...consentData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }))
    
    // Trigger consent update event
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: consentData }))
  },

  // Clear all analytics data
  clearAnalyticsData() {
    if (typeof window === 'undefined') return
    
    // Clear Google Analytics cookies
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
      }
    })
    
    // Clear localStorage analytics data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('analytics_') || key.startsWith('ga_')) {
        localStorage.removeItem(key)
      }
    })
  }
}