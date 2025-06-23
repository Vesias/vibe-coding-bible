import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, AuthenticatedRequest, createApiResponse, createErrorResponse } from '@/lib/auth/middleware'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAIProvider } from '@/lib/ai/provider'
import { Database } from '@/lib/database.types'

// Validation schemas
const SubmissionSchema = z.object({
  code: z.string().optional(),
  answer: z.any().optional(), // For quiz/multiple choice answers
  explanation: z.string().max(1000).optional(),
  time_spent: z.number().min(0).optional(),
  attempt_number: z.number().min(1).optional()
}).refine(data => data.code || data.answer, {
  message: "Either code or answer must be provided"
})

interface ChallengeSubmissionParams {
  params: {
    id: string
  }
}

async function handleSubmitChallenge(
  request: AuthenticatedRequest,
  { params }: ChallengeSubmissionParams
) {
  try {
    const challengeId = params.id
    const body = await request.json()
    
    const validation = SubmissionSchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Invalid submission format',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { code, answer, explanation, time_spent, attempt_number } = validation.data

    // Get challenge details
    const challenge = await getChallengeDetails(challengeId)
    if (!challenge) {
      return createErrorResponse('Challenge not found', 404, 'NOT_FOUND')
    }

    // Check workshop access
    const hasAccess = await checkWorkshopAccess(challenge.workshop_id, request.user)
    if (!hasAccess) {
      return createErrorResponse('Access denied to this workshop', 403, 'ACCESS_DENIED')
    }

    // Check submission limits
    const submissionCheck = await checkSubmissionLimits(challengeId, request.user.id, challenge)
    if (!submissionCheck.allowed) {
      return createErrorResponse(submissionCheck.message, 429, 'SUBMISSION_LIMIT')
    }

    // Evaluate the submission
    const evaluation = await evaluateSubmission(challenge, { code, answer, explanation })
    
    // Save submission to database
    const submission = await saveSubmission({
      user_id: request.user.id,
      challenge_id: challengeId,
      code,
      answer,
      score: evaluation.score,
      is_correct: evaluation.isCorrect,
      feedback: evaluation.feedback,
      execution_time: evaluation.executionTime,
      attempt_number: attempt_number || 1
    })

    if (!submission) {
      return createErrorResponse('Failed to save submission', 500, 'DB_ERROR')
    }

    // Award XP if correct
    let xpAwarded = 0
    if (evaluation.isCorrect) {
      xpAwarded = await awardChallengeXP(
        request.user.id,
        challenge,
        evaluation.score,
        attempt_number || 1
      )
    }

    // Update workshop progress
    await updateWorkshopProgress(
      request.user.id,
      challenge.workshop_id,
      challengeId,
      evaluation.isCorrect
    )

    // Check for achievements
    const newAchievements = await checkChallengeAchievements(
      request.user.id,
      challenge,
      evaluation,
      submission
    )

    // Generate personalized feedback
    const personalizedFeedback = await generatePersonalizedFeedback(
      challenge,
      { code, answer, explanation },
      evaluation,
      request.user
    )

    return createApiResponse({
      submission_id: submission.id,
      score: evaluation.score,
      is_correct: evaluation.isCorrect,
      feedback: evaluation.feedback,
      personalized_feedback: personalizedFeedback,
      xp_awarded: xpAwarded,
      execution_time: evaluation.executionTime,
      new_achievements: newAchievements,
      next_steps: evaluation.nextSteps || [],
      divine_wisdom: generateDivineWisdom(evaluation.isCorrect, challenge.difficulty)
    })

  } catch (error) {
    console.error('Submit challenge error:', error)
    return createErrorResponse(
      'Failed to process submission',
      500,
      'INTERNAL_ERROR'
    )
  }
}

async function handleGetSubmissionHistory(
  request: AuthenticatedRequest,
  { params }: ChallengeSubmissionParams
) {
  try {
    const challengeId = params.id
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50)

    // Get challenge details to verify access
    const challenge = await getChallengeDetails(challengeId)
    if (!challenge) {
      return createErrorResponse('Challenge not found', 404, 'NOT_FOUND')
    }

    // Check workshop access
    const hasAccess = await checkWorkshopAccess(challenge.workshop_id, request.user)
    if (!hasAccess) {
      return createErrorResponse('Access denied to this workshop', 403, 'ACCESS_DENIED')
    }

    // Get submission history
    const submissions = await getSubmissionHistory(challengeId, request.user.id, limit)

    return createApiResponse({
      challenge_id: challengeId,
      submissions: submissions.map(sub => ({
        id: sub.id,
        score: sub.score,
        is_correct: sub.is_correct,
        feedback: sub.feedback,
        submitted_at: sub.submitted_at,
        execution_time: sub.execution_time,
        // Don't return code/answer for security
        has_code: !!sub.code,
        has_answer: !!sub.answer
      })),
      total_submissions: submissions.length,
      best_score: Math.max(...submissions.map(s => s.score), 0),
      latest_correct: submissions.find(s => s.is_correct)?.submitted_at || null
    })

  } catch (error) {
    console.error('Get submission history error:', error)
    return createErrorResponse(
      'Failed to get submission history',
      500,
      'INTERNAL_ERROR'
    )
  }
}

