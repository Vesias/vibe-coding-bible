// Workshop Type Definitions - Core interfaces for the workshop system
export interface WorkshopLesson {
  id: string
  title: string
  content: string
  type: 'theory' | 'practice' | 'exercise' | 'reflection'
  estimatedTime: number
  xp: number
}

export interface WorkshopExercise {
  id: string
  title: string
  description: string
  instructions: string[]
  expectedOutput: string
  hints: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  xp: number
  aiAssistance?: boolean
}

export interface WorkshopData {
  id: string
  commandmentNumber: string
  title: string
  subtitle: string
  sacredSymbol: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  totalXP: number
  estimatedTime: number
  sacredWisdom: string
  prerequisites: string[]
  learningObjectives: string[]
  lessons: WorkshopLesson[]
  exercises: WorkshopExercise[]
  completionCriteria: string[]
  nextCommandment?: string
}

export type WorkshopRegistry = Record<string, WorkshopData>