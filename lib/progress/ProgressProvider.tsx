'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'

// Mock types to replace database types
interface MockUserProgress {
  id: string
  workshop_id: string
  user_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  progress_percentage: number
  last_accessed: string
}

interface MockWorkshop {
  id: string
  title: string
  commandment_number: number
  description: string
  is_published: boolean
  difficulty_level: string
  estimated_duration: number
}

interface ProgressContextType {
  workshops: MockWorkshop[]
  userProgress: MockUserProgress[]
  loading: boolean
  refreshProgress: () => Promise<void>
  updateProgress: (workshopId: string, data: Partial<MockUserProgress>) => Promise<void>
  getWorkshopProgress: (workshopId: string) => MockUserProgress | null
  getOverallProgress: () => { completed: number; total: number; percentage: number }
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

// Mock workshops data - Static content for the 10 Commandments
const mockWorkshops: MockWorkshop[] = [
  {
    id: 'workshop-1',
    title: '1. Gebot: Der Göttliche Prompt',
    commandment_number: 1,
    description: 'Lerne die Kunst der perfekten KI-Kommunikation',
    is_published: true,
    difficulty_level: 'Beginner',
    estimated_duration: 30
  },
  {
    id: 'workshop-2',
    title: '2. Gebot: Die Heilige Iteration',
    commandment_number: 2,
    description: 'Meistere iterative Entwicklung mit KI-Unterstützung',
    is_published: true,
    difficulty_level: 'Beginner',
    estimated_duration: 45
  },
  {
    id: 'workshop-3',
    title: '3. Gebot: Das Sakrale Testing',
    commandment_number: 3,
    description: 'Entwickle unzerstörbare Software durch intelligentes Testen',
    is_published: true,
    difficulty_level: 'Intermediate',
    estimated_duration: 60
  },
  {
    id: 'workshop-4',
    title: '4. Gebot: Die Mystische Dokumentation',
    commandment_number: 4,
    description: 'Erschaffe selbsterklärende und lebendige Dokumentation',
    is_published: true,
    difficulty_level: 'Intermediate',
    estimated_duration: 30
  },
  {
    id: 'workshop-5',
    title: '5. Gebot: Die Transzendente Architektur',
    commandment_number: 5,
    description: 'Baue skalierbare und elegante Softwarearchitekturen',
    is_published: true,
    difficulty_level: 'Advanced',
    estimated_duration: 90
  },
  {
    id: 'workshop-6',
    title: '6. Gebot: Das Erleuchtete Debugging',
    commandment_number: 6,
    description: 'Finde und eliminiere Bugs mit göttlicher Präzision',
    is_published: true,
    difficulty_level: 'Intermediate',
    estimated_duration: 45
  },
  {
    id: 'workshop-7',
    title: '7. Gebot: Die Himmlische Performance',
    commandment_number: 7,
    description: 'Optimiere deine Anwendungen für göttliche Geschwindigkeit',
    is_published: true,
    difficulty_level: 'Advanced',
    estimated_duration: 75
  },
  {
    id: 'workshop-8',
    title: '8. Gebot: Die Göttliche Sicherheit',
    commandment_number: 8,
    description: 'Schütze deine Anwendungen vor allen Übeln',
    is_published: true,
    difficulty_level: 'Advanced',
    estimated_duration: 60
  },
  {
    id: 'workshop-9',
    title: '9. Gebot: Die Erleuchtete Kollaboration',
    commandment_number: 9,
    description: 'Arbeite harmonisch im Team mit KI-Unterstützung',
    is_published: true,
    difficulty_level: 'Intermediate',
    estimated_duration: 45
  },
  {
    id: 'workshop-10',
    title: '10. Gebot: Die Heilige Monetarisierung',
    commandment_number: 10,
    description: 'Verwandle dein Können in nachhaltigen Erfolg',
    is_published: true,
    difficulty_level: 'Advanced',
    estimated_duration: 90
  }
]

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [workshops, setWorkshops] = useState<MockWorkshop[]>(mockWorkshops)
  const [userProgress, setUserProgress] = useState<MockUserProgress[]>([])
  const [loading, setLoading] = useState(false) // No loading needed for mock

  const refreshProgress = async () => {
    // Mock: Set workshops and empty progress for public access
    setWorkshops(mockWorkshops)
    setUserProgress([])
    setLoading(false)
  }

  const updateProgress = async (workshopId: string, data: Partial<MockUserProgress>) => {
    // Mock: Just log the action for now
    console.log('Mock: updateProgress called', { workshopId, data })
  }

  const getWorkshopProgress = (workshopId: string): MockUserProgress | null => {
    return userProgress.find(p => p.workshop_id === workshopId) || null
  }

  const getOverallProgress = () => {
    const total = workshops.length
    const completed = userProgress.filter(p => p.status === 'completed' || p.status === 'mastered').length
    const percentage = total > 0 ? (completed / total) * 100 : 0

    return { completed, total, percentage }
  }

  useEffect(() => {
    // Initialize with mock data
    refreshProgress()
  }, [user])

  return (
    <ProgressContext.Provider value={{
      workshops,
      userProgress,
      loading,
      refreshProgress,
      updateProgress,
      getWorkshopProgress,
      getOverallProgress
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}