'use client'

import { Badge } from '@/components/ui/badge'

interface InterestsStepProps {
  profile: any
  updateProfile: (updates: any) => void
}

export function InterestsStep({ profile, updateProfile }: InterestsStepProps) {
  const interests = [
    'Web Development', 'Mobile Apps', 'AI/Machine Learning', 'Data Science',
    'DevOps', 'Game Development', 'Blockchain', 'Cloud Computing',
    'Cybersecurity', 'UI/UX Design', 'Backend Systems', 'Frontend Frameworks'
  ]

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests || []
    if (currentInterests.includes(interest)) {
      updateProfile({
        interests: currentInterests.filter((i: string) => i !== interest)
      })
    } else {
      updateProfile({
        interests: [...currentInterests, interest]
      })
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Select the technologies and areas that spark your divine inspiration. Choose as many as you like!
      </p>
      
      <div className="flex flex-wrap gap-3">
        {interests.map((interest) => (
          <Badge
            key={interest}
            variant={profile.interests?.includes(interest) ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
              profile.interests?.includes(interest)
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'hover:bg-blue-50 hover:border-blue-300'
            }`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </Badge>
        ))}
      </div>
      
      {profile.interests?.length > 0 && (
        <p className="text-sm text-green-600">
          Selected {profile.interests.length} interest{profile.interests.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}