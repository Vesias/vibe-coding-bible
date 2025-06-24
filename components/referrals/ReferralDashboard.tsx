'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, ExternalLink, Euro, Users, TrendingUp, Wallet } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface ReferralStats {
  referral_code: string
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  total_referrals: number
  successful_conversions: number
  total_clicks: number
  conversion_rate: number
}

interface ReferralConversion {
  id: string
  referee_id: string
  purchase_amount: number
  commission_amount: number
  currency: string
  status: string
  conversion_date: string
  profiles: {
    full_name: string
    username: string
  }
}

export function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [conversions, setConversions] = useState<ReferralConversion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [payoutAmount, setPayoutAmount] = useState('')
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer')

  const supabase = createClient()

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load referral stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (statsError) {
        console.error('Error loading referral stats:', statsError)
      } else {
        setStats(statsData)
      }

      // Load conversions
      const { data: conversionsData, error: conversionsError } = await supabase
        .from('referral_conversions')
        .select(`
          *,
          profiles!referee_id (
            full_name,
            username
          )
        `)
        .eq('referrer_id', user.id)
        .order('conversion_date', { ascending: false })
        .limit(50)

      if (conversionsError) {
        console.error('Error loading conversions:', conversionsError)
      } else {
        setConversions(conversionsData || [])
      }
    } catch (error) {
      console.error('Error loading referral data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralLink = () => {
    if (!stats?.referral_code) return

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodingbible.agentland.saarland'
    const referralUrl = `${baseUrl}?ref=${stats.referral_code}`
    
    navigator.clipboard.writeText(referralUrl)
    toast({
      title: 'Link kopiert!',
      description: 'Der Referral-Link wurde in die Zwischenablage kopiert.',
    })
  }

  const copyReferralCode = () => {
    if (!stats?.referral_code) return

    navigator.clipboard.writeText(stats.referral_code)
    toast({
      title: 'Code kopiert!',
      description: 'Der Referral-Code wurde in die Zwischenablage kopiert.',
    })
  }

  const requestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast({
        title: 'Ungültiger Betrag',
        description: 'Bitte geben Sie einen gültigen Auszahlungsbetrag ein.',
        variant: 'destructive',
      })
      return
    }

    const amount = parseFloat(payoutAmount)
    if (amount > (stats?.pending_earnings || 0)) {
      toast({
        title: 'Unzureichender Betrag',
        description: 'Der Auszahlungsbetrag übersteigt Ihr verfügbares Guthaben.',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch('/api/referrals/request-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          method: payoutMethod,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payout request failed')
      }

      toast({
        title: 'Auszahlung beantragt',
        description: 'Ihre Auszahlungsanfrage wurde eingereicht und wird bearbeitet.',
      })

      setPayoutAmount('')
      loadReferralData() // Refresh data
    } catch (error) {
      console.error('Error requesting payout:', error)
      toast({
        title: 'Fehler',
        description: 'Auszahlungsanfrage konnte nicht eingereicht werden.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Lade Referral-Daten...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-slate-600">Referral-Daten konnten nicht geladen werden.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Referral Dashboard</h1>
        <p className="text-slate-600">
          Verdiene 15% Provision für jeden erfolgreichen Referral
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamteinnahmen</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.total_earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Alle Zeit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verfügbar</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{stats.pending_earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Zur Auszahlung bereit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erfolgreiche Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successful_conversions}</div>
            <p className="text-xs text-muted-foreground">
              von {stats.total_clicks} Klicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Klicks zu Käufen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="share" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="share">Teilen</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="payout">Auszahlung</TabsTrigger>
        </TabsList>

        {/* Share Tab */}
        <TabsContent value="share" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ihr Referral-Link</CardTitle>
              <CardDescription>
                Teilen Sie diesen Link und verdienen Sie 15% von jedem Verkauf
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Referral-Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={stats.referral_code}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Referral-Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodingbible.agentland.saarland'}?ref=${stats.referral_code}`}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_APP_URL || 'https://vibecodingbible.agentland.saarland'}?ref=${stats.referral_code}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">So funktioniert's:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Teilen Sie Ihren Link in sozialen Medien, Blogs oder direkt</li>
                  <li>• Neue Nutzer melden sich über Ihren Link an</li>
                  <li>• Bei jedem Kauf erhalten Sie 15% Provision</li>
                  <li>• Provisionen werden automatisch Ihrem Konto gutgeschrieben</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ihre Conversions</CardTitle>
              <CardDescription>
                Übersicht über alle erfolgreichen Referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Noch keine Conversions vorhanden.
                </div>
              ) : (
                <div className="space-y-4">
                  {conversions.map((conversion) => (
                    <div
                      key={conversion.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {conversion.profiles?.full_name || conversion.profiles?.username || 'Unbekannt'}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(conversion.conversion_date).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          €{conversion.commission_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500">
                          von €{conversion.purchase_amount.toFixed(2)}
                        </div>
                        <Badge
                          variant={conversion.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {conversion.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payout Tab */}
        <TabsContent value="payout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auszahlung beantragen</CardTitle>
              <CardDescription>
                Beantragen Sie eine Auszahlung Ihrer verfügbaren Provisionen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Betrag (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={stats.pending_earnings}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Mindestens €10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Auszahlungsmethode</Label>
                  <select
                    id="method"
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="bank_transfer">Banküberweisung</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Verfügbar für Auszahlung:</strong> €{stats.pending_earnings.toFixed(2)}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Mindestauszahlung: €10,00 | Bearbeitungszeit: 3-5 Werktage
                </p>
              </div>

              <Button
                onClick={requestPayout}
                disabled={!payoutAmount || parseFloat(payoutAmount) < 10 || parseFloat(payoutAmount) > stats.pending_earnings}
                className="w-full"
              >
                Auszahlung beantragen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}