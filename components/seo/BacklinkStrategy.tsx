'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Award, 
  Share2, 
  Link, 
  Search,
  Target,
  Zap,
  Crown,
  BookOpen,
  Code,
  Globe,
  MessageCircle
} from 'lucide-react'

interface BacklinkOpportunity {
  id: string
  domain: string
  authority: number
  type: 'guest_post' | 'resource_page' | 'broken_link' | 'mention' | 'directory' | 'forum' | 'community'
  topic: string
  description: string
  potential: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  status: 'prospecting' | 'outreach' | 'negotiating' | 'content_creation' | 'published' | 'rejected'
  contact?: string
  notes?: string
}

interface ContentIdea {
  id: string
  title: string
  type: 'tutorial' | 'case_study' | 'tool_comparison' | 'industry_insight' | 'research' | 'interview'
  target_sites: string[]
  keywords: string[]
  value_prop: string
  difficulty: 'easy' | 'medium' | 'hard'
  potential_links: number
}

const backlinkOpportunities: BacklinkOpportunity[] = [
  {
    id: '1',
    domain: 'dev.to',
    authority: 92,
    type: 'community',
    topic: 'AI-Assisted Development Best Practices',
    description: 'Active dev community with high engagement on AI/ML content',
    potential: 'high',
    effort: 'low',
    status: 'prospecting',
    contact: 'community@dev.to'
  },
  {
    id: '2', 
    domain: 'hackernoon.com',
    authority: 86,
    type: 'guest_post',
    topic: 'The Future of Programming with AI Tools',
    description: 'Tech publication accepting guest posts on emerging technologies',
    potential: 'high',
    effort: 'medium',
    status: 'outreach',
    contact: 'editors@hackernoon.com'
  },
  {
    id: '3',
    domain: 'github.com/awesome-lists',
    authority: 98,
    type: 'resource_page',
    topic: 'Awesome AI Development Tools',
    description: 'Curated list of AI development resources',
    potential: 'medium',
    effort: 'low',
    status: 'content_creation'
  },
  {
    id: '4',
    domain: 'reddit.com/r/programming',
    authority: 95,
    type: 'community',
    topic: 'AI Coding Success Stories',
    description: 'Share success stories and engage with programming community',
    potential: 'medium',
    effort: 'low',
    status: 'prospecting'
  },
  {
    id: '5',
    domain: 'medium.com',
    authority: 94,
    type: 'guest_post',
    topic: 'Building SaaS with AI: Complete Guide',
    description: 'Tech publication with large developer audience',
    potential: 'high',
    effort: 'medium',
    status: 'negotiating'
  }
]

const contentIdeas: ContentIdea[] = [
  {
    id: '1',
    title: 'The Complete Guide to AI-Assisted SaaS Development in 2024',
    type: 'tutorial',
    target_sites: ['dev.to', 'hackernoon.com', 'freecodecamp.org'],
    keywords: ['AI development', 'SaaS building', 'Claude Code', 'GitHub Copilot'],
    value_prop: 'Step-by-step guide with real examples and code samples',
    difficulty: 'medium',
    potential_links: 15
  },
  {
    id: '2',
    title: 'Case Study: Building 3 Production Apps Without Writing Code Manually',
    type: 'case_study',
    target_sites: ['medium.com', 'indiehackers.com', 'producthunt.com'],
    keywords: ['no-code', 'AI development', 'startup success'],
    value_prop: 'Real metrics, revenue numbers, and lessons learned',
    difficulty: 'easy',
    potential_links: 12
  },
  {
    id: '3',
    title: 'Claude Code vs GitHub Copilot vs Cursor: The Ultimate Comparison',
    type: 'tool_comparison',
    target_sites: ['stackoverflow.blog', 'slashdata.co', 'techcrunch.com'],
    keywords: ['AI coding tools', 'developer productivity', 'code generation'],
    value_prop: 'Detailed benchmarks and real-world usage scenarios',
    difficulty: 'hard',
    potential_links: 25
  }
]

