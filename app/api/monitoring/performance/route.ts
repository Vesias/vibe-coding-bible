import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor, businessMonitor } from '@/lib/monitoring/performance'

/**
 * Enterprise Performance Monitoring API
 * GET /api/monitoring/performance
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const detailed = url.searchParams.get('detailed') === 'true'

    // Get performance summary
    const performanceSummary = performanceMonitor.getPerformanceSummary()
    
    // Get system metrics
    const memoryUsage = process.memoryUsage()
    const uptime = process.uptime()

    const basicMetrics = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime)
      },
      performance: performanceSummary,
      system: {
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          usagePercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
        },
        nodejs: process.version,
        platform: process.platform,
        arch: process.arch
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown'
      }
    }

    // If detailed metrics requested, include business intelligence
    if (detailed) {
      const businessReport = await businessMonitor.generateReport()
      
      return NextResponse.json({
        ...basicMetrics,
        business: businessReport.business,
        recommendations: businessReport.recommendations,
        webVitals: performanceMonitor.getCoreWebVitals(),
        detailed: true
      })
    }

    return NextResponse.json(basicMetrics)

  } catch (error) {
    console.error('Performance monitoring error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to retrieve performance metrics',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * Health check with performance metrics
 * HEAD /api/monitoring/performance
 */
export async function HEAD(request: NextRequest) {
  try {
    const summary = performanceMonitor.getPerformanceSummary()
    const memoryUsage = process.memoryUsage()
    const memoryPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    
    // Determine health status
    const isHealthy = summary.errorRate < 0.05 && 
                     summary.avgResponseTime < 1000 && 
                     memoryPercent < 90

    return new Response(null, { 
      status: isHealthy ? 200 : 503,
      headers: {
        'X-Health-Status': isHealthy ? 'healthy' : 'degraded',
        'X-Response-Time': summary.avgResponseTime.toString(),
        'X-Error-Rate': summary.errorRate.toString(),
        'X-Memory-Usage': memoryPercent.toFixed(1),
        'X-Uptime': process.uptime().toString()
      }
    })
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

/**
 * Export performance data for external monitoring
 * POST /api/monitoring/performance/export
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format = 'json', timeRange = '1h' } = body

    const exportData = performanceMonitor.exportMetrics()
    
    // Filter by time range
    const timeRangeMs = parseTimeRange(timeRange)
    const cutoff = Date.now() - timeRangeMs
    const filteredMetrics = exportData.metrics.filter(m => m.timestamp > cutoff)

    const exportResponse = {
      metadata: {
        exportTime: new Date().toISOString(),
        timeRange,
        totalMetrics: filteredMetrics.length,
        format
      },
      metrics: filteredMetrics,
      summary: exportData.summary,
      webVitals: exportData.webVitals
    }

    // Format response based on requested format
    if (format === 'csv') {
      const csv = convertToCSV(filteredMetrics)
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="performance-metrics-${Date.now()}.csv"`
        }
      })
    }

    return NextResponse.json(exportResponse)

  } catch (error) {
    console.error('Performance export error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to export performance data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper functions
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  parts.push(`${secs}s`)

  return parts.join(' ')
}

function parseTimeRange(timeRange: string): number {
  const units: { [key: string]: number } = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000
  }

  const match = timeRange.match(/^(\d+)([smhd])$/)
  if (!match) return 60 * 60 * 1000 // Default to 1 hour

  const [, amount, unit] = match
  return parseInt(amount) * units[unit]
}

function convertToCSV(metrics: any[]): string {
  if (metrics.length === 0) return ''

  const headers = Object.keys(metrics[0]).join(',')
  const rows = metrics.map(metric => 
    Object.values(metric).map(value => 
      typeof value === 'object' ? JSON.stringify(value) : value
    ).join(',')
  ).join('\n')

  return `${headers}\n${rows}`
}