'use client'

import { Badge } from '@/components/ui/badge'

interface ExperienceStepProps {
  profile: any
  updateProfile: (updates: any) => void
}

export function ExperienceStep({ profile, updateProfile }: ExperienceStepProps) {
  const experienceLevels = [
    {
      value: 'absolute-beginner',
      label: 'Absolute Beginner',
      description: 'New to coding, ready to start the divine journey',
      icon: '🌱'
    },
    {
      value: 'some-experience',
      label: 'Some Experience',
      description: 'Familiar with basics, seeking deeper wisdom',
      icon: '🌿'
    },
    {
      value: 'intermediate',
      label: 'Intermediate Developer',
      description: 'Building projects, ready for advanced techniques',
      icon: '🌳'
    },
    {
      value: 'experienced',
      label: 'Experienced Developer',
      description: 'Seasoned coder, seeking AI-assisted mastery',
      icon: '🏛️'
    }
  ]

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Your experience level helps us tailor the perfect learning path for your divine coding journey.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experienceLevels.map((level) => (
          <div
            key={level.value}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
              profile.experienceLevel === level.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => updateProfile({ experienceLevel: level.value })}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{level.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{level.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{level.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}