// Helper functions
async function getChallengeDetails(challengeId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single()

    if (error) {
      console.error('Error getting challenge details:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting challenge details:', error)
    return null
  }
}

async function checkWorkshopAccess(workshopId: string, user: AuthenticatedRequest['user']): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: workshop, error } = await supabase
      .from('workshops')
      .select('commandment_number, difficulty_level')
      .eq('id', workshopId)
      .single()

    if (error || !workshop) {
      return false
    }

    // Check subscription requirements
    const requiresPremium = workshop.commandment_number > 2
    if (requiresPremium && user.subscription_status === 'free') {
      return false
    }

    // Check advanced workshops
    if (workshop.difficulty_level === 'advanced' && 
        !['pro', 'divine'].includes(user.subscription_status)) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking workshop access:', error)
    return false
  }
}

async function checkSubmissionLimits(
  challengeId: string,
  userId: string,
  challenge: any
): Promise<{ allowed: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if challenge has max attempts limit
    if (challenge.max_attempts) {
      const { data: submissions, error } = await supabase
        .from('challenge_submissions')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error checking submission limits:', error)
        return { allowed: true, message: '' } // Allow on error
      }

      if (submissions.length >= challenge.max_attempts) {
        return {
          allowed: false,
          message: `Maximum attempts (${challenge.max_attempts}) reached for this challenge`
        }
      }
    }

    // Check time-based limits (e.g., no more than 5 submissions per minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
    const { data: recentSubmissions, error: recentError } = await supabase
      .from('challenge_submissions')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .gte('submitted_at', oneMinuteAgo)

    if (recentError) {
      console.error('Error checking recent submissions:', recentError)
      return { allowed: true, message: '' }
    }

    if (recentSubmissions.length >= 5) {
      return {
        allowed: false,
        message: 'Too many submissions in the last minute. Please wait before submitting again.'
      }
    }

    return { allowed: true, message: '' }

  } catch (error) {
    console.error('Error checking submission limits:', error)
    return { allowed: true, message: '' }
  }
}

async function evaluateSubmission(
  challenge: any,
  submission: { code?: string; answer?: any; explanation?: string }
): Promise<{
  score: number
  isCorrect: boolean
  feedback: string
  executionTime?: number
  nextSteps?: string[]
}> {
  try {
    switch (challenge.type) {
      case 'coding':
        return await evaluateCodingChallenge(challenge, submission.code!)
      
      case 'quiz':
        return await evaluateQuizChallenge(challenge, submission.answer)
      
      case 'essay':
        return await evaluateEssayChallenge(challenge, submission.answer, submission.explanation)
      
      case 'project':
        return await evaluateProjectChallenge(challenge, submission.code!, submission.explanation)
      
      default:
        return {
          score: 0,
          isCorrect: false,
          feedback: 'Unknown challenge type'
        }
    }
  } catch (error) {
    console.error('Error evaluating submission:', error)
    return {
      score: 0,
      isCorrect: false,
      feedback: 'Error evaluating submission'
    }
  }
}

