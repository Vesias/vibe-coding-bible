'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSandbox, SandboxResult } from './sandbox'

export interface WorkshopStep {
  id: string
  type: 'lesson' | 'challenge' | 'quiz' | 'project' | 'reflection'
  title: string
  description: string
  content: string
  biblicalNarrative?: string
  hints: string[]
  solution?: string
  tests?: TestCase[]
  validation?: ValidationRule[]
  xpReward: number
  timeEstimate: number
  dependencies?: string[]
  order: number
}

export interface TestCase {
  name: string
  code: string
  expected: any
  hidden?: boolean
}

export interface ValidationRule {
  type: 'syntax' | 'output' | 'function' | 'variable' | 'pattern'
  rule: string
  message: string
  points: number
}

export interface WorkshopProgress {
  workshopId: string
  currentStep: number
  completedSteps: string[]
  stepProgress: Record<string, StepProgress>
  startedAt: string
  lastAccessed: string
  totalXPEarned: number
  timeSpent: number
}

export interface StepProgress {
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  attempts: number
  bestScore: number
  timeSpent: number
  hintsUsed: number
  codeSubmissions: CodeSubmission[]
  lastAttempt?: string
  masteredAt?: string
}

export interface CodeSubmission {
  code: string
  result: SandboxResult
  score: number
  feedback: string[]
  timestamp: string
  hintsUsed: number
}

export interface WorkshopContent {
  id: string
  title: string
  slug: string
  description: string
  commandmentNumber: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number
  xpReward: number
  prerequisites: string[]
  learningObjectives: string[]
  steps: WorkshopStep[]
  language: string
  tags: string[]
  isPublished: boolean
  featuredImage?: string
}

class WorkshopEngine {
  private currentWorkshop: WorkshopContent | null = null
  private progress: WorkshopProgress | null = null
  private sandbox = getSandbox()
  private listeners: Map<string, Function[]> = new Map()

  // Load workshop content and user progress
  async loadWorkshop(workshopId: string, userId: string): Promise<WorkshopContent> {
    const supabase = createClient()

    try {
      // Load workshop content
      const { data: workshop, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', workshopId)
        .single()

      if (workshopError) throw workshopError

      // Load workshop steps/challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('workshop_id', workshopId)
        .order('order_index')

      if (challengesError) throw challengesError

      // Transform database data to workshop content
      this.currentWorkshop = {
        id: workshop.id,
        title: workshop.title,
        slug: workshop.slug,
        description: workshop.description,
        commandmentNumber: workshop.commandment_number,
        difficulty: workshop.difficulty_level,
        estimatedDuration: workshop.estimated_duration,
        xpReward: workshop.xp_reward,
        prerequisites: workshop.prerequisites || [],
        learningObjectives: workshop.learning_objectives || [],
        language: 'javascript', // Default for now
        tags: workshop.tools_required || [],
        isPublished: workshop.is_published,
        featuredImage: workshop.featured_image,
        steps: challenges.map((challenge: any, index: number) => ({
          id: challenge.id,
          type: challenge.type as any,
          title: challenge.title,
          description: challenge.description,
          content: challenge.content?.content || '',
          biblicalNarrative: challenge.content?.narrative,
          hints: challenge.content?.hints || [],
          solution: challenge.solution?.code,
          tests: challenge.content?.tests || [],
          validation: challenge.content?.validation || [],
          xpReward: challenge.xp_reward,
          timeEstimate: challenge.time_limit || 30,
          order: challenge.order_index
        }))
      }

      // Load user progress
      await this.loadProgress(userId)

      return this.currentWorkshop

    } catch (error) {
      console.error('Error loading workshop:', error)
      throw error
    }
  }

  // Load user's progress for the current workshop
  async loadProgress(userId: string): Promise<WorkshopProgress> {
    if (!this.currentWorkshop) throw new Error('No workshop loaded')

    const supabase = createClient()

    try {
      // Load main progress record
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('workshop_id', this.currentWorkshop.id)
        .single()

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError
      }

      // Load detailed submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('user_id', userId)
        .in('challenge_id', this.currentWorkshop.steps.map(s => s.id))
        .order('submitted_at', { ascending: false })

      if (submissionsError) throw submissionsError

      // Create or update progress object
      if (progressData) {
        this.progress = {
          workshopId: this.currentWorkshop.id,
          currentStep: this.findCurrentStepIndex(progressData.current_challenge_id),
          completedSteps: progressData.completed_challenges || [],
          stepProgress: this.buildStepProgress(submissions || []),
          startedAt: progressData.started_at || new Date().toISOString(),
          lastAccessed: progressData.last_accessed,
          totalXPEarned: progressData.xp_earned,
          timeSpent: progressData.time_spent
        }
      } else {
        // Create new progress
        this.progress = {
          workshopId: this.currentWorkshop.id,
          currentStep: 0,
          completedSteps: [],
          stepProgress: {},
          startedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          totalXPEarned: 0,
          timeSpent: 0
        }

        // Save initial progress to database
        await this.saveProgress(userId)
      }

      return this.progress

    } catch (error) {
      console.error('Error loading progress:', error)
      throw error
    }
  }

  // Submit code for a specific step
  async submitCode(
    stepId: string, 
    code: string, 
    userId: string
  ): Promise<{ 
    result: SandboxResult
    score: number
    passed: boolean
    feedback: string[]
    newStepProgress: StepProgress
  }> {
    if (!this.currentWorkshop || !this.progress) {
      throw new Error('Workshop or progress not loaded')
    }

    const step = this.currentWorkshop.steps.find(s => s.id === stepId)
    if (!step) throw new Error('Step not found')

    try {
      // Execute code in sandbox
      const result = await this.sandbox.executeCode(
        code,
        { 
          language: this.currentWorkshop.language as any,
          enableTests: true,
          timeout: step.timeEstimate * 1000,
          memoryLimit: 64, // MB
          allowNetworking: false,
          allowFileSystem: false
        },
        step.tests
      )

      // Calculate score and feedback
      const { score, passed, feedback } = this.evaluateSubmission(step, result)

      // Update step progress
      const currentStepProgress = this.progress.stepProgress[stepId] || {
        status: 'not_started' as const,
        attempts: 0,
        bestScore: 0,
        timeSpent: 0,
        hintsUsed: 0,
        codeSubmissions: []
      }

      const newSubmission: CodeSubmission = {
        code,
        result,
        score,
        feedback,
        timestamp: new Date().toISOString(),
        hintsUsed: currentStepProgress.hintsUsed
      }

      const newStepProgress: StepProgress = {
        ...currentStepProgress,
        attempts: currentStepProgress.attempts + 1,
        bestScore: Math.max(currentStepProgress.bestScore, score),
        status: passed ? 'completed' : 'in_progress',
        codeSubmissions: [...currentStepProgress.codeSubmissions, newSubmission],
        lastAttempt: new Date().toISOString()
      }

      if (passed && score >= 90) {
        newStepProgress.status = 'mastered'
        newStepProgress.masteredAt = new Date().toISOString()
      }

      // Update progress
      this.progress.stepProgress[stepId] = newStepProgress

      if (passed && !this.progress.completedSteps.includes(stepId)) {
        this.progress.completedSteps.push(stepId)
        this.progress.totalXPEarned += step.xpReward
        
        // Move to next step
        const stepIndex = this.currentWorkshop.steps.findIndex(s => s.id === stepId)
        if (stepIndex < this.currentWorkshop.steps.length - 1) {
          this.progress.currentStep = stepIndex + 1
        }
      }

      // Save to database
      await this.saveSubmission(userId, stepId, newSubmission, score)
      await this.saveProgress(userId)

      // Emit events
      this.emit('stepCompleted', { stepId, passed, score })
      if (passed) {
        this.emit('stepPassed', { stepId, score, xpEarned: step.xpReward })
      }

      return {
        result,
        score,
        passed,
        feedback,
        newStepProgress
      }

    } catch (error) {
      console.error('Error submitting code:', error)
      throw error
    }
  }

  // Evaluate a code submission
  private evaluateSubmission(
    step: WorkshopStep, 
    result: SandboxResult
  ): { score: number; passed: boolean; feedback: string[] } {
    let score = 0
    const feedback: string[] = []
    const maxScore = 100

    // Check for runtime errors
    if (result.error) {
      feedback.push(`❌ Runtime Error: ${result.error}`)
      return { score: 0, passed: false, feedback }
    }

    // Evaluate tests
    if (result.tests && result.tests.length > 0) {
      const passedTests = result.tests.filter(t => t.passed).length
      const testScore = (passedTests / result.tests.length) * 70
      score += testScore

      if (passedTests === result.tests.length) {
        feedback.push(`✅ All tests passed! (${passedTests}/${result.tests.length})`)
      } else {
        feedback.push(`⚠️ ${passedTests}/${result.tests.length} tests passed`)
        
        // Add specific test feedback
        result.tests.forEach(test => {
          if (!test.passed) {
            feedback.push(`❌ ${test.name}: ${test.message || 'Test failed'}`)
          }
        })
      }
    }

    // Evaluate validation rules
    if (step.validation) {
      for (const rule of step.validation) {
        const ruleResult = this.evaluateValidationRule(rule, result)
        if (ruleResult.passed) {
          score += rule.points
          feedback.push(`✅ ${ruleResult.message}`)
        } else {
          feedback.push(`❌ ${ruleResult.message}`)
        }
      }
    }

    // Performance considerations
    if (result.executionTime > 1000) {
      feedback.push(`⚠️ Code took ${result.executionTime.toFixed(0)}ms to execute. Consider optimizing.`)
      score -= 5
    }

    // Code quality bonus (basic checks)
    if (step.type === 'challenge') {
      const qualityScore = this.evaluateCodeQuality(result)
      score += qualityScore
      if (qualityScore > 0) {
        feedback.push(`✨ Code quality bonus: +${qualityScore} points`)
      }
    }

    score = Math.max(0, Math.min(maxScore, score))
    const passed = score >= 70

    if (passed) {
      if (score >= 95) {
        feedback.unshift('🏆 Exceptional work! Divine mastery achieved!')
      } else if (score >= 85) {
        feedback.unshift('⭐ Excellent solution! Well done!')
      } else {
        feedback.unshift('✅ Good work! Challenge completed!')
      }
    } else {
      feedback.unshift('📖 Keep practicing! Review the requirements and try again.')
    }

    return { score, passed, feedback }
  }

  // Evaluate a specific validation rule
  private evaluateValidationRule(
    rule: ValidationRule, 
    result: SandboxResult
  ): { passed: boolean; message: string } {
    switch (rule.type) {
      case 'output':
        const hasExpectedOutput = result.output.includes(rule.rule)
        return {
          passed: hasExpectedOutput,
          message: hasExpectedOutput ? rule.message : `Expected output: "${rule.rule}"`
        }

      case 'function':
        const hasFunctionDeclaration = result.logs.some(log => 
          log.includes(rule.rule) || result.output.includes(rule.rule)
        )
        return {
          passed: hasFunctionDeclaration,
          message: hasFunctionDeclaration ? rule.message : `Function "${rule.rule}" not found`
        }

      case 'variable':
        const hasVariable = result.logs.some(log => log.includes(rule.rule))
        return {
          passed: hasVariable,
          message: hasVariable ? rule.message : `Variable "${rule.rule}" not found`
        }

      case 'pattern':
        const regex = new RegExp(rule.rule)
        const matchesPattern = regex.test(result.output)
        return {
          passed: matchesPattern,
          message: matchesPattern ? rule.message : `Pattern "${rule.rule}" not matched`
        }

      default:
        return { passed: true, message: rule.message }
    }
  }

