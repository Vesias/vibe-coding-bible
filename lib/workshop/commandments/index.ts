// Workshop Registry - Central hub for all commandments
import { WorkshopRegistry } from '../types'
import { commandmentI } from './commandment-i'
import { commandmentII } from './commandment-ii'

// Workshop Registry - Dynamic imports for better performance
export const workshopRegistry: WorkshopRegistry = {
  'i': commandmentI,
  'ii': commandmentII,
  // More commandments will be added here as we modularize
}

// Helper functions for workshop access
export const getWorkshopById = (id: string) => {
  return workshopRegistry[id]
}

export const getAllWorkshops = () => {
  return Object.values(workshopRegistry)
}

export const getWorkshopRequirements = (workshopId: string): string[] => {
  const workshop = getWorkshopById(workshopId)
  return workshop?.prerequisites || []
}

export const getWorkshopsByDifficulty = (difficulty: string) => {
  return getAllWorkshops().filter(workshop => 
    workshop.difficulty.toLowerCase() === difficulty.toLowerCase()
  )
}

export const getNextWorkshop = (currentWorkshopId: string) => {
  const currentWorkshop = getWorkshopById(currentWorkshopId)
  if (!currentWorkshop?.nextCommandment) return null
  return getWorkshopById(currentWorkshop.nextCommandment)
}

// Workshop content utilities
export const calculateTotalXP = () => {
  return getAllWorkshops().reduce((total, workshop) => total + workshop.totalXP, 0)
}

export const getWorkshopProgress = (completedWorkshops: string[]) => {
  const total = getAllWorkshops().length
  const completed = completedWorkshops.length
  return Math.round((completed / total) * 100)
}