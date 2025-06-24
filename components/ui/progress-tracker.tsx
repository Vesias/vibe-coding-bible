'use client'

import React from 'react'
import { CheckCircle, Circle, Lock } from 'lucide-react'

interface ProgressStep {
  id: string
  title: string
  description: string
  completed: boolean
  locked: boolean
  duration?: string
}

interface ProgressTrackerProps {
  steps: ProgressStep[]
  currentStep?: string
  className?: string
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  steps, 
  currentStep,
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`} role="progressbar" aria-label="Lernfortschritt">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.completed
        const isLocked = step.locked
        
        return (
          <div 
            key={step.id}
            className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${
              isActive 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : isCompleted 
                  ? 'border-green-500 bg-green-50' 
                  : isLocked
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-300 bg-white hover:border-blue-300'
            }`}
            role="listitem"
          >
            <div className="flex-shrink-0 mt-1">
              {isCompleted ? (
                <CheckCircle 
                  className="w-6 h-6 text-green-600" 
                  aria-label="Abgeschlossen"
                />
              ) : isLocked ? (
                <Lock 
                  className="w-6 h-6 text-gray-400" 
                  aria-label="Gesperrt"
                />
              ) : (
                <Circle 
                  className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  aria-label={isActive ? 'Aktuell' : 'Ausstehend'}
                />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${
                isLocked ? 'text-gray-500' : isCompleted ? 'text-green-800' : isActive ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {step.title}
              </h3>
              <p className={`text-sm mt-1 ${
                isLocked ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {step.description}
              </p>
              {step.duration && (
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                  isLocked 
                    ? 'bg-gray-200 text-gray-500' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {step.duration}
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-500 mt-1">
              {index + 1}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressTracker