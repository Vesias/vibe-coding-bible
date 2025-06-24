'use client'

import { Badge } from '@/components/ui/badge'

interface GoalsStepProps {
  profile: any
  updateProfile: (updates: any) => void
}

export function GoalsStep({ profile, updateProfile }: GoalsStepProps) {
  const goals = [
    'Learn new technologies', 'Build portfolio projects', 'Get certified',
    'Find mentorship', 'Join coding communities', 'Start a tech career',
    'Improve existing skills', 'Contribute to open source', 'Launch a startup',
    'Become a mentor', 'Learn best practices', 'Master algorithms'
  ]

  const toggleGoal = (goal: string) => {
    const currentGoals = profile.goals || []
    if (currentGoals.includes(goal)) {
      updateProfile({
        goals: currentGoals.filter((g: string) => g !== goal)
      })
    } else {
      updateProfile({
        goals: [...currentGoals, goal]
      })
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        What do you hope to achieve on your divine coding journey?
      </p>
      
      <div className="flex flex-wrap gap-3">
        {goals.map((goal) => (
          <Badge
            key={goal}
            variant={profile.goals?.includes(goal) ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
              profile.goals?.includes(goal)
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'hover:bg-blue-50 hover:border-blue-300'
            }`}
            onClick={() => toggleGoal(goal)}
          >
            {goal}
          </Badge>
        ))}
      </div>
    </div>
  )
}