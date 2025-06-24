'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Euro,
  FileText,
  Shield,
  Clock,
  RefreshCw
} from 'lucide-react'
import { formatPrice } from '@/lib/stripe/server'
import { toast } from '@/hooks/use-toast'

interface Subscription {
  id: string
  status: string
  plan_name: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  trial_end?: string
  amount: number
  currency: string
  interval: 'month' | 'year'
  stripe_customer_id: string
}

interface PaymentHistory {
  id: string
  amount: number
  currency: string
  status: string
  payment_date: string
  invoice_url?: string
  receipt_url?: string
  failure_reason?: string
}

export function BillingDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      const [subResponse, historyResponse] = await Promise.all([
        fetch('/api/billing/subscription'),
        fetch('/api/billing/payment-history')
      ])

      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData)
      }

      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setPaymentHistory(historyData)
      }
    } catch (error) {
      console.error('Error fetching billing data:', error)
      toast({
        title: 'Fehler',
        description: 'Rechnungsdaten konnten nicht geladen werden.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setActionLoading('portal')
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          return_url: `${window.location.origin}/dashboard/billing`
        })
      })

      const data = await response.json()
      if (response.ok) {
        window.location.href = data.url
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Billing-Portal konnte nicht geöffnet werden.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Möchten Sie Ihr Abonnement wirklich kündigen? Die Kündigung wird zum Ende der aktuellen Abrechnungsperiode wirksam.')) {
      return
    }

    setActionLoading('cancel')
    try {
      const response = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'User requested cancellation via dashboard'
        })
      })

      if (response.ok) {
        toast({
          title: 'Kündigung erfolgreich',
          description: 'Ihr Abonnement wird zum Ende der aktuellen Abrechnungsperiode gekündigt.',
        })
        fetchBillingData()
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kündigung konnte nicht verarbeitet werden.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReactivateSubscription = async () => {
    setActionLoading('reactivate')
    try {
      const response = await fetch('/api/billing/reactivate-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        toast({
          title: 'Reaktivierung erfolgreich',
          description: 'Ihr Abonnement wurde erfolgreich reaktiviert.',
        })
        fetchBillingData()
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Reaktivierung konnte nicht verarbeitet werden.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Wird gekündigt
      </Badge>
    }

    switch (status) {
      case 'active':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Aktiv
        </Badge>
      case 'trialing':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Testphase
        </Badge>
      case 'past_due':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Zahlung überfällig
        </Badge>
      case 'canceled':
        return <Badge variant="outline" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Gekündigt
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Aktuelles Abonnement
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihr Abonnement und Ihre Zahlungsmethoden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{subscription.plan_name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatPrice(subscription.amount)} / {subscription.interval === 'month' ? 'Monat' : 'Jahr'}
                  </p>
                </div>
                {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Aktuelle Periode:</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                  </p>
                </div>

                {subscription.trial_end && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Testphase endet:</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(subscription.trial_end)}
                    </p>
                  </div>
                )}
              </div>

              {subscription.cancel_at_period_end && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ihr Abonnement wird am {formatDate(subscription.current_period_end)} gekündigt. 
                    Sie können es bis dahin reaktivieren.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleManageBilling}
                  disabled={actionLoading === 'portal'}
                  className="flex items-center gap-2"
                >
                  {actionLoading === 'portal' && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <CreditCard className="h-4 w-4" />
                  Zahlungsmethoden verwalten
                </Button>

                {subscription.cancel_at_period_end ? (
                  <Button 
                    variant="outline"
                    onClick={handleReactivateSubscription}
                    disabled={actionLoading === 'reactivate'}
                    className="flex items-center gap-2"
                  >
                    {actionLoading === 'reactivate' && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <CheckCircle className="h-4 w-4" />
                    Reaktivieren
                  </Button>
                ) : (
                  <Button 
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={actionLoading === 'cancel'}
                    className="flex items-center gap-2"
                  >
                    {actionLoading === 'cancel' && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <XCircle className="h-4 w-4" />
                    Kündigen
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Kein aktives Abonnement</h3>
              <p className="text-gray-600 mb-4">
                Wählen Sie einen Plan, um auf alle Premium-Features zuzugreifen.
              </p>
              <Button asChild>
                <a href="/pricing">Plan auswählen</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rechnungsverlauf
          </CardTitle>
          <CardDescription>
            Ihre Zahlungshistorie und Rechnungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      payment.status === 'succeeded' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {payment.status === 'succeeded' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatPrice(payment.amount * 100, payment.currency.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(payment.payment_date)}
                        {payment.failure_reason && (
                          <span className="text-red-600 ml-2">
                            - {payment.failure_reason}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={payment.status === 'succeeded' ? 'default' : 'destructive'}>
                      {payment.status === 'succeeded' ? 'Bezahlt' : 'Fehlgeschlagen'}
                    </Badge>
                    {payment.invoice_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={payment.invoice_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>Noch keine Zahlungen vorhanden</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* German Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rechtliche Hinweise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Widerrufsrecht</h4>
              <p className="text-sm text-gray-600">
                Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen 
                Ihren Vertrag zu widerrufen.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Kündigung</h4>
              <p className="text-sm text-gray-600">
                Abonnements können jederzeit zum Ende der Abrechnungsperiode 
                gekündigt werden.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Mehrwertsteuer</h4>
              <p className="text-sm text-gray-600">
                Alle Preise verstehen sich inklusive der gesetzlichen 
                Mehrwertsteuer (19%).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Support</h4>
              <p className="text-sm text-gray-600">
                Bei Fragen zu Ihrer Rechnung wenden Sie sich an 
                <a href="mailto:billing@vibecodingbible.agentland.saarland" className="text-blue-600 hover:underline ml-1">
                  billing@vibecodingbible.agentland.saarland
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}