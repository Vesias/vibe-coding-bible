import { z } from 'zod'

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional()
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// API response schemas
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    fullName: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    subscriptionStatus: z.enum(['free', 'basic', 'pro', 'divine']),
    createdAt: z.string()
  }).nullable(),
  error: z.string().nullable()
})

// Workshop validation schemas
export const workshopProgressSchema = z.object({
  workshopId: z.string(),
  chapterId: z.string(),
  completed: z.boolean(),
  score: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0).optional(),
  notes: z.string().optional()
})

export const submitExerciseSchema = z.object({
  exerciseId: z.string(),
  answer: z.string().min(1, 'Answer is required'),
  timeSpent: z.number().min(0),
  hints: z.array(z.string()).optional()
})

// Type exports
export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type WorkshopProgress = z.infer<typeof workshopProgressSchema>
export type SubmitExercise = z.infer<typeof submitExerciseSchema>