async function evaluateCodingChallenge(challenge: any, code: string) {
  // This would typically run the code in a sandbox and check against test cases
  // For now, we'll do a simple AI-based evaluation
  
  const startTime = Date.now()
  
  try {
    const aiProvider = getAIProvider()
    
    const prompt = `
    Evaluate this coding solution for the following challenge:
    
    Challenge: ${challenge.title}
    Description: ${challenge.description}
    Expected Solution Pattern: ${JSON.stringify(challenge.solution)}
    
    Student's Code:
    \`\`\`
    ${code}
    \`\`\`
    
    Please provide:
    1. A score from 0-100
    2. Whether the solution is correct (true/false)
    3. Specific feedback on the code quality, correctness, and improvements
    4. Next steps for improvement
    
    Respond in JSON format:
    {
      "score": number,
      "isCorrect": boolean,
      "feedback": "detailed feedback",
      "nextSteps": ["step1", "step2"]
    }
    `

    const response = await aiProvider.generateResponse([
      { role: 'system', content: 'You are a coding mentor providing detailed evaluations.' },
      { role: 'user', content: prompt }
    ], {
      model: 'claude-3-5-sonnet',
      temperature: 0.3
    })

    const evaluation = JSON.parse(response.content)
    
    return {
      ...evaluation,
      executionTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('Error in AI evaluation:', error)
    
    // Fallback evaluation
    const hasBasicStructure = code.includes('function') || code.includes('def') || code.includes('class')
    const score = hasBasicStructure ? 50 : 20
    
    return {
      score,
      isCorrect: score >= challenge.passing_score || 70,
      feedback: 'Basic evaluation completed. Code structure detected.',
      executionTime: Date.now() - startTime,
      nextSteps: ['Review the challenge requirements', 'Test your solution thoroughly']
    }
  }
}

async function evaluateQuizChallenge(challenge: any, answer: any) {
  const solution = challenge.solution as any
  
  if (solution && solution.correct_answer !== undefined) {
    const isCorrect = answer === solution.correct_answer
    const score = isCorrect ? 100 : 0
    
    return {
      score,
      isCorrect,
      feedback: isCorrect ? 'Correct answer!' : `Incorrect. The correct answer is: ${solution.correct_answer}`,
      nextSteps: isCorrect ? ['Continue to the next challenge'] : ['Review the concept and try again']
    }
  }
  
  return {
    score: 0,
    isCorrect: false,
    feedback: 'Unable to evaluate quiz answer'
  }
}

async function evaluateEssayChallenge(challenge: any, answer: string, explanation?: string) {
  // AI-based evaluation for essay questions
  try {
    const aiProvider = getAIProvider()
    
    const prompt = `
    Evaluate this essay response:
    
    Question: ${challenge.description}
    Student's Answer: ${answer}
    Additional Explanation: ${explanation || 'None provided'}
    
    Provide a score (0-100) and detailed feedback focusing on:
    - Understanding of concepts
    - Clarity of explanation
    - Completeness of answer
    - Practical application
    
    Respond in JSON format:
    {
      "score": number,
      "isCorrect": boolean,
      "feedback": "detailed feedback",
      "nextSteps": ["improvement suggestions"]
    }
    `

    const response = await aiProvider.generateResponse([
      { role: 'system', content: 'You are an educational evaluator providing constructive feedback.' },
      { role: 'user', content: prompt }
    ], {
      model: 'gpt-4',
      temperature: 0.4
    })

    return JSON.parse(response.content)

  } catch (error) {
    console.error('Error evaluating essay:', error)
    
    const wordCount = answer.split(' ').length
    const score = Math.min(wordCount * 2, 80) // Basic scoring based on word count
    
    return {
      score,
      isCorrect: score >= 60,
      feedback: 'Basic evaluation completed based on response length and structure.',
      nextSteps: ['Provide more detailed explanations', 'Include specific examples']
    }
  }
}

async function evaluateProjectChallenge(challenge: any, code: string, explanation?: string) {
  // Combined evaluation of code and explanation
  const codeEval = await evaluateCodingChallenge(challenge, code)
  
  // Bonus points for good explanation
  const explanationBonus = explanation && explanation.length > 50 ? 10 : 0
  
  return {
    score: Math.min(codeEval.score + explanationBonus, 100),
    isCorrect: codeEval.isCorrect,
    feedback: `${codeEval.feedback}${explanation ? ' Good explanation provided.' : ' Consider adding an explanation.'}`,
    executionTime: codeEval.executionTime,
    nextSteps: codeEval.nextSteps
  }
}

async function saveSubmission(submissionData: any) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('challenge_submissions')
      .insert({
        ...submissionData,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving submission:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error saving submission:', error)
    return null
  }
}

async function awardChallengeXP(
  userId: string,
  challenge: any,
  score: number,
  attemptNumber: number
): Promise<number> {
  try {
    // Calculate XP based on challenge difficulty and performance
    let baseXP = challenge.xp_reward || 10
    
    // Reduce XP for multiple attempts
    const attemptMultiplier = Math.max(0.5, 1 - (attemptNumber - 1) * 0.1)
    
    // Score multiplier
    const scoreMultiplier = score / 100
    
    const finalXP = Math.round(baseXP * attemptMultiplier * scoreMultiplier)

    if (finalXP > 0) {
      const supabase = await createServerSupabaseClient()
      
      // Get current user stats
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('total_xp, current_level')
        .eq('id', userId)
        .single()

      if (fetchError || !user) {
        console.error('Error fetching user for XP award:', fetchError)
        return 0
      }

      const newTotalXP = user.total_xp + finalXP
      const newLevel = Math.floor(newTotalXP / 1000) + 1

      // Update user XP and level
      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_xp: newTotalXP,
          current_level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating user XP:', updateError)
        return 0
      }
    }

    return finalXP
  } catch (error) {
    console.error('Error awarding challenge XP:', error)
    return 0
  }
}

