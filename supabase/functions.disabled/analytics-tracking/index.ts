import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface AnalyticsEvent {
  event_type: string
  user_id?: string
  session_id?: string
  page_url?: string
  referrer?: string
  user_agent?: string
  properties?: Record<string, any>
  timestamp?: string
}

interface UserBehaviorEvent {
  user_id: string
  action: string
  resource_type?: string
  resource_id?: string
  duration_ms?: number
  metadata?: Record<string, any>
}

interface BusinessMetric {
  metric_type: string
  value: number
  dimensions?: Record<string, any>
  timestamp?: string
}

// Batch processor for analytics events
class AnalyticsBatchProcessor {
  private events: AnalyticsEvent[] = []
  private userBehaviorEvents: UserBehaviorEvent[] = []
  private businessMetrics: BusinessMetric[] = []
  private readonly batchSize = 100
  private readonly flushInterval = 5000 // 5 seconds
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
    this.startBatchProcessor()
  }

  addEvent(event: AnalyticsEvent) {
    this.events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    })

    if (this.events.length >= this.batchSize) {
      this.flushEvents()
    }
  }

  addUserBehaviorEvent(event: UserBehaviorEvent) {
    this.userBehaviorEvents.push(event)

    if (this.userBehaviorEvents.length >= this.batchSize) {
      this.flushUserBehaviorEvents()
    }
  }

  addBusinessMetric(metric: BusinessMetric) {
    this.businessMetrics.push({
      ...metric,
      timestamp: metric.timestamp || new Date().toISOString()
    })

    if (this.businessMetrics.length >= this.batchSize) {
      this.flushBusinessMetrics()
    }
  }

  private async flushEvents() {
    if (this.events.length === 0) return

    const eventsToFlush = this.events.splice(0, this.batchSize)
    
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert(eventsToFlush)

      if (error) {
        console.error('Failed to flush analytics events:', error)
        // Re-add events to the beginning of the queue for retry
        this.events.unshift(...eventsToFlush)
      }
    } catch (error) {
      console.error('Error flushing analytics events:', error)
      this.events.unshift(...eventsToFlush)
    }
  }

  private async flushUserBehaviorEvents() {
    if (this.userBehaviorEvents.length === 0) return

    const eventsToFlush = this.userBehaviorEvents.splice(0, this.batchSize)
    
    try {
      const { error } = await this.supabase
        .from('user_behavior_events')
        .insert(eventsToFlush.map(event => ({
          ...event,
          timestamp: new Date().toISOString()
        })))

      if (error) {
        console.error('Failed to flush user behavior events:', error)
        this.userBehaviorEvents.unshift(...eventsToFlush)
      }
    } catch (error) {
      console.error('Error flushing user behavior events:', error)
      this.userBehaviorEvents.unshift(...eventsToFlush)
    }
  }

  private async flushBusinessMetrics() {
    if (this.businessMetrics.length === 0) return

    const metricsToFlush = this.businessMetrics.splice(0, this.batchSize)
    
    try {
      const { error } = await this.supabase
        .from('business_metrics')
        .insert(metricsToFlush)

      if (error) {
        console.error('Failed to flush business metrics:', error)
        this.businessMetrics.unshift(...metricsToFlush)
      }
    } catch (error) {
      console.error('Error flushing business metrics:', error)
      this.businessMetrics.unshift(...metricsToFlush)
    }
  }

  private startBatchProcessor() {
    setInterval(() => {
      this.flushEvents()
      this.flushUserBehaviorEvents()
      this.flushBusinessMetrics()
    }, this.flushInterval)
  }

  // Force flush all pending events
  async forceFlush() {
    await Promise.all([
      this.flushEvents(),
      this.flushUserBehaviorEvents(),
      this.flushBusinessMetrics()
    ])
  }
}

// Real-time analytics aggregator
class RealTimeAggregator {
  private supabase: any
  private readonly aggregationInterval = 60000 // 1 minute

  constructor(supabase: any) {
    this.supabase = supabase
    this.startAggregation()
  }

  private startAggregation() {
    setInterval(async () => {
      await this.aggregateUserActivity()
      await this.aggregatePlatformMetrics()
    }, this.aggregationInterval)
  }

