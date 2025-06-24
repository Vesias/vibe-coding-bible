'use client'

/**
 * Client-side referral tracking utilities
 */

export interface ReferralTrackingData {
  referralCode?: string
  landingPage?: string
  timestamp?: number
}

export class ReferralTracker {
  private static readonly STORAGE_KEY = 'vibe_referral_data'
  private static readonly EXPIRY_DAYS = 30

  /**
   * Initialize referral tracking on page load
   */
  static initialize() {
    if (typeof window === 'undefined') return

    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const referralCode = urlParams.get('ref')

    if (referralCode) {
      this.trackReferral(referralCode)
      
      // Clean URL without removing referral tracking
      const cleanUrl = new URL(window.location.href)
      cleanUrl.searchParams.delete('ref')
      window.history.replaceState({}, document.title, cleanUrl.toString())
    }
  }

  /**
   * Track a referral click
   */
  static async trackReferral(referralCode: string) {
    if (!referralCode) return

    try {
      // Store referral data locally
      const referralData: ReferralTrackingData = {
        referralCode,
        landingPage: window.location.pathname,
        timestamp: Date.now()
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(referralData))

      // Send tracking request to API
      await fetch('/api/referrals/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode,
          metadata: {
            landingPage: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        }),
      })

      console.log(`📈 Referral tracked: ${referralCode}`)
    } catch (error) {
      console.error('Error tracking referral:', error)
    }
  }

  /**
   * Get stored referral data
   */
  static getReferralData(): ReferralTrackingData | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      const data: ReferralTrackingData = JSON.parse(stored)
      
      // Check if expired
      if (data.timestamp && Date.now() - data.timestamp > this.EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
        this.clearReferralData()
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting referral data:', error)
      return null
    }
  }

  /**
   * Clear stored referral data
   */
  static clearReferralData() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * Check if user came from a referral
   */
  static hasActiveReferral(): boolean {
    const data = this.getReferralData()
    return data !== null && !!data.referralCode
  }

  /**
   * Get the active referral code
   */
  static getActiveReferralCode(): string | null {
    const data = this.getReferralData()
    return data?.referralCode || null
  }

  /**
   * Validate a referral code
   */
  static async validateReferralCode(code: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/referrals/track?code=${encodeURIComponent(code)}`)
      const data = await response.json()
      return data.valid === true
    } catch (error) {
      console.error('Error validating referral code:', error)
      return false
    }
  }

  /**
   * Generate referral URL
   */
  static generateReferralUrl(referralCode: string, path: string = '/'): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodingbible.agentland.saarland'
    const url = new URL(path, baseUrl)
    url.searchParams.set('ref', referralCode)
    return url.toString()
  }

  /**
   * Share referral link via Web Share API or fallback to clipboard
   */
  static async shareReferralLink(referralCode: string, customMessage?: string) {
    const url = this.generateReferralUrl(referralCode)
    const title = 'Vibe Coding Bible'
    const text = customMessage || `Lerne KI-unterstützte Entwicklung mit der Vibe Coding Bible und spare mit meinem Referral-Link!`

    try {
      // Try Web Share API first (mobile/modern browsers)
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url
        })
        return true
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      return true
    } catch (error) {
      console.error('Error sharing referral link:', error)
      return false
    }
  }

  /**
   * Track conversion when user completes purchase
   */
  static async trackConversion(purchaseData: {
    planId: string
    amount: number
    currency: string
  }) {
    const referralData = this.getReferralData()
    if (!referralData?.referralCode) return

    try {
      await fetch('/api/referrals/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: referralData.referralCode,
          purchaseData,
          trackingData: referralData
        }),
      })

      // Clear referral data after successful conversion
      this.clearReferralData()
    } catch (error) {
      console.error('Error tracking conversion:', error)
    }
  }
}

/**
 * Hook for React components to use referral tracking
 */
export function useReferralTracking() {
  const hasActiveReferral = ReferralTracker.hasActiveReferral()
  const activeReferralCode = ReferralTracker.getActiveReferralCode()

  return {
    hasActiveReferral,
    activeReferralCode,
    trackReferral: ReferralTracker.trackReferral,
    generateReferralUrl: ReferralTracker.generateReferralUrl,
    shareReferralLink: ReferralTracker.shareReferralLink,
    trackConversion: ReferralTracker.trackConversion,
    validateReferralCode: ReferralTracker.validateReferralCode
  }
}