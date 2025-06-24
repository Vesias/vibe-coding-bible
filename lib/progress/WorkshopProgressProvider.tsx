'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface WorkshopProgress {
  workshopId: string
  lessonsCompleted: string[]
  exercisesCompleted: string[]
  totalXPEarned: number
  currentLesson: string | null
  startedAt: Date
  lastActivity: Date
  sessionTime: number // total time spent in minutes
  streak: number // consecutive days
  completionPercentage: number
  isCompleted: boolean
}

export interface GlobalProgress {
  completedWorkshops: string[]
  totalXPEarned: number
  currentStreak: number
  certificatesEarned: string[]
  startedAt: Date
  lastActivity: Date
  level: number
  achievements: string[]
  preferences: {
    sessionReminders: boolean
    streakNotifications: boolean
    darkMode: boolean
  }
}

interface ProgressState {
  globalProgress: GlobalProgress
  workshopProgress: Record<string, WorkshopProgress>
  isLoading: boolean
  error: string | null
}

type ProgressAction =
  | { type: 'LOAD_PROGRESS'; payload: ProgressState }
  | { type: 'START_WORKSHOP'; payload: { workshopId: string } }
  | { type: 'COMPLETE_LESSON'; payload: { workshopId: string; lessonId: string; xp: number } }
  | { type: 'COMPLETE_EXERCISE'; payload: { workshopId: string; exerciseId: string; xp: number } }
  | { type: 'COMPLETE_WORKSHOP'; payload: { workshopId: string; totalXP: number } }
  | { type: 'UPDATE_SESSION_TIME'; payload: { workshopId: string; minutes: number } }
  | { type: 'UPDATE_STREAK'; payload: { streak: number } }
  | { type: 'EARN_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<GlobalProgress['preferences']> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }

const initialGlobalProgress: GlobalProgress = {
  completedWorkshops: [],
  totalXPEarned: 0,
  currentStreak: 0,
  certificatesEarned: [],
  startedAt: new Date(),
  lastActivity: new Date(),
  level: 1,
  achievements: [],
  preferences: {
    sessionReminders: true,
    streakNotifications: true,
    darkMode: false
  }
}

const initialState: ProgressState = {
  globalProgress: initialGlobalProgress,
  workshopProgress: {},
  isLoading: false,
  error: null
}

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return {
        ...action.payload,
        isLoading: false,
        error: null
      }

    case 'START_WORKSHOP': {
      const { workshopId } = action.payload
      const existingProgress = state.workshopProgress[workshopId]
      
      if (existingProgress) {
        return state // Already started
      }

      const newWorkshopProgress: WorkshopProgress = {
        workshopId,
        lessonsCompleted: [],
        exercisesCompleted: [],
        totalXPEarned: 0,
        currentLesson: null,
        startedAt: new Date(),
        lastActivity: new Date(),
        sessionTime: 0,
        streak: 0,
        completionPercentage: 0,
        isCompleted: false
      }

      return {
        ...state,
        workshopProgress: {
          ...state.workshopProgress,
          [workshopId]: newWorkshopProgress
        },
        globalProgress: {
          ...state.globalProgress,
          lastActivity: new Date()
        }
      }
    }

    case 'COMPLETE_LESSON': {
      const { workshopId, lessonId, xp } = action.payload
      const currentProgress = state.workshopProgress[workshopId]
      
      if (!currentProgress || currentProgress.lessonsCompleted.includes(lessonId)) {
        return state
      }

      const updatedProgress = {
        ...currentProgress,
        lessonsCompleted: [...currentProgress.lessonsCompleted, lessonId],
        totalXPEarned: currentProgress.totalXPEarned + xp,
        lastActivity: new Date(),
        currentLesson: lessonId
      }

      // Recalculate completion percentage
      // This would need the workshop data to calculate properly
      updatedProgress.completionPercentage = calculateCompletionPercentage(updatedProgress)

      return {
        ...state,
        workshopProgress: {
          ...state.workshopProgress,
          [workshopId]: updatedProgress
        },
        globalProgress: {
          ...state.globalProgress,
          totalXPEarned: state.globalProgress.totalXPEarned + xp,
          lastActivity: new Date()
        }
      }
    }

    case 'COMPLETE_EXERCISE': {
      const { workshopId, exerciseId, xp } = action.payload
      const currentProgress = state.workshopProgress[workshopId]
      
      if (!currentProgress || currentProgress.exercisesCompleted.includes(exerciseId)) {
        return state
      }

      const updatedProgress = {
        ...currentProgress,
        exercisesCompleted: [...currentProgress.exercisesCompleted, exerciseId],
        totalXPEarned: currentProgress.totalXPEarned + xp,
        lastActivity: new Date()
      }

      updatedProgress.completionPercentage = calculateCompletionPercentage(updatedProgress)

      return {
        ...state,
        workshopProgress: {
          ...state.workshopProgress,
          [workshopId]: updatedProgress
        },
        globalProgress: {
          ...state.globalProgress,
          totalXPEarned: state.globalProgress.totalXPEarned + xp,
          lastActivity: new Date()
        }
      }
    }

    case 'COMPLETE_WORKSHOP': {
      const { workshopId, totalXP } = action.payload
      const currentProgress = state.workshopProgress[workshopId]
      
      if (!currentProgress) {
        return state
      }

      const updatedProgress = {
        ...currentProgress,
        isCompleted: true,
        completionPercentage: 100,
        lastActivity: new Date()
      }

      // Calculate new level
      const newTotalXP = state.globalProgress.totalXPEarned
      const newLevel = calculateLevel(newTotalXP)

      return {
        ...state,
        workshopProgress: {
          ...state.workshopProgress,
          [workshopId]: updatedProgress
        },
        globalProgress: {
          ...state.globalProgress,
          completedWorkshops: [...state.globalProgress.completedWorkshops, workshopId],
          certificatesEarned: [...state.globalProgress.certificatesEarned, workshopId],
          level: newLevel,
          lastActivity: new Date()
        }
      }
    }

    case 'UPDATE_SESSION_TIME': {
      const { workshopId, minutes } = action.payload
      const currentProgress = state.workshopProgress[workshopId]
      
      if (!currentProgress) {
        return state
      }

      return {
        ...state,
        workshopProgress: {
          ...state.workshopProgress,
          [workshopId]: {
            ...currentProgress,
            sessionTime: currentProgress.sessionTime + minutes,
            lastActivity: new Date()
          }
        },
        globalProgress: {
          ...state.globalProgress,
          lastActivity: new Date()
        }
      }
    }

    case 'UPDATE_STREAK': {
      return {
        ...state,
        globalProgress: {
          ...state.globalProgress,
          currentStreak: action.payload.streak
        }
      }
    }

    case 'EARN_ACHIEVEMENT': {
      const { achievementId } = action.payload
      
      if (state.globalProgress.achievements.includes(achievementId)) {
        return state
      }

      return {
        ...state,
        globalProgress: {
          ...state.globalProgress,
          achievements: [...state.globalProgress.achievements, achievementId]
        }
      }
    }

    case 'UPDATE_PREFERENCES': {
      return {
        ...state,
        globalProgress: {
          ...state.globalProgress,
          preferences: {
            ...state.globalProgress.preferences,
            ...action.payload
          }
        }
      }
    }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

// Helper functions
function calculateCompletionPercentage(progress: WorkshopProgress): number {
  // This is a simplified calculation
  // In a real implementation, you'd get the total lessons/exercises from workshop data
  const totalCompleted = progress.lessonsCompleted.length + progress.exercisesCompleted.length
  const totalTasks = 10 // This should come from actual workshop data
  return Math.min(100, Math.round((totalCompleted / totalTasks) * 100))
}

function calculateLevel(totalXP: number): number {
  // Simple level calculation: every 1000 XP = 1 level
  return Math.floor(totalXP / 1000) + 1
}

// Context
const ProgressContext = createContext<{
  state: ProgressState
  dispatch: React.Dispatch<ProgressAction>
  // Helper functions
  startWorkshop: (workshopId: string) => void
  completeLesson: (workshopId: string, lessonId: string, xp: number) => void
  completeExercise: (workshopId: string, exerciseId: string, xp: number) => void
  completeWorkshop: (workshopId: string, totalXP: number) => void
  updateSessionTime: (workshopId: string, minutes: number) => void
  getWorkshopProgress: (workshopId: string) => WorkshopProgress | null
} | null>(null)

// Provider component
interface WorkshopProgressProviderProps {
  children: ReactNode
}

export const WorkshopProgressProvider: React.FC<WorkshopProgressProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState)

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('vibe-coding-progress')
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress)
        dispatch({ type: 'LOAD_PROGRESS', payload: parsed })
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load progress' })
    }
  }, [])

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    if (!state.isLoading && !state.error) {
      try {
        localStorage.setItem('vibe-coding-progress', JSON.stringify(state))
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    }
  }, [state])

  // Helper functions
  const startWorkshop = (workshopId: string) => {
    dispatch({ type: 'START_WORKSHOP', payload: { workshopId } })
  }

  const completeLesson = (workshopId: string, lessonId: string, xp: number) => {
    dispatch({ type: 'COMPLETE_LESSON', payload: { workshopId, lessonId, xp } })
  }

  const completeExercise = (workshopId: string, exerciseId: string, xp: number) => {
    dispatch({ type: 'COMPLETE_EXERCISE', payload: { workshopId, exerciseId, xp } })
  }

  const completeWorkshop = (workshopId: string, totalXP: number) => {
    dispatch({ type: 'COMPLETE_WORKSHOP', payload: { workshopId, totalXP } })
  }

  const updateSessionTime = (workshopId: string, minutes: number) => {
    dispatch({ type: 'UPDATE_SESSION_TIME', payload: { workshopId, minutes } })
  }

  const getWorkshopProgress = (workshopId: string): WorkshopProgress | null => {
    return state.workshopProgress[workshopId] || null
  }

  const value = {
    state,
    dispatch,
    startWorkshop,
    completeLesson,
    completeExercise,
    completeWorkshop,
    updateSessionTime,
    getWorkshopProgress
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

// Hook to use progress context
export const useWorkshopProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useWorkshopProgress must be used within a WorkshopProgressProvider')
  }
  return context
}

// Export types for external use
export type { ProgressState, ProgressAction }