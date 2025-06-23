'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/ui/navigation'
import { UserContentHub } from '@/components/community/UserContentHub'
import { BacklinkStrategy } from '@/components/seo/BacklinkStrategy'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Link, Share2, TrendingUp } from 'lucide-react'

export default function CommunityPage() {
  return (
    <AppLayout>
      <PageHeader
        title="🌟 Divine Community"
        description="Connect with fellow prophets, share wisdom, and spread the sacred knowledge of AI-assisted development across the digital realm."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Community' }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="content" className="gap-2">
              <Users className="h-4 w-4" />
              User Content
            </TabsTrigger>
            <TabsTrigger value="backlinks" className="gap-2">
              <Link className="h-4 w-4" />
              Backlink Strategy
            </TabsTrigger>
            <TabsTrigger value="outreach" className="gap-2">
              <Share2 className="h-4 w-4" />
              Influencer Program
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <UserContentHub />
          </TabsContent>

          <TabsContent value="backlinks">
            <BacklinkStrategy />
          </TabsContent>

          <TabsContent value="outreach">
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">🚀 Influencer Cooperation Program</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our divine mission to spread AI-assisted development wisdom. Partner with us to create valuable content and grow together.
              </p>
              <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                <div className="p-6 border rounded-lg">
                  <h4 className="font-bold mb-2">👑 Prophet Partners</h4>
                  <p className="text-sm text-gray-600 mb-4">Top-tier developers and thought leaders</p>
                  <ul className="text-sm space-y-1">
                    <li>• Revenue sharing on referrals</li>
                    <li>• Co-branded content opportunities</li>
                    <li>• Speaking opportunities at events</li>
                    <li>• Early access to new features</li>
                  </ul>
                </div>
                <div className="p-6 border rounded-lg">
                  <h4 className="font-bold mb-2">✨ Content Creators</h4>
                  <p className="text-sm text-gray-600 mb-4">YouTubers, bloggers, course creators</p>
                  <ul className="text-sm space-y-1">
                    <li>• Affiliate commissions</li>
                    <li>• Custom promo codes</li>
                    <li>• Content collaboration</li>
                    <li>• Cross-promotion opportunities</li>
                  </ul>
                </div>
                <div className="p-6 border rounded-lg">
                  <h4 className="font-bold mb-2">🌱 Rising Developers</h4>
                  <p className="text-sm text-gray-600 mb-4">Growing developers and students</p>
                  <ul className="text-sm space-y-1">
                    <li>• Free premium access</li>
                    <li>• Mentorship opportunities</li>
                    <li>• Portfolio building support</li>
                    <li>• Community recognition</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">📊 Growth Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Track the spread of divine wisdom across the digital realm.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                <div className="p-6 border rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">12,847</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="text-xs text-green-600 mt-1">+23% this month</div>
                </div>
                <div className="p-6 border rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-600">Backlinks</div>
                  <div className="text-xs text-green-600 mt-1">+12 this week</div>
                </div>
                <div className="p-6 border rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">234</div>
                  <div className="text-sm text-gray-600">User Content</div>
                  <div className="text-xs text-green-600 mt-1">+8 today</div>
                </div>
                <div className="p-6 border rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600">4.8</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                  <div className="text-xs text-gray-600 mt-1">from 1,247 reviews</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}