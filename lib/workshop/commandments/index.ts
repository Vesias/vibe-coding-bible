// Workshop Registry - Central hub for all commandments
import { WorkshopRegistry } from '../types'
import { commandmentI } from './commandment-i'
import { commandmentII } from './commandment-ii'
import { commandmentIII } from './commandment-iii'
import { commandmentIV } from './commandment-iv'
import { commandmentV } from './commandment-v'
import { commandmentVI } from './commandment-vi'
import { commandmentVII } from './commandment-vii'
import { commandmentVIII } from './commandment-viii'
import { commandmentIX } from './commandment-ix'
import { commandmentX } from './commandment-x'

// Workshop Registry - All 10 Sacred Commandments
export const workshopRegistry: WorkshopRegistry = {
  'i': commandmentI,
  'ii': commandmentII,
  'iii': commandmentIII,
  'iv': commandmentIV,
  'v': commandmentV,
  'vi': commandmentVI,
  'vii': commandmentVII,
  'viii': commandmentVIII,
  'ix': commandmentIX,
  'x': commandmentX
}

// Helper functions for workshop access
export const getWorkshopById = (id: string) => {
  return workshopRegistry[id]
}

export const getAllWorkshops = () => {
  return Object.values(workshopRegistry)
}

// Enhanced workshop functions that integrate markdown content
export const getEnhancedWorkshopById = async (id: string) => {
  const workshop = workshopRegistry[id]
  if (!workshop) return null
  
  // In a client-side environment, we'll just return the structured data
  // The markdown integration would typically happen server-side
  return workshop
}

export const getAllEnhancedWorkshops = async () => {
  // In a client-side environment, return the structured workshops
  // The markdown integration would typically happen server-side
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