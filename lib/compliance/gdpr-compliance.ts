/**
 * GDPR and German Legal Compliance Helper
 * Handles data protection, user rights, and German billing compliance
 */

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

export interface UserDataExport {
  profile: any
  subscriptions: any[]
  payments: any[]
  progress: any[]
  achievements: any[]
  posts: any[]
  interactions: any[]
  analytics: any[]
}

export interface DataDeletionResult {
  success: boolean
  deletedData: string[]
  retainedData: string[]
  reason?: string
}

export class GDPRComplianceHelper {
  private supabase: any

  constructor() {
    this.supabase = null
  }

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Export all user data for GDPR Article 20 (Data Portability)
   */
  async exportUserData(userId: string): Promise<UserDataExport> {
    const supabase = await this.getSupabase()

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // Get subscription data
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)

      // Get payment history
      const { data: payments } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', userId)

      // Get learning progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      // Get achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements(name, description, category)
        `)
        .eq('user_id', userId)

      // Get community posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', userId)

      // Get AI interactions (anonymized)
      const { data: interactions } = await supabase
        .from('ai_interactions')
        .select(`
          created_at,
          interaction_type,
          response_quality_score,
          was_helpful,
          processing_time_ms
        `)
        .eq('user_id', userId)

      // Get analytics (aggregated)
      const { data: analytics } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)

      return {
        profile: profile || {},
        subscriptions: subscriptions || [],
        payments: payments || [],
        progress: progress || [],
        achievements: achievements || [],
        posts: posts || [],
        interactions: interactions || [],
        analytics: analytics || []
      }
    } catch (error) {
      console.error('Error exporting user data:', error)
      throw new Error('Failed to export user data')
    }
  }

  /**
   * Delete user data for GDPR Article 17 (Right to Erasure)
   */
  async deleteUserData(userId: string, retainForLegal = true): Promise<DataDeletionResult> {
    const supabase = await this.getSupabase()
    const deletedData: string[] = []
    const retainedData: string[] = []

    try {
      // Check if user has active subscription
      const { data: activeSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      if (activeSubscription) {
        return {
          success: false,
          deletedData: [],
          retainedData: [],
          reason: 'Cannot delete data while subscription is active. Please cancel subscription first.'
        }
      }

      // Delete personal data (GDPR allows deletion)
      await supabase.from('ai_interactions').delete().eq('user_id', userId)
      deletedData.push('AI Interactions')

      await supabase.from('user_achievements').delete().eq('user_id', userId)
      deletedData.push('Achievements')

      await supabase.from('user_progress').delete().eq('user_id', userId)
      deletedData.push('Learning Progress')

      await supabase.from('user_analytics').delete().eq('user_id', userId)
      deletedData.push('Analytics Data')

      await supabase.from('notifications').delete().eq('user_id', userId)
      deletedData.push('Notifications')

      await supabase.from('user_bookmarks').delete().eq('user_id', userId)
      deletedData.push('Bookmarks')

      // Anonymize community posts (retain for community value)
      await supabase
        .from('community_posts')
        .update({ 
          user_id: null,
          title: '[Deleted User]',
          content: '[Content removed at user request]'
        })
        .eq('user_id', userId)
      deletedData.push('Community Posts (anonymized)')

      if (retainForLegal) {
        // Retain payment data for German tax law (10 years)
        retainedData.push('Payment History (required for tax compliance)')
        retainedData.push('Subscription Records (required for billing compliance)')
      } else {
        // Complete deletion requested
        await supabase.from('payment_history').delete().eq('user_id', userId)
        deletedData.push('Payment History')

        await supabase.from('subscriptions').delete().eq('user_id', userId)
        deletedData.push('Subscription Records')
      }

      // Anonymize profile (keep minimal data for referral tracking if needed)
      await supabase
        .from('profiles')
        .update({
          email: `deleted_${userId}@example.com`,
          full_name: '[Deleted User]',
          username: null,
          avatar_url: null,
          bio: null,
          github_username: null,
          discord_username: null,
          linkedin_url: null,
          twitter_username: null,
          website_url: null,
          learning_preferences: {},
          notification_preferences: {},
          is_public: false
        })
        .eq('id', userId)
      deletedData.push('Personal Profile Data')

      return {
        success: true,
        deletedData,
        retainedData
      }
    } catch (error) {
      console.error('Error deleting user data:', error)
      throw new Error('Failed to delete user data')
    }
  }

  /**
   * Generate data processing consent record
   */
  async recordConsent(userId: string, consentType: string, ipAddress: string) {
    const supabase = await this.getSupabase()

    try {
      await supabase
        .from('consent_records')
        .insert({
          user_id: userId,
          consent_type: consentType,
          ip_address: ipAddress,
          consent_given: true,
          consent_date: new Date().toISOString(),
          legal_basis: 'consent'
        })
    } catch (error) {
      console.error('Error recording consent:', error)
    }
  }

  /**
   * Withdraw consent for specific data processing
   */
  async withdrawConsent(userId: string, consentType: string) {
    const supabase = await this.getSupabase()

    try {
      await supabase
        .from('consent_records')
        .insert({
          user_id: userId,
          consent_type: consentType,
          consent_given: false,
          consent_date: new Date().toISOString()
        })

      // Handle specific consent withdrawals
      switch (consentType) {
        case 'marketing':
          await supabase
            .from('profiles')
            .update({
              notification_preferences: {
                email: false,
                marketing: false,
                push: false
              }
            })
            .eq('id', userId)
          break

        case 'analytics':
          await supabase
            .from('user_analytics')
            .delete()
            .eq('user_id', userId)
          break

        case 'ai_interactions':
          await supabase
            .from('ai_interactions')
            .delete()
            .eq('user_id', userId)
          break
      }
    } catch (error) {
      console.error('Error withdrawing consent:', error)
    }
  }

  /**
   * German invoice compliance
   */
  async ensureGermanInvoiceCompliance(paymentId: string) {
    try {
      const invoice = await stripe.invoices.retrieve(paymentId)
      
      // Ensure invoice has required German elements
      const requiredFields = {
        customer_name: invoice.customer_name,
        customer_address: invoice.customer_address,
        customer_tax_id: invoice.customer_tax_id,
        tax_percent: invoice.tax_percent,
        invoice_number: invoice.number,
        invoice_date: new Date(invoice.created * 1000).toLocaleDateString('de-DE')
      }

      // Check if all required fields are present
      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value)
        .map(([key]) => key)

      if (missingFields.length > 0) {
        console.warn('Invoice missing German compliance fields:', missingFields)
      }

      return {
        compliant: missingFields.length === 0,
        missingFields,
        invoice: requiredFields
      }
    } catch (error) {
      console.error('Error checking invoice compliance:', error)
      return { compliant: false, missingFields: [], invoice: null }
    }
  }

  /**
   * Generate cancellation confirmation (German law requires 14-day notice)
   */
  async generateCancellationNotice(subscriptionId: string) {
    const supabase = await this.getSupabase()

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const endDate = new Date(subscription.current_period_end * 1000)

      const notice = {
        subscription_id: subscriptionId,
        cancellation_date: new Date().toISOString(),
        service_end_date: endDate.toISOString(),
        notice_period_days: 14,
        refund_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        german_law_reference: '§ 355 BGB (Widerrufsrecht)',
        notice_text_de: `
Hiermit bestätigen wir die Kündigung Ihres Abonnements zum ${endDate.toLocaleDateString('de-DE')}.

Gemäß § 355 BGB haben Sie das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Ihre Dienste bleiben bis zum Ende der bezahlten Periode aktiv.
        `.trim()
      }

      // Store cancellation notice
      await supabase
        .from('cancellation_notices')
        .insert(notice)

      return notice
    } catch (error) {
      console.error('Error generating cancellation notice:', error)
      throw new Error('Failed to generate cancellation notice')
    }
  }

  /**
   * Process data subject access request (GDPR Article 15)
   */
  async processAccessRequest(userId: string, email: string) {
    const userData = await this.exportUserData(userId)

    // Generate report
    const report = {
      request_date: new Date().toISOString(),
      user_id: userId,
      email: email,
      data_categories: Object.keys(userData),
      total_records: Object.values(userData).reduce((sum, arr) => {
        return sum + (Array.isArray(arr) ? arr.length : 1)
      }, 0),
      legal_basis: 'GDPR Article 15 - Right of Access',
      retention_periods: {
        profile_data: 'Until account deletion',
        payment_data: '10 years (German tax law)',
        learning_data: 'Until account deletion',
        analytics_data: '2 years or until consent withdrawal'
      },
      data_processors: [
        'Stripe (payment processing)',
        'Supabase (data storage)',
        'Vercel (hosting)',
        'OpenAI/Anthropic (AI features)'
      ]
    }

    return {
      report,
      userData
    }
  }
}

export const gdprHelper = new GDPRComplianceHelper()

/**
 * German VAT calculation utility
 */
export function calculateGermanVAT(amount: number, vatRate = 0.19): {
  netAmount: number
  vatAmount: number
  grossAmount: number
} {
  const netAmount = Math.round(amount / (1 + vatRate))
  const vatAmount = amount - netAmount
  
  return {
    netAmount,
    vatAmount,
    grossAmount: amount
  }
}

/**
 * Format German invoice number according to standards
 */
export function formatGermanInvoiceNumber(date: Date, sequence: number): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const seq = String(sequence).padStart(4, '0')
  
  return `${year}${month}-${seq}`
}

/**
 * Validate German tax ID (Umsatzsteuer-ID)
 */
export function validateGermanTaxId(taxId: string): boolean {
  // German VAT ID format: DE followed by 9 digits
  const germanVatRegex = /^DE[0-9]{9}$/
  return germanVatRegex.test(taxId.replace(/\s/g, ''))
}

/**
 * Check if address is in Germany for tax purposes
 */
export function isGermanAddress(address: any): boolean {
  return address?.country === 'DE' || address?.country === 'Germany'
}

/**
 * Generate GDPR-compliant privacy notice
 */
export function generatePrivacyNotice(dataTypes: string[]): string {
  return `
Datenschutzhinweis gemäß Art. 13 DSGVO

Wir verarbeiten folgende Kategorien personenbezogener Daten:
${dataTypes.map(type => `- ${type}`).join('\n')}

Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
Zweck: Bereitstellung unserer Lernplattform-Dienste
Speicherdauer: Bis zur Löschung des Nutzerkontos
Empfänger: Stripe (Zahlungsabwicklung), Supabase (Datenspeicherung)

Ihre Rechte:
- Auskunft (Art. 15 DSGVO)
- Berichtigung (Art. 16 DSGVO)  
- Löschung (Art. 17 DSGVO)
- Einschränkung (Art. 18 DSGVO)
- Datenübertragbarkeit (Art. 20 DSGVO)
- Widerspruch (Art. 21 DSGVO)

Kontakt: privacy@vibecodingbible.agentland.saarland
  `.trim()
}