  // Evaluate basic code quality
  private evaluateCodeQuality(result: SandboxResult): number {
    let qualityScore = 0

    // Efficient execution (under 100ms)
    if (result.executionTime < 100) {
      qualityScore += 5
    }

    // No excessive logging
    if (result.logs.length <= 3) {
      qualityScore += 3
    }

    // Clean execution (no errors in logs)
    const hasErrors = result.logs.some(log => log.includes('ERROR'))
    if (!hasErrors) {
      qualityScore += 2
    }

    return qualityScore
  }

  // Get hint for current step
  getHint(stepId: string, hintIndex: number): string | null {
    if (!this.currentWorkshop) return null

    const step = this.currentWorkshop.steps.find(s => s.id === stepId)
    if (!step || !step.hints || hintIndex >= step.hints.length) {
      return null
    }

    // Update hint usage
    if (this.progress) {
      const stepProgress = this.progress.stepProgress[stepId] || {
        status: 'in_progress' as const,
        attempts: 0,
        bestScore: 0,
        timeSpent: 0,
        hintsUsed: 0,
        codeSubmissions: []
      }

      stepProgress.hintsUsed = Math.max(stepProgress.hintsUsed, hintIndex + 1)
      this.progress.stepProgress[stepId] = stepProgress
    }

    return step.hints[hintIndex]
  }

  // Save progress to database
  private async saveProgress(userId: string): Promise<void> {
    if (!this.currentWorkshop || !this.progress) return

    const supabase = createClient()

    const progressData = {
      user_id: userId,
      workshop_id: this.currentWorkshop.id,
      status: this.getOverallStatus(),
      progress_percentage: this.getProgressPercentage(),
      current_challenge_id: this.currentWorkshop.steps[this.progress.currentStep]?.id,
      completed_challenges: this.progress.completedSteps,
      xp_earned: this.progress.totalXPEarned,
      time_spent: this.progress.timeSpent,
      last_accessed: new Date().toISOString(),
      started_at: this.progress.startedAt
    }

    const { error } = await supabase
      .from('user_progress')
      .upsert(progressData)

    if (error) {
      console.error('Error saving progress:', error)
      throw error
    }
  }

  // Save individual submission
  private async saveSubmission(
    userId: string,
    challengeId: string,
    submission: CodeSubmission,
    score: number
  ): Promise<void> {
    const supabase = createClient()

    const submissionData = {
      user_id: userId,
      challenge_id: challengeId,
      code: submission.code,
      answer: submission.result,
      score,
      is_correct: submission.result.error === undefined,
      feedback: submission.feedback.join('\n'),
      execution_time: submission.result.executionTime,
      submitted_at: submission.timestamp
    }

    const { error } = await supabase
      .from('challenge_submissions')
      .insert(submissionData)

    if (error) {
      console.error('Error saving submission:', error)
    }
  }

  // Helper methods
  private findCurrentStepIndex(challengeId?: string): number {
    if (!this.currentWorkshop || !challengeId) return 0
    const index = this.currentWorkshop.steps.findIndex(s => s.id === challengeId)
    return index >= 0 ? index : 0
  }

