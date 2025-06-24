// Migration layer for workshop content - maintaining backward compatibility
// This file provides the same interface as the original workshop-content.ts
// while using the new modularized structure underneath

import { 
  workshopRegistry, 
  getWorkshopById as getWorkshopByIdNew,
  getAllWorkshops as getAllWorkshopsNew,
  getWorkshopRequirements as getWorkshopRequirementsNew
} from './commandments'
import { WorkshopData, WorkshopRegistry } from './types'

// Export types for backward compatibility
export type { WorkshopLesson, WorkshopExercise, WorkshopData } from './types'

// Export the workshop content in the original format
export const workshopContent: WorkshopRegistry = workshopRegistry

// Export helper functions with the same signatures
export const getWorkshopById = getWorkshopByIdNew
export const getAllWorkshops = getAllWorkshopsNew  
export const getWorkshopRequirements = getWorkshopRequirementsNew

// Additional utilities that may be needed
export const getWorkshopIds = (): string[] => {
  return Object.keys(workshopRegistry)
}

export const searchWorkshops = (searchTerm: string): WorkshopData[] => {
  const term = searchTerm.toLowerCase()
  return getAllWorkshops().filter(workshop => 
    workshop.title.toLowerCase().includes(term) ||
    workshop.description.toLowerCase().includes(term) ||
    workshop.learningObjectives.some(obj => obj.toLowerCase().includes(term))
  )
}

export const getWorkshopsByPrerequisite = (prerequisite: string): WorkshopData[] => {
  return getAllWorkshops().filter(workshop =>
    workshop.prerequisites.includes(prerequisite)
  )
}