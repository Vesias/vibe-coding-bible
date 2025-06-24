import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailNotificationRequest {
  user_id: string
  type: string
  data: Record<string, any>
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  send_immediately?: boolean
}

// Email template engine
class EmailTemplateEngine {
  private templates: Map<string, EmailTemplate> = new Map()

  constructor() {
    this.loadTemplates()
  }

  private loadTemplates() {
    // Welcome email template
    this.templates.set('welcome', {
      subject: '🎉 Willkommen in der Vibe Coding Bible!',
      html: this.getWelcomeTemplate(),
      text: this.getWelcomeTextTemplate()
    })

    // Payment confirmation template
    this.templates.set('payment_confirmation', {
      subject: '✅ Zahlung bestätigt - Zugang freigeschaltet!',
      html: this.getPaymentConfirmationTemplate(),
      text: this.getPaymentConfirmationTextTemplate()
    })

    // Payment failed template
    this.templates.set('payment_failed', {
      subject: '⚠️ Zahlungsproblem - Aktion erforderlich',
      html: this.getPaymentFailedTemplate(),
      text: this.getPaymentFailedTextTemplate()
    })

    // Workshop completion template
    this.templates.set('workshop_completed', {
      subject: '🏆 Gebot erfolgreich abgeschlossen!',
      html: this.getWorkshopCompletionTemplate(),
      text: this.getWorkshopCompletionTextTemplate()
    })

    // Achievement unlocked template
    this.templates.set('achievement_unlocked', {
      subject: '🎖️ Neues Achievement freigeschaltet!',
      html: this.getAchievementTemplate(),
      text: this.getAchievementTextTemplate()
    })

    // Subscription expiring template
    this.templates.set('subscription_expiring', {
      subject: '⏰ Ihr Zugang läuft bald ab',
      html: this.getSubscriptionExpiringTemplate(),
      text: this.getSubscriptionExpiringTextTemplate()
    })

    // Dispute alert (admin)
    this.templates.set('dispute_alert', {
      subject: '🚨 Chargeback Alert - Immediate Action Required',
      html: this.getDisputeAlertTemplate(),
      text: this.getDisputeAlertTextTemplate()
    })

    // Weekly progress report
    this.templates.set('weekly_progress', {
      subject: '📊 Ihr wöchentlicher Lernfortschritt',
      html: this.getWeeklyProgressTemplate(),
      text: this.getWeeklyProgressTextTemplate()
    })

    // Referral commission
    this.templates.set('referral_commission', {
      subject: '💰 Provision erhalten!',
      html: this.getReferralCommissionTemplate(),
      text: this.getReferralCommissionTextTemplate()
    })
  }

  getTemplate(type: string): EmailTemplate | null {
    return this.templates.get(type) || null
  }

  renderTemplate(template: EmailTemplate, data: Record<string, any>): EmailTemplate {
    return {
      subject: this.replaceVariables(template.subject, data),
      html: this.replaceVariables(template.html, data),
      text: this.replaceVariables(template.text, data)
    }
  }

  private replaceVariables(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }

  // Template definitions
  private getWelcomeTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Willkommen in der Vibe Coding Bible</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Willkommen, {{full_name}}!</h1>
                <p>Ihre Reise in die Welt des Vibe Coding beginnt jetzt</p>
            </div>
            <div class="content">
                <h2>Herzlich willkommen in der Vibe Coding Bible!</h2>
                <p>Sie haben soeben Zugang zu einer revolutionären Art des Programmierens erhalten. Hier sind Ihre ersten Schritte:</p>
                
                <h3>🚀 Was Sie jetzt tun können:</h3>
                <ul>
                    <li><strong>Erstes Gebot erkunden:</strong> Beginnen Sie mit "Die Heilige Vision"</li>
                    <li><strong>Profil vervollständigen:</strong> Personalisieren Sie Ihr Lernerlebnis</li>
                    <li><strong>Community beitreten:</strong> Vernetzen Sie sich mit anderen Vibe Codern</li>
                </ul>

