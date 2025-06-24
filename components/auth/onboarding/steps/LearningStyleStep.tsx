'use client'

interface LearningStyleStepProps {
  profile: any
  updateProfile: (updates: any) => void
}

export function LearningStyleStep({ profile, updateProfile }: LearningStyleStepProps) {
  const learningStyles = [
    { value: 'visual', label: 'Visual Learner', description: 'Learn through diagrams and examples', icon: '👁️' },
    { value: 'hands-on', label: 'Hands-on Practitioner', description: 'Learn by doing and building', icon: '🛠️' },
    { value: 'collaborative', label: 'Collaborative Seeker', description: 'Learn through discussion and teamwork', icon: '🤝' },
    { value: 'structured', label: 'Structured Scholar', description: 'Follow systematic learning paths', icon: '📋' }
  ]

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        How do you learn best? This helps us personalize your experience.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {learningStyles.map((style) => (
          <div
            key={style.value}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
              profile.learningStyle === style.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => updateProfile({ learningStyle: style.value })}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{style.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{style.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{style.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}