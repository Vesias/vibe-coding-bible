'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PersonalInfoStepProps {
  profile: any
  updateProfile: (updates: any) => void
}

export function PersonalInfoStep({ profile, updateProfile }: PersonalInfoStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Connect with the divine coding community (optional but recommended).
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Username</Label>
          <Input
            id="github"
            type="text"
            value={profile.githubUsername || ''}
            onChange={(e) => updateProfile({ githubUsername: e.target.value })}
            placeholder="your-github-username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discord">Discord Username</Label>
          <Input
            id="discord"
            type="text"
            value={profile.discordUsername || ''}
            onChange={(e) => updateProfile({ discordUsername: e.target.value })}
            placeholder="YourDiscord#1234"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            type="text"
            value={profile.timezone || ''}
            onChange={(e) => updateProfile({ timezone: e.target.value })}
            placeholder="e.g., UTC, EST, PST"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        This information helps us connect you with fellow coders in your region and schedule collaborative sessions.
      </p>
    </div>
  )
}