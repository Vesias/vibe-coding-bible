/**
 * Enterprise Performance Monitoring for VibeCodingBibel™
 * Comprehensive monitoring solution for production scaling
 */

import { NextRequest } from 'next/server'

export interface PerformanceMetrics {
  timestamp: number
  route: string
  method: string
  statusCode: number
  responseTime: number
  memoryUsage: NodeJS.MemoryUsage
  cpuUsage?: number
  activeUsers?: number
  errorRate?: number
  throughput?: number
}

export interface AlertConfig {
  responseTime: number // Alert if > 500ms
  errorRate: number // Alert if > 5%
  memoryUsage: number // Alert if > 80%
  cpuUsage: number // Alert if > 70%
  activeUsers: number // Alert if > 8000 concurrent
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private alertConfig: AlertConfig = {
    responseTime: 500,
    errorRate: 0.05,
    memoryUsage: 0.8,
    cpuUsage: 0.7,
    activeUsers: 8000
  }

  /**
   * Track API performance metrics
   */
  trackApiPerformance(
    request: NextRequest,
    responseTime: number,
    statusCode: number
  ): void {
    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      route: request.nextUrl.pathname,
      method: request.method,
      statusCode,
      responseTime,
      memoryUsage: process.memoryUsage(),
    }

    this.metrics.push(metric)
    this.checkAlerts(metric)
    
    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  /**
   * Get performance summary for the last hour
   */
  getPerformanceSummary(): {
    avgResponseTime: number
    errorRate: number
    throughput: number
    memoryUsage: number
    totalRequests: number
  } {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    const recentMetrics = this.metrics.filter(m => m.timestamp > oneHourAgo)
    
    if (recentMetrics.length === 0) {
      return {
        avgResponseTime: 0,
        errorRate: 0,
        throughput: 0,
        memoryUsage: 0,
        totalRequests: 0
      }
    }

    const totalRequests = recentMetrics.length
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests
    const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length
    const errorRate = errorCount / totalRequests
    const throughput = totalRequests / 60 // requests per minute
    const memoryUsage = recentMetrics[recentMetrics.length - 1]?.memoryUsage.heapUsed || 0

    return {
      avgResponseTime,
      errorRate,
      throughput,
      memoryUsage,
      totalRequests
    }
  }

  /**
   * Check for alert conditions
   */
  private checkAlerts(metric: PerformanceMetrics): void {
    const alerts: string[] = []

    // Response time alert
    if (metric.responseTime > this.alertConfig.responseTime) {
      alerts.push(`High response time: ${metric.responseTime}ms on ${metric.route}`)
    }

    // Memory usage alert
    const memoryUsagePercent = metric.memoryUsage.heapUsed / metric.memoryUsage.heapTotal
    if (memoryUsagePercent > this.alertConfig.memoryUsage) {
      alerts.push(`High memory usage: ${(memoryUsagePercent * 100).toFixed(1)}%`)
    }

    // Error rate alert
    const recentErrors = this.metrics
      .filter(m => m.timestamp > Date.now() - 5 * 60 * 1000) // Last 5 minutes
      .filter(m => m.statusCode >= 400)
    
    if (recentErrors.length > 5) {
      alerts.push(`High error rate: ${recentErrors.length} errors in last 5 minutes`)
    }

    if (alerts.length > 0) {
      this.sendAlerts(alerts)
    }
  }

  /**
   * Send alerts to monitoring services
   */
  private async sendAlerts(alerts: string[]): Promise<void> {
    // In production, integrate with:
    // - Vercel Analytics
    // - Sentry
    // - DataDog
    // - Slack/Discord webhooks
    
    console.warn('🚨 PERFORMANCE ALERTS:', alerts)
    
    // Example: Send to Discord webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **VibeCodingBibel Performance Alert**\n\n${alerts.map(a => `• ${a}`).join('\n')}`
          })
        })
      } catch (error) {
        console.error('Failed to send Discord alert:', error)
      }
    }
  }

  /**
   * Get Core Web Vitals tracking
   */
  getCoreWebVitals(): {
    LCP: number // Largest Contentful Paint
    FID: number // First Input Delay
    CLS: number // Cumulative Layout Shift
    FCP: number // First Contentful Paint
    TTFB: number // Time to First Byte
  } {
    // These would be collected from the client-side
    // For now, return placeholder values
    return {
      LCP: 0,
      FID: 0,
      CLS: 0,
      FCP: 0,
      TTFB: 0
    }
  }

  /**
   * Export metrics for external monitoring
   */
  exportMetrics(): {
    metrics: PerformanceMetrics[]
    summary: any
    webVitals: any
  } {
    return {
      metrics: this.metrics,
      summary: this.getPerformanceSummary(),
      webVitals: this.getCoreWebVitals()
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Middleware wrapper for performance tracking
 */
export function withPerformanceTracking<T>(
  handler: (request: NextRequest) => Promise<T>,
  route: string
) {
  return async (request: NextRequest): Promise<T> => {
    const startTime = Date.now()
    
    try {
      const result = await handler(request)
      const responseTime = Date.now() - startTime
      
      performanceMonitor.trackApiPerformance(request, responseTime, 200)
      
      return result
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      performanceMonitor.trackApiPerformance(request, responseTime, 500)
      
      throw error
    }
  }
}

/**
 * Business Intelligence Metrics
 */
export interface BusinessMetrics {
  activeUsers: number
  subscriptionConversions: number
  workshopCompletions: number
  averageSessionDuration: number
  userRetention: number
  revenueGrowth: number
}

class BusinessMonitor {
  /**
   * Track business KPIs
   */
  async getBusinessMetrics(): Promise<BusinessMetrics> {
    // In production, integrate with:
    // - Supabase Analytics
    // - Stripe Analytics
    // - User behavior tracking
    
    return {
      activeUsers: 0,
      subscriptionConversions: 0,
      workshopCompletions: 0,
      averageSessionDuration: 0,
      userRetention: 0,
      revenueGrowth: 0
    }
  }

  /**
   * Generate business intelligence report
   */
  async generateReport(): Promise<{
    performance: ReturnType<typeof performanceMonitor.getPerformanceSummary>
    business: BusinessMetrics
    recommendations: string[]
  }> {
    const performance = performanceMonitor.getPerformanceSummary()
    const business = await this.getBusinessMetrics()
    
    const recommendations: string[] = []
    
    // Generate recommendations based on metrics
    if (performance.errorRate > 0.05) {
      recommendations.push('High error rate detected - investigate recent deployments')
    }
    
    if (performance.avgResponseTime > 500) {
      recommendations.push('Slow response times - consider CDN optimization')
    }
    
    if (business.userRetention < 0.3) {
      recommendations.push('Low user retention - improve onboarding experience')
    }

    return {
      performance,
      business,
      recommendations
    }
  }
}

export const businessMonitor = new BusinessMonitor()