async function updateWorkshopProgress(
  userId: string,
  workshopId: string,
  challengeId: string,
  isCorrect: boolean
) {
  if (!isCorrect) return

  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current progress
    const { data: progress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('workshop_id', workshopId)
      .single()

    if (fetchError) {
      console.error('Error fetching workshop progress:', fetchError)
      return
    }

    // Add challenge to completed list if not already there
    const completedChallenges = progress.completed_challenges || []
    if (!completedChallenges.includes(challengeId)) {
      completedChallenges.push(challengeId)
    }

    // Calculate new progress percentage
    const { data: allChallenges } = await supabase
      .from('challenges')
      .select('id')
      .eq('workshop_id', workshopId)

    const totalChallenges = allChallenges?.length || 1
    const progressPercentage = Math.round((completedChallenges.length / totalChallenges) * 100)

    // Update progress
    await supabase
      .from('user_progress')
      .update({
        completed_challenges: completedChallenges,
        progress_percentage: progressPercentage,
        status: progressPercentage === 100 ? 'completed' : 'in_progress',
        last_accessed: new Date().toISOString()
      })
      .eq('id', progress.id)

  } catch (error) {
    console.error('Error updating workshop progress:', error)
  }
}

async function checkChallengeAchievements(
  userId: string,
  challenge: any,
  evaluation: any,
  submission: any
): Promise<string[]> {
  // Implement achievement checking logic
  const newAchievements: string[] = []
  
  // Perfect score achievement
  if (evaluation.score === 100) {
    newAchievements.push('perfect_score')
  }
  
  // First challenge completion
  if (evaluation.isCorrect) {
    newAchievements.push('first_challenge_completed')
  }
  
  return newAchievements
}

async function generatePersonalizedFeedback(
  challenge: any,
  submission: any,
  evaluation: any,
  user: AuthenticatedRequest['user']
): Promise<string> {
  try {
    const aiProvider = getAIProvider()
    
    const prompt = `
    Provide personalized feedback for this coding student:
    
    Student Level: ${user.prophet_rank}
    Challenge: ${challenge.title}
    Submission Score: ${evaluation.score}
    Was Correct: ${evaluation.isCorrect}
    
    Please provide encouraging, personalized feedback that:
    1. Acknowledges their current level
    2. Gives specific next steps
    3. Connects to their learning journey
    4. Uses biblical/inspirational metaphors when appropriate
    
    Keep it under 200 words and be encouraging.
    `

    const response = await aiProvider.generateResponse([
      { role: 'system', content: 'You are a wise coding mentor providing personalized encouragement.' },
      { role: 'user', content: prompt }
    ], {
      personality: 'Moses the Code Giver',
      model: 'gpt-4',
      temperature: 0.7
    })

    return response.content
  } catch (error) {
    console.error('Error generating personalized feedback:', error)
    return evaluation.isCorrect 
      ? "Well done! Your solution shows great understanding. Keep practicing to master this concept."
      : "Keep learning! Every challenge is an opportunity to grow. Review the feedback and try again when ready."
  }
}

async function getSubmissionHistory(challengeId: string, userId: string, limit: number) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('challenge_submissions')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting submission history:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting submission history:', error)
    return []
  }
}

function generateDivineWisdom(isCorrect: boolean, difficulty: string): string {
  const successWisdom = [
    "As it is written: 'Every line of code brings you closer to enlightenment.'",
    "The sacred scrolls speak: 'Success is not the absence of bugs, but the wisdom to fix them.'",
    "Divine truth: 'In debugging, we find not just solutions, but understanding.'"
  ]
  
  const encouragementWisdom = [
    "Remember: 'The mightiest oak was once an acorn that held its ground.'",
    "Ancient wisdom teaches: 'Every error is a teacher in disguise.'",
    "As the prophets say: 'The path to mastery is paved with persistent practice.'"
  ]
  
  const wisdom = isCorrect ? successWisdom : encouragementWisdom
  return wisdom[Math.floor(Math.random() * wisdom.length)]
}

// Create rate-limited handlers
const rateLimitedSubmitHandler = withRateLimit(
  withAuth(handleSubmitChallenge, { requireSubscription: false }),
  rateLimitConfigs.api
)

const rateLimitedHistoryHandler = withRateLimit(
  withAuth(handleGetSubmissionHistory, { requireSubscription: false }),
  rateLimitConfigs.api
)

export const POST = rateLimitedSubmitHandler
export const GET = rateLimitedHistoryHandler