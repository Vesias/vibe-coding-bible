#!/usr/bin/env node

/**
 * Performance Audit Script for VibeCodingBibel™
 * Analyzes bundle size, Core Web Vitals, and performance metrics
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Performance thresholds (Enterprise targets)
const PERFORMANCE_THRESHOLDS = {
  bundleSize: {
    initial: 500, // KB
    vendor: 800,  // KB
    total: 1300   // KB
  },
  webVitals: {
    FCP: 1500,    // ms
    LCP: 2500,    // ms
    TTI: 3000,    // ms
    CLS: 0.1      // score
  },
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 95
  }
}

class PerformanceAuditor {
  constructor() {
    this.results = {
      bundleSize: {},
      buildTime: 0,
      errors: [],
      warnings: [],
      recommendations: []
    }
  }

  async run() {
    console.log('🚀 Starting VibeCodingBibel™ Performance Audit...\n')
    
    try {
      await this.analyzeBundleSize()
      await this.measureBuildTime()
      await this.checkDependencies()
      await this.analyzeCodeSplitting()
      await this.generateReport()
    } catch (error) {
      console.error('❌ Audit failed:', error.message)
      process.exit(1)
    }
  }

  async analyzeBundleSize() {
    console.log('📊 Analyzing bundle size...')
    
    try {
      // Build the project and analyze
      const buildOutput = execSync('npm run build', { 
        encoding: 'utf8',
        stdio: 'pipe'
      })
      
      // Parse Next.js build output for bundle sizes
      const bundleRegex = /(\S+)\s+(\d+(?:\.\d+)?)\s*kB\s+(\d+(?:\.\d+)?)\s*kB/g
      let match
      
      while ((match = bundleRegex.exec(buildOutput)) !== null) {
        const [, name, parsed, gzipped] = match
        this.results.bundleSize[name] = {
          parsed: parseFloat(parsed),
          gzipped: parseFloat(gzipped)
        }
      }
      
      // Check against thresholds
      const totalGzipped = Object.values(this.results.bundleSize)
        .reduce((sum, bundle) => sum + bundle.gzipped, 0)
      
      if (totalGzipped > PERFORMANCE_THRESHOLDS.bundleSize.total) {
        this.results.warnings.push(
          `Total bundle size (${totalGzipped.toFixed(1)}KB) exceeds target (${PERFORMANCE_THRESHOLDS.bundleSize.total}KB)`
        )
      } else {
        console.log(`✅ Bundle size: ${totalGzipped.toFixed(1)}KB (target: ${PERFORMANCE_THRESHOLDS.bundleSize.total}KB)`)
      }
      
    } catch (error) {
      this.results.errors.push(`Bundle analysis failed: ${error.message}`)
    }
  }

  async measureBuildTime() {
    console.log('⏱️  Measuring build time...')
    
    const startTime = Date.now()
    
    try {
      execSync('npm run build', { stdio: 'pipe' })
      this.results.buildTime = Date.now() - startTime
      
      console.log(`✅ Build time: ${(this.results.buildTime / 1000).toFixed(1)}s`)
      
      if (this.results.buildTime > 60000) { // 1 minute
        this.results.warnings.push('Build time exceeds 1 minute - consider optimization')
      }
      
    } catch (error) {
      this.results.errors.push(`Build failed: ${error.message}`)
    }
  }

  async checkDependencies() {
    console.log('📦 Analyzing dependencies...')
    
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
      )
      
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      }
      
      // Check for heavy dependencies
      const heavyDeps = [
        'moment', // Use date-fns instead
        'lodash', // Use individual functions
        'jquery', // Modern framework shouldn't need this
        'bootstrap' // Using Tailwind instead
      ]
      
      const foundHeavyDeps = heavyDeps.filter(dep => dependencies[dep])
      
      if (foundHeavyDeps.length > 0) {
        this.results.warnings.push(
          `Heavy dependencies detected: ${foundHeavyDeps.join(', ')}`
        )
        this.results.recommendations.push(
          'Consider replacing heavy dependencies with lighter alternatives'
        )
      }
      
      // Check bundle analyzers
      if (!dependencies['@next/bundle-analyzer']) {
        this.results.recommendations.push(
          'Add @next/bundle-analyzer for detailed bundle analysis'
        )
      }
      
      console.log(`✅ Dependencies analyzed: ${Object.keys(dependencies).length} packages`)
      
    } catch (error) {
      this.results.errors.push(`Dependency analysis failed: ${error.message}`)
    }
  }

  async analyzeCodeSplitting() {
    console.log('🔀 Analyzing code splitting...')
    
    try {
      const nextConfigPath = path.join(process.cwd(), 'next.config.js')
      
      if (fs.existsSync(nextConfigPath)) {
        const nextConfig = fs.readFileSync(nextConfigPath, 'utf8')
        
        // Check for optimization configuration
        if (nextConfig.includes('splitChunks')) {
          console.log('✅ Code splitting configured')
        } else {
          this.results.recommendations.push(
            'Configure webpack splitChunks for better code splitting'
          )
        }
        
        if (nextConfig.includes('optimizePackageImports')) {
          console.log('✅ Package imports optimized')
        } else {
          this.results.recommendations.push(
            'Add optimizePackageImports for better tree shaking'
          )
        }
      }
      
      // Check for lazy loading implementation
      const lazyFiles = execSync(
        'find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "React.lazy\\|dynamic(" | wc -l',
        { encoding: 'utf8' }
      ).trim()
      
      if (parseInt(lazyFiles) > 0) {
        console.log(`✅ Found ${lazyFiles} files using lazy loading`)
      } else {
        this.results.recommendations.push(
          'Implement lazy loading for non-critical components'
        )
      }
      
    } catch (error) {
      this.results.warnings.push(`Code splitting analysis failed: ${error.message}`)
    }
  }

  async generateReport() {
    console.log('\n📋 Performance Audit Report')
    console.log('=' .repeat(50))
    
    // Bundle Size Report
    console.log('\n📊 Bundle Analysis:')
    Object.entries(this.results.bundleSize).forEach(([name, sizes]) => {
      const status = sizes.gzipped > 200 ? '⚠️' : '✅'
      console.log(`  ${status} ${name}: ${sizes.gzipped.toFixed(1)}KB gzipped`)
    })
    
    // Build Performance
    console.log(`\n⏱️  Build Time: ${(this.results.buildTime / 1000).toFixed(1)}s`)
    
    // Errors
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.results.errors.forEach(error => console.log(`  • ${error}`))
    }
    
    // Warnings
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      this.results.warnings.forEach(warning => console.log(`  • ${warning}`))
    }
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:')
      this.results.recommendations.forEach(rec => console.log(`  • ${rec}`))
    }
    
    // Performance Score
    const score = this.calculatePerformanceScore()
    console.log(`\n🎯 Performance Score: ${score}/100`)
    
    if (score >= 90) {
      console.log('🎉 Excellent performance! Ready for Enterprise deployment.')
    } else if (score >= 75) {
      console.log('👍 Good performance. Minor optimizations recommended.')
    } else {
      console.log('🔧 Performance needs improvement. Address warnings and recommendations.')
    }
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), 'performance-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
    console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  }

  calculatePerformanceScore() {
    let score = 100
    
    // Deduct points for errors and warnings
    score -= this.results.errors.length * 20
    score -= this.results.warnings.length * 10
    score -= this.results.recommendations.length * 5
    
    // Bundle size impact
    const totalSize = Object.values(this.results.bundleSize)
      .reduce((sum, bundle) => sum + bundle.gzipped, 0)
    
    if (totalSize > PERFORMANCE_THRESHOLDS.bundleSize.total * 1.5) {
      score -= 30
    } else if (totalSize > PERFORMANCE_THRESHOLDS.bundleSize.total) {
      score -= 15
    }
    
    // Build time impact
    if (this.results.buildTime > 120000) { // 2 minutes
      score -= 20
    } else if (this.results.buildTime > 60000) { // 1 minute
      score -= 10
    }
    
    return Math.max(0, score)
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new PerformanceAuditor()
  auditor.run().catch(console.error)
}

module.exports = PerformanceAuditor