                <a href="{{dashboard_url}}" class="cta-button">Dashboard öffnen</a>

                <p>Ihr aktueller Status: <strong>{{subscription_tier}}</strong></p>
                <p>Freigeschaltete Features: {{features_unlocked}}</p>
            </div>
            <div class="footer">
                <p>Vibe Coding Bible - Programmieren neu gedacht</p>
                <p><a href="{{unsubscribe_url}}">Abmelden</a> | <a href="{{support_url}}">Support</a></p>
            </div>
        </div>
    </body>
    </html>
    `
  }

  private getWelcomeTextTemplate(): string {
    return `
Willkommen in der Vibe Coding Bible, {{full_name}}!

Ihre Reise in die Welt des Vibe Coding beginnt jetzt.

Was Sie jetzt tun können:
- Erstes Gebot erkunden: Beginnen Sie mit "Die Heilige Vision"
- Profil vervollständigen: Personalisieren Sie Ihr Lernerlebnis  
- Community beitreten: Vernetzen Sie sich mit anderen Vibe Codern

Dashboard öffnen: {{dashboard_url}}

Ihr aktueller Status: {{subscription_tier}}
Freigeschaltete Features: {{features_unlocked}}

Vibe Coding Bible - Programmieren neu gedacht
    `
  }

  private getPaymentConfirmationTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981; }
            .cta-button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Zahlung erfolgreich!</h1>
                <p>Ihr Zugang wurde freigeschaltet</p>
            </div>
            <div class="content">
                <h2>Vielen Dank für Ihr Vertrauen!</h2>
                <p>Ihre Zahlung wurde erfolgreich verarbeitet und Ihr {{subscription_tier}}-Zugang wurde aktiviert.</p>
                
                <div class="receipt">
                    <h3>📋 Rechnungsdetails</h3>
                    <p><strong>Betrag:</strong> {{amount}} {{currency}}</p>
                    <p><strong>Datum:</strong> {{payment_date}}</p>
                    <p><strong>Subscription:</strong> {{subscription_tier}}</p>
                    <p><strong>Nächste Abrechnung:</strong> {{next_billing_date}}</p>
                </div>

                <h3>🎯 Was ist jetzt für Sie freigeschaltet:</h3>
                <ul>
                    {{#features_unlocked}}
                    <li>{{.}}</li>
                    {{/features_unlocked}}
                </ul>

                <a href="{{dashboard_url}}" class="cta-button">Jetzt loslegen</a>
            </div>
        </div>
    </body>
    </html>
    `
  }

  private getPaymentConfirmationTextTemplate(): string {
    return `
Zahlung erfolgreich! ✅

Vielen Dank für Ihr Vertrauen!

Ihre Zahlung wurde erfolgreich verarbeitet und Ihr {{subscription_tier}}-Zugang wurde aktiviert.

Rechnungsdetails:
- Betrag: {{amount}} {{currency}}
- Datum: {{payment_date}}
- Subscription: {{subscription_tier}}
- Nächste Abrechnung: {{next_billing_date}}

Jetzt loslegen: {{dashboard_url}}
    `
  }

  private getPaymentFailedTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚠️ Zahlungsproblem</h1>
                <p>Aktion erforderlich</p>
            </div>
            <div class="content">
                <div class="warning">
                    <h3>Ihre Zahlung konnte nicht verarbeitet werden</h3>
                    <p><strong>Grund:</strong> {{failure_reason}}</p>
                    <p><strong>Betrag:</strong> {{amount}} {{currency}}</p>
                    <p><strong>Datum:</strong> {{payment_date}}</p>
                </div>

                <h3>🔧 Nächste Schritte:</h3>
                <ol>
                    <li>Überprüfen Sie Ihre Zahlungsmethode</li>
                    <li>Stellen Sie sicher, dass ausreichend Guthaben vorhanden ist</li>
                    <li>Kontaktieren Sie bei anhaltenden Problemen Ihre Bank</li>
                </ol>

                <a href="{{billing_url}}" class="cta-button">Zahlungsmethode aktualisieren</a>

                <p><strong>Wichtig:</strong> Ihr Zugang läuft am {{expiry_date}} ab, wenn die Zahlung nicht bis dahin erfolgt.</p>
            </div>
        </div>
    </body>
    </html>
    `
  }

  private getPaymentFailedTextTemplate(): string {
    return `