  private buildStepProgress(submissions: any[]): Record<string, StepProgress> {
    const stepProgress: Record<string, StepProgress> = {}

    // Group submissions by challenge
    const submissionsByChallenge = submissions.reduce((acc, sub) => {
      if (!acc[sub.challenge_id]) acc[sub.challenge_id] = []
      acc[sub.challenge_id].push(sub)
      return acc
    }, {})

    // Build progress for each step
    Object.keys(submissionsByChallenge).forEach(challengeId => {
      const challengeSubmissions = submissionsByChallenge[challengeId]
      const bestSubmission = challengeSubmissions.reduce((best: any, current: any) => 
        current.score > best.score ? current : best
      )

      stepProgress[challengeId] = {
        status: bestSubmission.is_correct ? 'completed' : 'in_progress',
        attempts: challengeSubmissions.length,
        bestScore: bestSubmission.score,
        timeSpent: challengeSubmissions.reduce((total: number, sub: any) => total + (sub.execution_time || 0), 0),
        hintsUsed: 0, // Would need to track this separately
        codeSubmissions: challengeSubmissions.map((sub: any) => ({
          code: sub.code,
          result: sub.answer,
          score: sub.score,
          feedback: sub.feedback ? sub.feedback.split('\n') : [],
          timestamp: sub.submitted_at,
          hintsUsed: 0
        })),
        lastAttempt: challengeSubmissions[0].submitted_at
      }
    })

    return stepProgress
  }

  private getOverallStatus(): 'not_started' | 'in_progress' | 'completed' | 'mastered' {
    if (!this.progress || !this.currentWorkshop) return 'not_started'

    const totalSteps = this.currentWorkshop.steps.length
    const completedSteps = this.progress.completedSteps.length

    if (completedSteps === 0) return 'not_started'
    if (completedSteps === totalSteps) {
      // Check if mastered (all steps with score >= 90)
      const allMastered = this.currentWorkshop.steps.every(step => {
        const stepProgress = this.progress!.stepProgress[step.id]
        return stepProgress && stepProgress.bestScore >= 90
      })
      return allMastered ? 'mastered' : 'completed'
    }
    return 'in_progress'
  }

  private getProgressPercentage(): number {
    if (!this.progress || !this.currentWorkshop) return 0
    return Math.round((this.progress.completedSteps.length / this.currentWorkshop.steps.length) * 100)
  }

  // Event system
  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event) || []
    listeners.forEach(listener => listener(data))
  }

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
  }

  off(event: string, listener: Function): void {
    const listeners = this.listeners.get(event) || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  // Getters
  getCurrentWorkshop(): WorkshopContent | null {
    return this.currentWorkshop
  }

  getProgress(): WorkshopProgress | null {
    return this.progress
  }

  getCurrentStep(): WorkshopStep | null {
    if (!this.currentWorkshop || !this.progress) return null
    return this.currentWorkshop.steps[this.progress.currentStep] || null
  }

  cleanup(): void {
    this.sandbox.cleanup()
    this.listeners.clear()
  }
}

// React hook for using the workshop engine
export function useWorkshopEngine() {
  const [engine] = useState(() => new WorkshopEngine())
  const [workshop, setWorkshop] = useState<WorkshopContent | null>(null)
  const [progress, setProgress] = useState<WorkshopProgress | null>(null)
  const [currentStep, setCurrentStep] = useState<WorkshopStep | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set up event listeners
    const handleStepCompleted = () => {
      setProgress(engine.getProgress())
      setCurrentStep(engine.getCurrentStep())
    }

    engine.on('stepCompleted', handleStepCompleted)
    engine.on('stepPassed', handleStepCompleted)

    return () => {
      engine.off('stepCompleted', handleStepCompleted)
      engine.off('stepPassed', handleStepCompleted)
    }
  }, [engine])

  const loadWorkshop = async (workshopId: string, userId: string) => {
    setLoading(true)
    try {
      const workshopData = await engine.loadWorkshop(workshopId, userId)
      setWorkshop(workshopData)
      setProgress(engine.getProgress())
      setCurrentStep(engine.getCurrentStep())
    } finally {
      setLoading(false)
    }
  }

  const submitCode = async (stepId: string, code: string, userId: string) => {
    return engine.submitCode(stepId, code, userId)
  }

  const getHint = (stepId: string, hintIndex: number) => {
    return engine.getHint(stepId, hintIndex)
  }

  useEffect(() => {
    return () => engine.cleanup()
  }, [engine])

  return {
    workshop,
    progress,
    currentStep,
    loading,
    loadWorkshop,
    submitCode,
    getHint,
    engine
  }
}