export function BacklinkStrategy() {
  const [activeTab, setActiveTab] = useState('opportunities')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500'
      case 'content_creation': return 'bg-blue-500'
      case 'negotiating': return 'bg-yellow-500'
      case 'outreach': return 'bg-purple-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🔗 Divine Backlink Strategy
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Spread the sacred wisdom across the digital realm. Build high-quality backlinks through valuable content and genuine community engagement.
        </p>
      </div>

      {/* Strategy Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities" className="gap-2">
            <Target className="h-4 w-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Content Ideas
          </TabsTrigger>
          <TabsTrigger value="outreach" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Outreach
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Backlink Opportunities */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-6">
            {backlinkOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Globe className="h-5 w-5" />
                        {opportunity.domain}
                        <Badge variant="outline" className="text-xs">
                          DA: {opportunity.authority}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {opportunity.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(opportunity.status)} text-white`}>
                        {opportunity.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPotentialColor(opportunity.potential)}>
                        {opportunity.potential} potential
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      📝 Topic: {opportunity.topic}
                    </h4>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Type: {opportunity.type.replace('_', ' ')}</span>
                      <span>Effort: {opportunity.effort}</span>
                      {opportunity.contact && <span>Contact: {opportunity.contact}</span>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Visit Site
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Start Outreach
                      </Button>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Link className="h-4 w-4" />
                      Track Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Ideas */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6">
            {contentIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{idea.title}</CardTitle>
                  <CardDescription className="text-base">
                    {idea.value_prop}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {idea.type.replace('_', ' ')}
                    </Badge>
                    <Badge className={idea.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                                   idea.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                   'bg-red-100 text-red-800'}>
                      {idea.difficulty} difficulty
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      ~{idea.potential_links} potential links
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">🎯 Target Sites:</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.target_sites.map((site) => (
                        <Badge key={site} variant="outline">{site}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">🔍 Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Search className="h-4 w-4" />
                      Research
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Code className="h-4 w-4" />
                      Start Creating
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Outreach Templates */}
        <TabsContent value="outreach" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Guest Post Pitch Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm">
                  <p className="mb-4">Subject: Guest Post Idea: The Future of AI-Assisted Development</p>
                  <p className="mb-4">Hi [Name],</p>
                  <p className="mb-4">I've been following [Publication] and really enjoyed your recent piece on [specific article]. 
                  I'm the creator of Vibe Coding Bible, where we teach developers to master AI-assisted programming.</p>
                  <p className="mb-4">I'd love to contribute a guest post on "The 10 Sacred Commandments of AI Development" - 
                  a comprehensive guide based on building 50+ production apps with AI tools.</p>
                  <p className="mb-4">The article would include:
                  - Practical code examples
                  - Real metrics and case studies  
                  - Actionable frameworks
                  - Tool comparisons</p>
                  <p>Would this be a good fit for your audience?</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Resource Page Outreach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm">
                  <p className="mb-4">Subject: Addition to your awesome-ai-tools list</p>
                  <p className="mb-4">Hi [Maintainer],</p>
                  <p className="mb-4">Thanks for maintaining the awesome-ai-tools repository - it's incredibly valuable 
                  for the developer community!</p>
                  <p className="mb-4">I'd like to suggest adding Vibe Coding Bible to the learning resources section. 
                  It's a comprehensive interactive workshop that teaches developers to master AI-assisted programming 
                  through hands-on exercises.</p>
                  <p className="mb-4">Key features:
                  - 10 structured commandments/modules
                  - Real-time AI mentoring
                  - Gamified learning with XP system
                  - Community collaboration features</p>
                  <p>Happy to provide more details if helpful!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Backlinks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">127</div>
                <p className="text-sm text-gray-600">+23 this month</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>High Authority (90+)</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medium Authority (70-89)</span>
                    <span className="font-semibold">34</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Low Authority (&lt;70)</span>
                    <span className="font-semibold">85</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Referral Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
                <p className="text-sm text-gray-600">visitors this month</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>dev.to</span>
                    <span className="font-semibold">892</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>medium.com</span>
                    <span className="font-semibold">654</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>hackernoon.com</span>
                    <span className="font-semibold">421</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Content Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                <p className="text-sm text-gray-600">acceptance rate</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Published</span>
                    <span className="font-semibold">17</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In Progress</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rejected</span>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'The Complete Guide to AI-Assisted Development', site: 'dev.to', traffic: 1247, links: 8 },
                  { title: 'Building SaaS Without Code: A Case Study', site: 'medium.com', traffic: 892, links: 5 },
                  { title: 'Claude vs Copilot: Developer Productivity Analysis', site: 'hackernoon.com', traffic: 654, links: 12 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">Published on {item.site}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{item.traffic} visitors</div>
                      <div className="text-sm text-gray-600">{item.links} backlinks</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}