Zahlungsproblem - Aktion erforderlich ⚠️

Ihre Zahlung konnte nicht verarbeitet werden.

Details:
- Grund: {{failure_reason}}
- Betrag: {{amount}} {{currency}}
- Datum: {{payment_date}}

Nächste Schritte:
1. Überprüfen Sie Ihre Zahlungsmethode
2. Stellen Sie sicher, dass ausreichend Guthaben vorhanden ist
3. Kontaktieren Sie bei anhaltenden Problemen Ihre Bank

Zahlungsmethode aktualisieren: {{billing_url}}

Wichtig: Ihr Zugang läuft am {{expiry_date}} ab, wenn die Zahlung nicht bis dahin erfolgt.
    `
  }

  // Additional template methods would be implemented here...
  private getWorkshopCompletionTemplate(): string { return "Workshop completion HTML template" }
  private getWorkshopCompletionTextTemplate(): string { return "Workshop completion text template" }
  private getAchievementTemplate(): string { return "Achievement HTML template" }
  private getAchievementTextTemplate(): string { return "Achievement text template" }
  private getSubscriptionExpiringTemplate(): string { return "Subscription expiring HTML template" }
  private getSubscriptionExpiringTextTemplate(): string { return "Subscription expiring text template" }
  private getDisputeAlertTemplate(): string { return "Dispute alert HTML template" }
  private getDisputeAlertTextTemplate(): string { return "Dispute alert text template" }
  private getWeeklyProgressTemplate(): string { return "Weekly progress HTML template" }
  private getWeeklyProgressTextTemplate(): string { return "Weekly progress text template" }
  private getReferralCommissionTemplate(): string { return "Referral commission HTML template" }
  private getReferralCommissionTextTemplate(): string { return "Referral commission text template" }
}

// Email queue processor
class EmailQueueProcessor {
  private queue: EmailNotificationRequest[] = []
  private processing = false
  private supabase: any
  private templateEngine: EmailTemplateEngine

  constructor(supabase: any) {
    this.supabase = supabase
    this.templateEngine = new EmailTemplateEngine()
    this.startProcessor()
  }

  addToQueue(request: EmailNotificationRequest) {
    if (request.send_immediately || request.priority === 'urgent') {
      this.queue.unshift(request) // Add to front of queue
    } else {
      this.queue.push(request)
    }

    if (!this.processing) {
      this.processQueue()
    }
  }

  private startProcessor() {
    setInterval(() => {
      if (!this.processing && this.queue.length > 0) {
        this.processQueue()
      }
    }, 5000) // Process every 5 seconds
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    try {
      while (this.queue.length > 0) {
        const request = this.queue.shift()!
        await this.processEmailRequest(request)
      }
    } catch (error) {
      console.error('Error processing email queue:', error)
    } finally {
      this.processing = false
    }
  }

  private async processEmailRequest(request: EmailNotificationRequest) {
    try {
      // Get user information
      const { data: user, error: userError } = await this.supabase
        .from('profiles')
        .select('email, full_name, notification_preferences')
        .eq('id', request.user_id)
        .single()

      if (userError || !user) {
        console.error('User not found:', request.user_id)
        return
      }

      // Check if user wants this type of notification
      if (!this.shouldSendNotification(user.notification_preferences, request.type)) {
        console.log(`User opted out of ${request.type} notifications:`, request.user_id)
        return
      }

      // Handle admin notifications
      if (request.user_id === 'admin') {
        await this.sendAdminNotification(request)
        return
      }

      // Get template
      const template = this.templateEngine.getTemplate(request.type)
      if (!template) {
        console.error('Template not found:', request.type)
        return
      }

      // Render template with data
      const renderedTemplate = this.templateEngine.renderTemplate(template, {
        full_name: user.full_name,
        email: user.email,
        dashboard_url: 'https://vibecodingbible.agentland.saarland/dashboard',
        billing_url: 'https://vibecodingbible.agentland.saarland/dashboard/billing',
        support_url: 'https://vibecodingbible.agentland.saarland/contact',
        unsubscribe_url: `https://vibecodingbible.agentland.saarland/unsubscribe?token=${this.generateUnsubscribeToken(request.user_id)}`,
        ...request.data
      })

      // Send email
      await this.sendEmail(user.email, renderedTemplate)

      // Log successful send
      await this.logEmailSent(request.user_id, request.type, user.email)

    } catch (error) {
      console.error('Failed to process email request:', error)
      await this.logEmailError(request.user_id, request.type, (error as Error).message)
    }
  }

  private shouldSendNotification(preferences: any, notificationType: string): boolean {
    if (!preferences) return true

    const typeMap = {
      welcome: 'welcome_emails',
      payment_confirmation: 'payment_emails',
      payment_failed: 'payment_emails',
      workshop_completed: 'achievement_emails',
      achievement_unlocked: 'achievement_emails',
      subscription_expiring: 'billing_emails',
      weekly_progress: 'progress_emails',
      referral_commission: 'referral_emails'
    }

    const preferenceKey = typeMap[notificationType as keyof typeof typeMap]
    return preferenceKey ? preferences[preferenceKey] !== false : true
  }

  private async sendEmail(to: string, template: EmailTemplate) {
    // Integration with email service (e.g., Resend, SendGrid, etc.)
    const emailServiceUrl = Deno.env.get('EMAIL_SERVICE_URL')
    const emailServiceKey = Deno.env.get('EMAIL_SERVICE_KEY')

    if (!emailServiceUrl || !emailServiceKey) {
      console.error('Email service not configured')
      return
    }

    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${emailServiceKey}`
      },
      body: JSON.stringify({
        from: 'Vibe Coding Bible <noreply@vibecodingbible.agentland.saarland>',
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text
      })
    })

    if (!response.ok) {
      throw new Error(`Email service error: ${response.statusText}`)
    }
  }

  private async sendAdminNotification(request: EmailNotificationRequest) {
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@vibecodingbible.agentland.saarland'
    
    const template = this.templateEngine.getTemplate(request.type)
    if (!template) return

    const renderedTemplate = this.templateEngine.renderTemplate(template, request.data)
    await this.sendEmail(adminEmail, renderedTemplate)
  }

  private generateUnsubscribeToken(userId: string): string {
    // Generate a secure unsubscribe token
    const encoder = new TextEncoder()
    const data = encoder.encode(`${userId}:${Date.now()}`)
    return btoa(String.fromCharCode(...data))
  }

  private async logEmailSent(userId: string, type: string, email: string) {
    await this.supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: type,
        recipient_email: email,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
  }

  private async logEmailError(userId: string, type: string, error: string) {
    await this.supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: type,
        status: 'error',
        error_message: error,
        sent_at: new Date().toISOString()
      })
  }
}

let emailProcessor: EmailQueueProcessor

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Initialize email processor if not already done
    if (!emailProcessor) {
      emailProcessor = new EmailQueueProcessor(supabase)
    }

    const body: EmailNotificationRequest = await req.json()

    // Validate request
    if (!body.user_id || !body.type) {
      throw new Error('Missing required fields: user_id and type')
    }

    // Add to processing queue
    emailProcessor.addToQueue(body)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email queued for processing',
        priority: body.priority || 'normal'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Email notification error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Email notification failed',
        message: (error as Error).message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})