  private async aggregateUserActivity() {
    try {
      // Aggregate user activity for the last minute
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      
      await this.supabase.rpc('aggregate_user_activity', {
        p_start_time: oneMinuteAgo,
        p_end_time: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to aggregate user activity:', error)
    }
  }

  private async aggregatePlatformMetrics() {
    try {
      // Aggregate platform-wide metrics
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      
      await this.supabase.rpc('aggregate_platform_metrics', {
        p_start_time: oneMinuteAgo,
        p_end_time: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to aggregate platform metrics:', error)
    }
  }
}

let batchProcessor: AnalyticsBatchProcessor
let realTimeAggregator: RealTimeAggregator

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

    // Initialize batch processor and aggregator if not already done
    if (!batchProcessor) {
      batchProcessor = new AnalyticsBatchProcessor(supabase)
    }
    if (!realTimeAggregator) {
      realTimeAggregator = new RealTimeAggregator(supabase)
    }

    const { method, url } = req
    const urlPath = new URL(url).pathname

    if (method === 'POST') {
      const body = await req.json()
      
      switch (urlPath) {
        case '/analytics-tracking/event':
          await handleAnalyticsEvent(body, batchProcessor)
          break
        
        case '/analytics-tracking/user-behavior':
          await handleUserBehaviorEvent(body, batchProcessor)
          break
        
        case '/analytics-tracking/business-metric':
          await handleBusinessMetric(body, batchProcessor)
          break
        
        case '/analytics-tracking/page-view':
          await handlePageView(body, batchProcessor, req)
          break
        
        case '/analytics-tracking/workshop-completion':
          await handleWorkshopCompletion(body, batchProcessor, supabase)
          break
        
        case '/analytics-tracking/subscription-event':
          await handleSubscriptionEvent(body, batchProcessor, supabase)
          break
        
        default:
          throw new Error(`Unknown endpoint: ${urlPath}`)
      }
    } else if (method === 'GET') {
      switch (urlPath) {
        case '/analytics-tracking/dashboard':
          return await handleDashboardRequest(supabase, req)
        
        case '/analytics-tracking/user-insights':
          return await handleUserInsightsRequest(supabase, req)
        
        case '/analytics-tracking/business-metrics':
          return await handleBusinessMetricsRequest(supabase, req)
        
        default:
          throw new Error(`Unknown GET endpoint: ${urlPath}`)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Analytics tracking error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Analytics tracking failed',
        message: (error as Error).message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleAnalyticsEvent(body: any, processor: AnalyticsBatchProcessor) {
  const event: AnalyticsEvent = {
    event_type: body.event_type,
    user_id: body.user_id,
    session_id: body.session_id,
    page_url: body.page_url,
    referrer: body.referrer,
    user_agent: body.user_agent,
    properties: body.properties || {}
  }

  processor.addEvent(event)
}

async function handleUserBehaviorEvent(body: any, processor: AnalyticsBatchProcessor) {
  const event: UserBehaviorEvent = {
    user_id: body.user_id,
    action: body.action,
    resource_type: body.resource_type,
    resource_id: body.resource_id,
    duration_ms: body.duration_ms,
    metadata: body.metadata || {}
  }

  processor.addUserBehaviorEvent(event)
}

async function handleBusinessMetric(body: any, processor: AnalyticsBatchProcessor) {
  const metric: BusinessMetric = {
    metric_type: body.metric_type,
    value: body.value,
    dimensions: body.dimensions || {}
  }

  processor.addBusinessMetric(metric)
}

async function handlePageView(body: any, processor: AnalyticsBatchProcessor, req: Request) {
  const userAgent = req.headers.get('user-agent') || ''
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  const event: AnalyticsEvent = {
    event_type: 'page_view',
    user_id: body.user_id,
    session_id: body.session_id,
    page_url: body.page_url,
    referrer: body.referrer,
    user_agent: userAgent,
    properties: {
      ip_address: ip,
      viewport_width: body.viewport_width,
      viewport_height: body.viewport_height,
      device_type: detectDeviceType(userAgent),
      browser: detectBrowser(userAgent),
      ...body.properties
    }
  }

  processor.addEvent(event)

  // Also track as user behavior
  if (body.user_id) {
    const behaviorEvent: UserBehaviorEvent = {
      user_id: body.user_id,
      action: 'page_view',
      resource_type: 'page',
      resource_id: body.page_url,
      metadata: {
        referrer: body.referrer,
        session_id: body.session_id
      }
    }

    processor.addUserBehaviorEvent(behaviorEvent)
  }
}

async function handleWorkshopCompletion(body: any, processor: AnalyticsBatchProcessor, supabase: any) {
  const { user_id, workshop_id, completion_time_ms, score, challenges_completed } = body

  // Track completion event
  const event: AnalyticsEvent = {
    event_type: 'workshop_completed',
    user_id,
    properties: {
      workshop_id,
      completion_time_ms,
      score,
      challenges_completed
    }
  }

  processor.addEvent(event)

  // Track user behavior
  const behaviorEvent: UserBehaviorEvent = {
    user_id,
    action: 'workshop_completed',
    resource_type: 'workshop',
    resource_id: workshop_id,
    duration_ms: completion_time_ms,
    metadata: {
      score,
      challenges_completed
    }
  }

  processor.addUserBehaviorEvent(behaviorEvent)

  // Update business metrics
  const businessMetric: BusinessMetric = {
    metric_type: 'workshop_completion',
    value: 1,
    dimensions: {
      workshop_id,
      completion_time_category: categorizeCompletionTime(completion_time_ms),
      score_category: categorizeScore(score)
    }
  }

  processor.addBusinessMetric(businessMetric)

  // Update user analytics in real-time
  await supabase.rpc('update_user_workshop_completion', {
    p_user_id: user_id,
    p_workshop_id: workshop_id,
    p_completion_time_ms: completion_time_ms,
    p_score: score
  })
}

async function handleSubscriptionEvent(body: any, processor: AnalyticsBatchProcessor, supabase: any) {
  const { user_id, event_type, subscription_tier, amount, currency } = body

  // Track subscription event
  const event: AnalyticsEvent = {
    event_type: `subscription_${event_type}`,
    user_id,
    properties: {
      subscription_tier,
      amount,
      currency
    }
  }

  processor.addEvent(event)

  // Track as business metric
  const businessMetric: BusinessMetric = {
    metric_type: `subscription_${event_type}`,
    value: event_type === 'purchased' ? amount : 1,
    dimensions: {
      subscription_tier,
      currency
    }
  }

  processor.addBusinessMetric(businessMetric)

  // Update revenue metrics
  if (event_type === 'purchased' && amount > 0) {
    await supabase.rpc('update_revenue_metrics', {
      p_user_id: user_id,
      p_amount: amount,
      p_currency: currency,
      p_subscription_tier: subscription_tier
    })
  }
}

async function handleDashboardRequest(supabase: any, req: Request) {
  const url = new URL(req.url)
  const timeRange = url.searchParams.get('timeRange') || '7d'
  const userId = url.searchParams.get('userId')

  const { data: dashboardData, error } = await supabase.rpc('get_analytics_dashboard', {
    p_time_range: timeRange,
    p_user_id: userId
  })

  if (error) {
    throw new Error(`Failed to get dashboard data: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ data: dashboardData }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleUserInsightsRequest(supabase: any, req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    throw new Error('User ID is required')
  }

  const { data: insights, error } = await supabase.rpc('get_user_insights', {
    p_user_id: userId
  })

  if (error) {
    throw new Error(`Failed to get user insights: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ data: insights }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleBusinessMetricsRequest(supabase: any, req: Request) {
  const url = new URL(req.url)
  const timeRange = url.searchParams.get('timeRange') || '30d'
  const metricType = url.searchParams.get('metricType')

  const { data: metrics, error } = await supabase.rpc('get_business_metrics', {
    p_time_range: timeRange,
    p_metric_type: metricType
  })

  if (error) {
    throw new Error(`Failed to get business metrics: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ data: metrics }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Utility functions
function detectDeviceType(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile'
  }
  if (/Tablet|iPad/i.test(userAgent)) {
    return 'tablet'
  }
  return 'desktop'
}

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'chrome'
  if (userAgent.includes('Firefox')) return 'firefox'
  if (userAgent.includes('Safari')) return 'safari'
  if (userAgent.includes('Edge')) return 'edge'
  return 'other'
}

function categorizeCompletionTime(timeMs: number): string {
  const minutes = timeMs / 60000
  if (minutes < 10) return 'fast'
  if (minutes < 30) return 'medium'
  if (minutes < 60) return 'slow'
  return 'very_slow'
}

function categorizeScore(score: number): string {
  if (score >= 90) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'average'
  return 'poor'
}

// Graceful shutdown
globalThis.addEventListener('unload', async () => {
  if (batchProcessor) {
    await batchProcessor.forceFlush()
  }
})